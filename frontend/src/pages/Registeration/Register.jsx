import { useState, useEffect } from "react"; // Combined import
import { useParams, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    email: "",
    eventName: "" // Will be populated via API call
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const eventData = await response.json();
        setFormData(prev => ({ 
          ...prev, 
          eventName: eventData.title 
        }));
      } catch (error) {
        console.error("Error fetching event:", error);
        alert("Error loading event details");
      }
    };
    
    if (id) fetchEventDetails();
  }, [id]); // Run when ID changes


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.enrollmentNumber.trim()) {
      newErrors.enrollmentNumber = "Enrollment Number is required";
    } else if (!/^\d+$/.test(formData.enrollmentNumber)) {
      newErrors.enrollmentNumber = "Enrollment Number must be numeric";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Update the fetch call in handleSubmit to include the name
      const response = await fetch(`http://localhost:5000/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',  // Add this line
        body: JSON.stringify({
          name: formData.name, // Add this line
          enrollmentNumber: formData.enrollmentNumber,
          email: formData.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      alert(`Successfully registered for ${formData.eventName}!`);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setFormData({
        name: "",
        enrollmentNumber: "",
        email: "",
        eventName: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="register-container">
      <h2>EVENT REGISTRATION</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Enrollment Number:</label>
          <input
            type="text"
            name="enrollmentNumber"
            value={formData.enrollmentNumber}
            onChange={handleChange}
            placeholder="Enter enrollment number"
          />
          {errors.enrollmentNumber && (
            <p className="error-text">{errors.enrollmentNumber}</p>
          )}
        </div>

        <div className="form-group">
          <label>Email ID:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            readOnly
          />
        </div>

        <button type="submit" className="register-button">
          REGISTER
        </button>
      </form>
    </div>
  );
};

export default Register;
