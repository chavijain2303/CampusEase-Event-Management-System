import homepageImg from "../../Assets/Homepage.jpg";
import Navbar from "../../components/Navigation/Navigation.jsx";
import { Link } from "react-router-dom";
import './Home.css';

const Home = () => {
  return (
    <div className="full-page-container">
      {/* Background Image */}
      <div className="background-overlay">
        <img src={homepageImg} alt="College Event Ideas" className="full-page-image" />
      </div>

      {/* Gallery Button */}
      <Link to="/gallery" className="gallery-button">
        Gallery
      </Link>

      {/* Welcome Text Above Content */}
      <div className="welcome-container">
        <h1 className="welcome-text">CampusEase</h1>
      </div>

      {/* Centered Content */}
      <div className="content-overlay">
        <Navbar />
      </div>
    </div>
  );
};

export default Home;