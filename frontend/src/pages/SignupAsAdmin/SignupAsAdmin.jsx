import React, { useState } from "react";
import homepageImg from "../../Assets/Homepage.jpg";
import "./SignupAsAdmin.css";

const SignupAsAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    position: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
    if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "10 digits required";
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password)) {
      newErrors.password = "8+ chars with uppercase, lowercase, and number";
    }
    if (!formData.position.trim()) newErrors.position = "Position required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Signup failed");
      
      window.location.href = data.redirect || "/login-admin";

    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="full-page-container">
      <div className="background-overlay">
        <img src={homepageImg} alt="Background" className="full-page-image" />
      </div>
      <div className="content-overlay">
        <h2 className="login-title">ADMIN SIGNUP</h2>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="error-message">{errors.general}</div>}

          <input type="text" name="name" placeholder="Name" 
            value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}

          <input type="email" name="email" placeholder="Email ID" 
            value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}

          <input type="text" name="contactNumber" placeholder="Contact Number" 
            value={formData.contactNumber} onChange={handleChange} />
          {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}

          <input type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}

          <input type="text" name="position" placeholder="Position" 
            value={formData.position} onChange={handleChange} />
          {errors.position && <span className="error">{errors.position}</span>}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupAsAdmin;