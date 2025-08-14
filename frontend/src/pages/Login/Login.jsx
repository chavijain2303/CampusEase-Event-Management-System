import React from "react";
import { Link } from "react-router-dom";
import homepageImg from "../../Assets/Homepage.jpg";
import "./Login.css";

function Login() {
  return (
    <div className="login-page-container">
      {/* Background Image */}
      <div className="background-overlay">
        <img src={homepageImg} alt="Background" className="full-page-image" />
      </div>
      
      {/* Content Overlay */}
      <div className="login-content">
        <h2>LOGIN</h2>
        <div className="login-buttons">
          <Link to="/login-admin" className="login-button">LOGIN AS ADMIN</Link>
          <Link to="/login-student" className="login-button">LOGIN AS STUDENT</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
