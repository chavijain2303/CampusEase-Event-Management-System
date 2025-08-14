import React from "react";
import { Link } from "react-router-dom";
import homepageImg from "../../Assets/Homepage.jpg";
import "./Signup.css";

function Signup() {
  return (
    <div className="signup-page-container">
      {/* Background Image */}
      <div className="background-overlay">
        <img src={homepageImg} alt="Background" className="full-page-image" />
      </div>
      
      {/* Content Overlay */}
      <div className="signup-content">
        <h2 id="s">SIGNUP</h2>
        <div className="signup-buttons">
          <Link to="/signup/admin" className="signup-button">SIGNUP AS ADMIN</Link>
          <Link to="/signup/student" className="signup-button">SIGN UP AS STUDENT</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
