import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../api";
import "./UpcomingEventList.css";
import Certificate from '../Certificate/Certificate';

const UpcomingEvents = ({ showFilters, searchTerm }) => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    timeframe: "all",
    cost: "all",
    type: "all",
    competition: "all",
    attendance: "all"
  });
  const [certificateData, setCertificateData] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const fetchEvents = async () => {
    try {
      const events = await getEvents();
      setUpcomingEvents(events);
      setFilteredEvents(events);
      setError("");
    } catch (err) {
      setError("Failed to load events");
      console.error("Events fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, upcomingEvents]);

  const applyFilters = () => {
    let result = [...upcomingEvents];

    if (searchTerm) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.timeframe !== "all") {
      const today = new Date();
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.timeframe) {
          case "today":
            return diffDays === 0;
          case "tomorrow":
            return diffDays === 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    if (filters.cost !== "all") {
      result = result.filter(event => event.cost === filters.cost);
    }

    if (filters.type !== "all") {
      result = result.filter(event => event.eventType === filters.type);
    }

    if (filters.competition !== "all") {
      const isCompetition = filters.competition === "yes";
      result = result.filter(event => event.isCompetition === isCompetition);
    }

    if (filters.attendance !== "all") {
      result = result.filter(event => {
        if (filters.attendance === "registered") {
          return true; // Replace with actual registration check
        } else if (filters.attendance === "attended") {
          return true; // Replace with actual attendance check
        }
        return true;
      });
    }

    setFilteredEvents(result);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      timeframe: "all",
      cost: "all",
      type: "all",
      competition: "all",
      attendance: "all"
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        navigate('/login-student');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      alert('Successfully registered for the event!');
      fetchEvents();
    } catch (error) {
      alert(`Registration error: ${error.message}`);
      console.error('Registration failed:', { error, eventId });
    }
  };

  const handleMarkAttendance = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        navigate('/login-student');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/attend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Attendance marking failed');
      }

      alert('Attendance marked successfully!');
      fetchEvents();
    } catch (error) {
      alert(`Attendance error: ${error.message}`);
      console.error('Attendance failed:', error);
    }
  };

  const handleGenerateCertificate = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        navigate('/login-student');
        return;
      }

      const response = await fetch('http://localhost:5000/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_id: eventId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Certificate generation failed');
      }

      const data = await response.json();
      setCertificateData(data);
      setShowCertificate(true);
    } catch (error) {
      alert(`Certificate error: ${error.message}`);
      console.error('Certificate generation failed:', error);
    }
  };

  const handleSeeResults = (eventId) => {
    navigate(`/event-results/${eventId}`);
  };

  const handleEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="upcoming-events-container">
      {showFilters && (
        <div className="filters-section">
          <div className="filter-group">
            <label>Timeframe:</label>
            <select
              value={filters.timeframe}
              onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">Next 7 Days</option>
              <option value="month">Next 30 Days</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Cost:</label>
            <select
              value={filters.cost}
              onChange={(e) => handleFilterChange('cost', e.target.value)}
            >
              <option value="all">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Technical">Technical</option>
              <option value="Non-Technical">Non-Technical</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Competition:</label>
            <select
              value={filters.competition}
              onChange={(e) => handleFilterChange('competition', e.target.value)}
            >
              <option value="all">All</option>
              <option value="yes">Competition</option>
              <option value="no">Non-Competition</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Attendance:</label>
            <select
              value={filters.attendance}
              onChange={(e) => handleFilterChange('attendance', e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="registered">Registered</option>
              <option value="attended">Attended</option>
            </select>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      <h2 className="section-title">UPCOMING EVENTS</h2>

      {loading && <p className="loading">LOADING EVENTS...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="events-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                {event.isCompetition && (
                  <span className="competition-tag">🏆 Competition</span>
                )}
              </div>
              <div className="event-details">
                <p><span className="detail-label">Date:</span> {formatDate(event.date)}</p>
                <p><span className="detail-label">Time:</span> {event.time}</p>
                <p><span className="detail-label">Location:</span> {event.location}</p>
                <p><span className="detail-label">Type:</span> {event.eventType}</p>
                <p><span className="detail-label">Cost:</span> {event.cost}</p>
                <p className="event-description">{event.description}</p>
              </div>
              <div className="event-buttons">
                <button
                  className="register-btn"
                  onClick={() => handleRegister(event.id)}
                >
                  REGISTER
                </button>
                <button
                  className="attendance-btn"
                  onClick={() => handleMarkAttendance(event.id)}
                >
                  MARK ATTENDANCE
                </button>
                {event.isCompetition && (
                  <button
                    className="results-btn"
                    onClick={() => handleSeeResults(event.id)}
                  >
                    SEE RESULTS
                  </button>
                )}
                <button
                  className="details-btn"
                  onClick={() => handleEventDetails(event.id)}
                >
                  DETAILS
                </button>
                <button
                  className="certificate-btn"
                  onClick={() => handleGenerateCertificate(event.id)}
                >
                  CERTIFICATE
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <div className="no-events">
            <p>NO EVENTS FOUND</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {showCertificate && (
        <Certificate
          certificateData={certificateData}
          onClose={() => setShowCertificate(false)}
          onDownload={() => {
            alert('Certificate download functionality will be implemented here');
          }}
        />
      )}
    </div>
  );
};

export default UpcomingEvents;