import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
      <Link className="no-bg-button" to="/login">Login</Link>
      <Link className="no-bg-button" to="/signup">Signup</Link>
      </div>
    </nav>
  );
};

export default Navigation;

