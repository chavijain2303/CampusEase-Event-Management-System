from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as genai
from datetime import datetime

# Flask app setup
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///event_management.db"
app.config['SECRET_KEY'] = 'event_management_secret_key'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# CORS setup
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500"]}})

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student, faculty, admin
    department = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50))  # academic, cultural, sports, etc.
    registration_required = db.Column(db.Boolean, default=False)
    max_participants = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    attendance = db.Column(db.Boolean, default=False)

# Set your API key for Gemini
API_KEY = 'AIzaSyDtjAgKI9RQt3fSc0Rqb7B-oUbJWg_D0-o'  # Replace with your actual API key
genai.configure(api_key=API_KEY)

# Update the INITIAL_SYSTEM_PROMPT to be more event-focused
INITIAL_SYSTEM_PROMPT = """
You are 'EventGenie', a specialized assistant for the College Event Management System. Your capabilities include:

1. **Event Information**:
   - Provide detailed information about upcoming events
   - Share event schedules, locations, and organizers
   - Explain event categories (academic, cultural, sports, etc.)

2. **Registration Assistance**:
   - Guide users through registration processes
   - Check registration status
   - Handle registration queries (deadlines, requirements)

3. **User-Specific Support**:
   - For students: Help discover relevant events
   - For faculty: Assist with event organization
   - For admins: Support system management tasks

4. **System Navigation**:
   - Explain how to use different features
   - Troubleshoot common issues
   - Provide quick access to important functions

Response Guidelines:
- Be concise but informative
- Format event details clearly with:
  • Title
  • Date/Time
  • Location
  • Description
  • Registration info
- For actions requiring authentication, verify user role first
- Maintain a friendly, professional tone
- Response time under 3 seconds
"""

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-1.5-pro")

# Global chat context (for simplicity, but may need user-specific context in a real app)
chat = model.start_chat(history=[{"role": "model", "parts": [{"text": INITIAL_SYSTEM_PROMPT}]}])

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'student')
    department = data.get('department')

    # Validation checks
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    new_user = User(
        firstname=firstname,
        lastname=lastname,
        email=email,
        username=username,
        password=hashed_password,
        role=role,
        department=department
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    # Set the session to keep the user logged in
    session['user_id'] = user.id
    session['user_role'] = user.role

    return jsonify({
        'success': True,
        'message': 'Login successful!',
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'department': user.department
        }
    }), 200

@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.date.asc()).all()
    event_list = []
    for event in events:
        organizer = User.query.get(event.organizer_id)
        event_list.append({
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'location': event.location,
            'organizer': organizer.username,
            'category': event.category,
            'registration_required': event.registration_required,
            'max_participants': event.max_participants
        })
    return jsonify(event_list)

# Enhanced chat endpoint with event context
@app.route('/chat', methods=['POST'])
def chat_endpoint():
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Get user and upcoming events for context
    user = User.query.get(session['user_id'])
    events = Event.query.filter(Event.date >= datetime.utcnow()).order_by(Event.date.asc()).all()
    
    # Prepare context for the AI
    context = {
        'user_role': user.role,
        'user_department': user.department,
        'upcoming_events': [
            {
                'title': event.title,
                'date': event.date.isoformat(),
                'location': event.location,
                'category': event.category,
                'registration_required': event.registration_required
            }
            for event in events[:5]  # Send only the next 5 events
        ]
    }
    
    # Add context to the message
    contextual_message = f"[CONTEXT: {context}] USER QUESTION: {user_message}"
    
    try:
        response = chat.send_message({
            "role": "user",
            "parts": [{"text": contextual_message}]
        })
        return jsonify({'reply': response.text})
    except Exception as e:
        app.logger.error(f"Chat error: {str(e)}")
        return jsonify({'reply': "I'm having trouble processing your request. Please try again later."})
    
def get_gemini_response(message):
    try:
        # Send the user's message and receive the response
        response = chat.send_message({"role": "user", "parts": [{"text": message}]})
        return response.text
    except Exception as e:
        print(f"Error: {str(e)}")
        return "Sorry, I'm having trouble responding right now. Please try again later."

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)