// import React, { useState } from "react";
// import "./LoginAsStu.css";
// import homepageImg from "../../Assets/Homepage.jpg";

// const LoginAsStu = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const validateForm = () => {
//     if (!email || !password) {
//       setError("Both fields are required.");
//       return false;
//     }
//     setError("");
//     return true;
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await fetch('http://localhost:5000/api/student/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ email, password })
//         });
        
//         const data = await response.json();
        
//         if (!response.ok) {
//           throw new Error(data.error || 'Login failed');
//         }
        
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify({
//           ...data.user,
//           token: data.token  // Store token in user object
//         }));
//         window.location.href = '/student-dashboard'; 
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   };
  

//   return (
//     <div className="full-page-container">
//       <div className="background-overlay">
//         <img src={homepageImg} alt="Background" className="full-page-image" />
//       </div>
//       <div className="content-overlay">
//         <h2 className="login-text">STUDENT LOGIN</h2>
//         <form className="login-form" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email ID"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           {error && <p className="error-text">{error}</p>}
//           <button type="submit">LOGIN</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginAsStu;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginAsStu.css";
import homepageImg from "../../Assets/Homepage.jpg";

const LoginAsStu = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:5000/api/student/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userData', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        enrollment: user.enrollment
      }));

      // Redirect with navigation API instead of window.location
      navigate('/student-dashboard', { 
        replace: true, // Prevent going back to login
        state: { fromLogin: true } // Optional state
      });

    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Login failed. Please try again.';
      setError(errorMessage);
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
        <h2 className="login-text">STUDENT LOGIN</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            className={error && !email.trim() ? "input-error" : ""}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={error && !password.trim() ? "input-error" : ""}
          />
          {error && <p className="error-text">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAsStu;