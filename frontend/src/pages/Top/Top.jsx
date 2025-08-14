// Top.jsx
import { 
  FaPlusCircle, 
  FaListAlt, 
  FaTrophy, 
  FaSignOutAlt, 
  FaQuestionCircle,
  FaUserCircle 
} from "react-icons/fa";
import TopImage from "../../Assets/Top.png";
import "./Top.css";

const Top = ({ setActiveTab, activeTab, onLogout }) => {  // Make sure activeTab is in the destructured props
  return (
    <nav
      className="TopBar"
      style={{
        backgroundImage: `url(${TopImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <h2 className="TopBar-title">CampusEase: Admin Dashboard</h2>
      <div className="TopBar-links">
        <button className="TopBar-item" onClick={() => setActiveTab("addEvent")}>
          <FaPlusCircle /> ADD EVENT
        </button>
        <button className="TopBar-item" onClick={() => setActiveTab("eventList")}>
          <FaListAlt /> EVENT LIST
        </button>
        <button className="TopBar-item" onClick={() => setActiveTab("queries")}>
          <FaQuestionCircle /> QUERIES
        </button>
        <button className="TopBar-item logout-button" onClick={onLogout}>
          <FaSignOutAlt /> LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Top;