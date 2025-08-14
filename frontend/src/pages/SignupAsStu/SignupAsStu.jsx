import React, { useState } from "react";
import homepageImg from "../../Assets/Homepage.jpg";
import "./SignupAsStu.css";

const SignupAsStu = () => {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    section: "",
    enrollmentNumber: "",
    passingYear: "",
    email: "",
    contactNumber: "",
    dateOfBirth: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let newErrors = {};

    // Required field validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!formData.section.trim()) newErrors.section = "Section is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";

    // Pattern validations
    if (!/^\d{11}$/.test(formData.enrollmentNumber)) {
      newErrors.enrollmentNumber = "Enrollment Number must be exactly 11 digits";
    }
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact Number must be exactly 10 digits";
    }
    if (!/^\d{4}$/.test(formData.passingYear)) {
      newErrors.passingYear = "Passing Year must be 4 digits";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/student/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          course: formData.course,
          section: formData.section,
          enrollmentNumber: formData.enrollmentNumber,
          passingYear: parseInt(formData.passingYear),
          email: formData.email,
          contactNumber: formData.contactNumber,
          dateOfBirth: formData.dateOfBirth,
          password: formData.password
        })
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Signup failed');
      }
  
      alert("Signup successful! Please login.");
      window.location.href = '/login-student';
  
    } catch (err) {
      setErrors({
        general: err.message || 'Failed to connect to server. Check your network.'
      });
      console.error('Signup error:', err);
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
        <h2 className="signup-title">STUDENT SIGNUP</h2>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <input type="text" name="name" placeholder="Name" 
            value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}

          <input type="text" name="course" placeholder="Course" 
            value={formData.course} onChange={handleChange} />
          {errors.course && <span className="error">{errors.course}</span>}

          <input type="text" name="section" placeholder="Section" 
            value={formData.section} onChange={handleChange} />
          {errors.section && <span className="error">{errors.section}</span>}

          <input type="text" name="enrollmentNumber" placeholder="Enrollment Number" 
            value={formData.enrollmentNumber} onChange={handleChange} />
          {errors.enrollmentNumber && <span className="error">{errors.enrollmentNumber}</span>}

          <input type="text" name="passingYear" placeholder="Passing Year" 
            value={formData.passingYear} onChange={handleChange} />
          {errors.passingYear && <span className="error">{errors.passingYear}</span>}

          <input type="email" name="email" placeholder="Email ID" 
            value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}

          <input type="text" name="contactNumber" placeholder="Contact Number" 
            value={formData.contactNumber} onChange={handleChange} />
          {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}

          <input type="date" name="dateOfBirth" 
            value={formData.dateOfBirth} onChange={handleChange} />
          {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}

          <input type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupAsStu;