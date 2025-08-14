import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Feedback.css';

const Feedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    studentName: '',
    enrollmentNumber: '',
    eventTitle: '',
    eventDate: '',
    rating: 5,
    comments: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login-student');
          return;
        }

        // Fetch student details
        const studentResponse = await fetch('http://localhost:5000/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!studentResponse.ok) {
          throw new Error('Failed to fetch student details');
        }

        const studentData = await studentResponse.json();

        // Fetch event details
        const eventResponse = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();

        setFeedbackData(prev => ({
          ...prev,
          studentName: studentData.name,
          enrollmentNumber: studentData.enrollmentNumber,
          eventTitle: eventData.title,
          eventDate: eventData.date
        }));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          studentName: feedbackData.studentName,
          enrollmentNumber: feedbackData.enrollmentNumber,
          eventTitle: feedbackData.eventTitle,
          rating: feedbackData.rating,
          comments: feedbackData.comments
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Feedback submission failed');
      }

      alert('Feedback submitted successfully!');
      navigate('/events');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="feedback-page">
    <div className="feedback-container">
      <h2>Event Feedback</h2>
      <div className="feedback-info">
        <p><strong>Student Name:</strong> {feedbackData.studentName}</p>
        <p><strong>Enrollment Number:</strong> {feedbackData.enrollmentNumber}</p>
        <p><strong>Event:</strong> {feedbackData.eventTitle}</p>
        <p><strong>Event Date:</strong> {new Date(feedbackData.eventDate).toLocaleDateString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            name="rating"
            value={feedbackData.rating}
            onChange={handleChange}
            required
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={feedbackData.comments}
            onChange={handleChange}
            rows="5"
            placeholder="Share your detailed feedback about the event..."
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="submit-btn"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Feedback;