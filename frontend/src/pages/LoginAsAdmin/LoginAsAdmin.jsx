// import React, { useState } from "react";
// import homepageImg from "../../Assets/Homepage.jpg";
// import "./LoginAsAdmin.css";

// const LoginAsAdmin = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//     general: "" // Add general error
//   });

//   const validateForm = () => {
//     let valid = true;
//     let newErrors = { email: "", password: "" };

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//       valid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//       valid = false;
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//       valid = false;
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await fetch('http://localhost:5000/api/admin/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(formData)
//         });
        
//         const data = await response.json();
        
//         if (!response.ok) {
//           throw new Error(data.error || 'Login failed');
//         }
        
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify({
//           ...data.user,
//           token: data.token  // Store token in user object if needed
//         }));
//         window.location.href = '/admin';
//       } catch (err) {
//   const errorMessage = err.message === 'Failed to fetch' 
//     ? 'Network error - check backend connection'
//     : err.message;
//   setErrors(prev => ({...prev, general: errorMessage}));
// }
//     }
//   };

//   return (
//     <div className="full-page-container">
//       <div className="background-overlay">
//         <img src={homepageImg} alt="Background" className="full-page-image" />
//       </div>

//       <div className="content-overlay">
//         <h2 className="login-text">ADMIN LOGIN</h2>
//         <form className="login-form" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email ID"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           {errors.email && <p className="error-text">{errors.email}</p>}

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           {errors.password && <p className="error-text">{errors.password}</p>}

//           <button type="submit">LOGIN</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginAsAdmin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import homepageImg from "../../Assets/Homepage.jpg";
import "./LoginAsAdmin.css";

const LoginAsAdmin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
        general: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      general: ""
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('adminData', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position
      }));

      // Redirect with navigation API
      navigate('/admin', {
        replace: true, // Prevent going back to login
        state: { fromLogin: true }
      });

    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error - please check your connection";
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - please try again";
      }

      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="full-page-container">
      <div className="background-overlay">
        <img src={homepageImg} alt="Background" className="full-page-image" />
      </div>

      <div className="content-overlay">
        <h2 className="login-text">ADMIN LOGIN</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            autoComplete="username"
            disabled={isLoading}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            autoComplete="current-password"
            disabled={isLoading}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          {errors.general && <p className="error-text general-error">{errors.general}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAsAdmin;