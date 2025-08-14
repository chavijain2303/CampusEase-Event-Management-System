import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MarkAttendance.css";
import BG from "../../Assets/BG.png";

const MarkAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    eventId: "",
    eventName: "",
    email: "",
    course: "",
    section: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state?.eventId && state?.eventName) {
      setFormData(prev => ({
        ...prev,
        eventId: state.eventId,
        eventName: state.eventName
      }));
    }
  }, [state]);

  const validate = () => {
    let newErrors = {};
    if (!/^[0-9]{11}$/.test(formData.enrollmentNumber)) {
      newErrors.enrollmentNumber = "Enrollment Number must be 11 digits";
    }
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact Number must be 10 digits";
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login-student');
        return;
      }

      const { eventId, ...attendanceData } = formData;

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Attendance submission failed');
      }

      alert('Attendance successfully marked!');
      navigate('/events'); // Redirect back to events page
      
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Attendance submission error:', error);
    }
  };

  return (
    <div className="attendance"
          style={{
            backgroundImage: `url(${BG})`,
          }}>
    <div className="mark-attendance-container">
      <h2>MARK YOUR ATTENDANCE</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="enrollmentNumber"
          placeholder="Enrollment Number"
          value={formData.enrollmentNumber}
          onChange={handleChange}
          required
        />
        {errors.enrollmentNumber && <p className="error">{errors.enrollmentNumber}</p>}

        <input
          type="text"
          name="eventName"
          placeholder="Event Name"
          value={formData.eventName}
          readOnly={!!state?.eventName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        {errors.contact && <p className="error">{errors.contact}</p>}

        <button type="submit">SUBMIT ATTENDANCE</button>
      </form>
    </div>
    </div>
  );
};

export default MarkAttendance;