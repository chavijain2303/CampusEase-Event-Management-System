import { FaCalendarAlt, FaEnvelope, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "./TopBar.css";
import TopImage from "../../Assets/Top.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TopBar = ({ setActiveTab, activeTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Remove token from local storage
      localStorage.removeItem('token');
      
      // Optional: Call the logout endpoint if you need server-side cleanup
      await axios.post('/api/logout');
      
      // Redirect to login page
      navigate('/login-student');
      
      // Optional: Reload the page to reset the application state
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still proceed with client-side logout even if server logout fails
      localStorage.removeItem('token');
      navigate('/login-student');
    }
  };

  return (
    <nav className="TopBar"
          style={{
            backgroundImage: `url(${TopImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
      <div className="TopBar-left">
        <button 
          className={`profile-button ${activeTab === "profile" ? "active" : ""}`} 
          onClick={() => setActiveTab("profile")}
        >
          <FaUserCircle className="profile-icon" />
          <span className="profile-text">Profile</span>
        </button>
      </div>
      
      <h2 className="TopBar-title">CampusEase: Student Dashboard</h2>
      
      <div className="TopBar-links">
        <button 
          className={`TopBar-item ${activeTab === "upcoming" ? "active" : ""}`} 
          onClick={() => setActiveTab("upcoming")}
        >
          <FaCalendarAlt /> EVENTS
        </button>
        <button 
          className={`TopBar-item ${activeTab === "contact" ? "active" : ""}`} 
          onClick={() => setActiveTab("contact")}
        >
          <FaEnvelope /> CONTACT ADMIN
        </button>
        <button 
          className="TopBar-item logout-button" 
          onClick={handleLogout}
        > 
          <FaSignOutAlt /> LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default TopBar;