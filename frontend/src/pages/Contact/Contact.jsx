import React, { useState, useEffect } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    adminName: "",
    concern: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    // Fetch student details from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'student') {
      setStudentDetails({
        name: user.name,
        enrollment: user.enrollment || user.id
      });
      
      // Auto-fill the form fields
      setFormData(prev => ({
        ...prev,
        name: user.name,
        enrollmentNumber: user.enrollment || user.id
      }));
    }
  }, []);

  const handleChange = (e) => {
    // Only allow changing adminName and concern fields
    if (e.target.name === 'adminName' || e.target.name === 'concern') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit query');
      }

      setMessage({ 
        text: "Your concern has been submitted successfully!", 
        type: "success" 
      });
      // Reset only the editable fields
      setFormData(prev => ({
        ...prev,
        adminName: "",
        concern: ""
      }));
    } catch (error) {
      setMessage({ 
        text: error.message || "Failed to submit your concern", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h2>CONTACT ADMIN</h2>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Your Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label>Enrollment Number:</label>
          <input
            type="text"
            name="enrollmentNumber"
            value={formData.enrollmentNumber}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Admin Name:</label>
          <input
            type="text"
            name="adminName"
            placeholder="Enter admin name you want to contact"
            value={formData.adminName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Concern:</label>
          <textarea
            name="concern"
            placeholder="Describe your concern"
            value={formData.concern}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "SUBMIT"}
        </button>
      </form>
    </div>
  );
};

export default Contact;