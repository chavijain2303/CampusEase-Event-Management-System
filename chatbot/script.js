// Enhanced message display with event formatting
function displayMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = className;
    
    // Format bot responses to highlight event information
    if (className === 'bot-message') {
        // Detect event information patterns and format them
        const formattedMessage = formatEventInfo(message);
        messageElement.innerHTML = `<strong>EventGenie:</strong> ${formattedMessage}`;
        
        // Add interactive buttons for event actions
        addInteractiveButtons(message, messageElement);
    } else {
        messageElement.innerHTML = `<strong>You:</strong> ${message}`;
    }
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Format event information in responses
function formatEventInfo(message) {
    // Format event titles
    let formatted = message.replace(/"([^"]+)"/g, '<strong>"$1"</strong>');
    
    // Format dates and times
    formatted = formatted.replace(/(\d{1,2}\/\d{1,2}\/\d{4})/g, '<span class="date-highlight">$1</span>');
    formatted = formatted.replace(/(\d{1,2}:\d{2} [AP]M)/g, '<span class="time-highlight">$1</span>');
    
    // Format locations
    formatted = formatted.replace(/at ([A-Z][\w\s]+(?:Hall|Room|Building|Center))/g, 'at <span class="location-highlight">$1</span>');
    
    return formatted;
}

// Add interactive buttons for common actions
function addInteractiveButtons(message, messageElement) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    // Check if message contains event information
    if (message.includes('Event:')) {
        // Add Register button if registration is mentioned
        if (message.includes('registration')) {
            const registerBtn = document.createElement('button');
            registerBtn.textContent = 'Register Now';
            registerBtn.onclick = function() {
                const eventName = message.match(/Event: ([^\n]+)/)[1];
                sendPredefinedMessage(`I want to register for "${eventName.trim()}"`);
            };
            buttonContainer.appendChild(registerBtn);
        }
        
        // Add Add to Calendar button
        const calendarBtn = document.createElement('button');
        calendarBtn.textContent = 'Add to Calendar';
        calendarBtn.onclick = function() {
            const eventName = message.match(/Event: ([^\n]+)/)[1];
            sendPredefinedMessage(`How do I add "${eventName.trim()}" to my calendar?`);
        };
        buttonContainer.appendChild(calendarBtn);
    }
    
    // Add buttons for common follow-up questions
    if (message.includes('successfully registered')) {
        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = 'Event Details';
        detailsBtn.onclick = function() {
            const eventName = message.match(/for "([^"]+)"/)[1];
            sendPredefinedMessage(`Tell me more about "${eventName}"`);
        };
        buttonContainer.appendChild(detailsBtn);
    }
    
    if (buttonContainer.children.length > 0) {
        messageElement.appendChild(buttonContainer);
    }
}

// Enhanced predefined questions
const PREDEFINED_QUESTIONS = {
    // Event Discovery
    'upcoming': 'Show me upcoming events this week',
    'department': `What events are happening in the ${currentUser?.department || 'Computer Science'} department?`,
    'cultural': 'Show me cultural events',
    'academic': 'Show me academic seminars and workshops',
    
    // Registration Help
    'register': 'How do I register for an event?',
    'status': 'How can I check my event registrations?',
    'cancel': 'How do I cancel an event registration?',
    
    // Event Creation (for faculty/admin)
    'create': 'What are the requirements to create a new event?',
    'resources': 'What resources are available for event organizers?',
    'promote': 'How can I promote my event?'
};

// Update quick actions based on user role
function updateQuickActions() {
    const actionsColumn = document.querySelector('.quick-actions-column ul');
    actionsColumn.innerHTML = '';
    
    // Common actions for all users
    addQuickAction('Upcoming Events', PREDEFINED_QUESTIONS.upcoming);
    addQuickAction('Department Events', PREDEFINED_QUESTIONS.department);
    addQuickAction('Cultural Events', PREDEFINED_QUESTIONS.cultural);
    addQuickAction('Registration Help', PREDEFINED_QUESTIONS.register);
    
    // Special actions for faculty/admin
    if (currentUser && (currentUser.role === 'faculty' || currentUser.role === 'admin')) {
        addQuickAction('Create Event', PREDEFINED_QUESTIONS.create);
        addQuickAction('Organizer Resources', PREDEFINED_QUESTIONS.resources);
    }
}

function addQuickAction(label, question) {
    const actionsColumn = document.querySelector('.quick-actions-column ul');
    const li = document.createElement('li');
    li.textContent = label;
    li.onclick = () => sendPredefinedMessage(question);
    actionsColumn.appendChild(li);
}