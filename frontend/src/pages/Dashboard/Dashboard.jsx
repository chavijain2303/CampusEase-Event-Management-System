import React, { useState, useEffect } from "react";
import TopBar from "../TopBar/TopBar";
import UpcomingEvents from "../EventList/UpcomingEventList";
import PastEvents from "../EventList/PastEventList";
import ContactAdmin from "../Contact/Contact";
import MarkAttendance from "../MarkAttendance/MarkAttendance";
import StudentProfilePage from "../StudentProfile/StudentProfile"; // Add this import
import BG from "../../Assets/BG.png";
import "./Dashboard.css";

// Import slide images
import Slide1 from "../../Assets/Slides/S1.jpg";
import Slide2 from "../../Assets/Slides/S2.jpg";
import Slide3 from "../../Assets/Slides/S3.jpg";
import Slide4 from "../../Assets/Slides/S4.jpg";
import Slide5 from "../../Assets/Slides/S5.jpg";
import Slide6 from "../../Assets/Slides/S6.jpg";
import Slide7 from "../../Assets/Slides/S7.jpg";
import Slide8 from "../../Assets/Slides/S8.jpg";
import Slide9 from "../../Assets/Slides/S9.jpg";
import Slide10 from "../../Assets/Slides/S10.jpg";

const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  const studentName = user?.name || "Student";

  useEffect(() => {
    if (activeTab === "") {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="student-dashboard" style={{ backgroundImage: `url(${BG})` }}>
      <TopBar setActiveTab={setActiveTab} activeTab={activeTab} /> {/* Pass activeTab prop */}
      <h2 className="student-name">WELCOME, {studentName.toUpperCase()}!</h2>

      {/* Search and Filter Buttons (only shown when events tab is active) */}
      {(activeTab === "upcoming" || activeTab === "past") && (
        <div className="event-controls-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <button 
            className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
            onClick={toggleFilters}
          >
            {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
            <i className={`fas ${showFilters ? 'fa-filter-circle-xmark' : 'fa-filter'}`}></i>
          </button>
        </div>
      )}

      <div className="student-content">
        {activeTab === "upcoming" && <UpcomingEvents showFilters={showFilters} searchTerm={searchTerm} />}
        {activeTab === "past" && <PastEvents showFilters={showFilters} searchTerm={searchTerm} />}
        {activeTab === "contact" && <ContactAdmin />}
        {activeTab === "attendance" && <MarkAttendance />}
        {activeTab === "profile" && <StudentProfilePage />} {/* Add profile tab */}
        {activeTab === "" && (
          <div className="slideshow-container">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? "active" : ""}`}
                style={{ backgroundImage: `url(${slide})` }}
              />
            ))}

            <button className="slide-arrow prev" onClick={goToPrev}>&#10094;</button>
            <button className="slide-arrow next" onClick={goToNext}>&#10095;</button>

            <div className="slideshow-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;