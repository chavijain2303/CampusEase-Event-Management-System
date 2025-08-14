import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getEvents, deleteEvent } from "../../api";
import "./AdminEventList.css";

const AdminEventList = ({ showFilters, searchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    timeframe: "all",
    cost: "all",
    type: "all",
    competition: "all",
    availability: "all",
    sort: "newest"
  });

  const fetchEvents = async () => {
    try {
      const events = await getEvents();
      setEvents(events);
      setFilteredEvents(events);
      setError("");
    } catch (err) {
      setError("Failed to load events");
      console.error("Events fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to permanently delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setFilteredEvents(prev => prev.filter(event => event.id !== eventId));
        setError('');
      } catch (error) {
        setError(error.message || 'Failed to delete event');
      }
    }
  };

  useEffect(() => {
    if (location.state?.refreshEvents) {
      fetchEvents();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, events]);

  const getEventStatus = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today ? 'past' : 'upcoming';
  };

  const applyFilters = () => {
    let result = [...events];
    
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    
    if (filters.timeframe !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(filters.timeframe) {
          case "today":
            return diffDays === 0;
          case "tomorrow":
            return diffDays === 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          case "past":
            return diffDays < 0;
          default:
            return true;
        }
      });
    }
    
    if (filters.cost !== "all") {
      result = result.filter(event => 
        event.cost?.toLowerCase() === filters.cost.toLowerCase()
      );
    }
    
    if (filters.type !== "all") {
      result = result.filter(event => 
        event.eventType?.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    if (filters.competition !== "all") {
      const isCompetition = filters.competition === "yes";
      result = result.filter(event => event.isCompetition === isCompetition);
    }

    if (filters.availability !== "all") {
      result = result.filter(event => event.availability === filters.availability);
    }
    
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filters.sort === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredEvents(result);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      timeframe: "all",
      cost: "all",
      type: "all",
      competition: "all",
      availability: "all",
      sort: "newest"
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-event-list">
      <h2>ADMIN EVENT LIST</h2>
      
      {showFilters && (
        <div className="filters-section">
          <div className="filter-group">
            <label>Timeframe:</label>
            <select 
              value={filters.timeframe}
              onChange={(e) => handleFilterChange('timeframe', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">Next 7 Days</option>
              <option value="month">Next 30 Days</option>
              <option value="past">Past Events</option>
            </select>
            {filters.timeframe !== "all" && (
              <span className="selected-filter">
                {filters.timeframe.charAt(0).toUpperCase() + filters.timeframe.slice(1)}
              </span>
            )}
          </div>
          
          <div className="filter-group">
            <label>Cost:</label>
            <select 
              value={filters.cost}
              onChange={(e) => handleFilterChange('cost', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            {filters.cost !== "all" && (
              <span className="selected-filter">
                {filters.cost.charAt(0).toUpperCase() + filters.cost.slice(1)}
              </span>
            )}
          </div>
          
          <div className="filter-group">
            <label>Type:</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </select>
            {filters.type !== "all" && (
              <span className="selected-filter">
                {filters.type.charAt(0).toUpperCase() + filters.type.slice(1).replace('-', ' ')}
              </span>
            )}
          </div>
          
          <div className="filter-group">
            <label>Competition:</label>
            <select 
              value={filters.competition}
              onChange={(e) => handleFilterChange('competition', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="yes">Competition</option>
              <option value="no">Non-Competition</option>
            </select>
            {filters.competition !== "all" && (
              <span className="selected-filter">
                {filters.competition === "yes" ? "Competition" : "Non-Competition"}
              </span>
            )}
          </div>

          <div className="filter-group">
            <label>Availability:</label>
            <select 
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="all">Open to All</option>
              <option value="specific">Specific Students</option>
            </select>
            {filters.availability !== "all" && (
              <span className="selected-filter">
                {filters.availability === "all" ? "Open to All" : "Specific Students"}
              </span>
            )}
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <span className="selected-filter">
              {filters.sort === "newest" ? "Newest First" : "Oldest First"}
            </span>
          </div>

          <button 
            className="reset-filters-btn"
            onClick={resetFilters}
          >
            Reset All Filters
          </button>
        </div>
      )}
      
      {loading && <p className="loading">LOADING EVENTS...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="event-cards-container">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const eventStatus = getEventStatus(event.date);
            
            return (
              <div 
                className={`event-card ${eventStatus}-event`} 
                key={event.id}
                data-status={eventStatus}
              >
                <div className="event-card-header">
                  <h3>{event.title}</h3>
                  <span className="event-status-badge">
                    {eventStatus === 'upcoming' ? 'Upcoming' : 'Past'}
                  </span>
                </div>
                
                <div className="event-card-details">
                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>

                  {event.isCompetition && (
                    <p className="competition-tag">🏆 Competition Event</p>
                  )}

                  {event.availability === 'specific' && (
                    <div className="specific-details">
                      <p><strong>Eligibility:</strong></p>
                      <div className="eligibility-tags">
                        {event.batch && (
                          <span className="eligibility-tag">
                            <strong>Batch:</strong> {event.batch}
                          </span>
                        )}
                        {event.course && (
                          <span className="eligibility-tag">
                            <strong>Course:</strong> {event.course}
                            {event.course === 'Btech' && event.branch && (
                              <span> ({event.branch})</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="event-meta-info">
                    <span className={`event-tag ${event.eventType?.replace(' ', '-').toLowerCase()}`}>
                      {event.eventType || 'Technical'}
                    </span>
                    <span className={`event-tag ${event.cost?.toLowerCase()}`}>
                      {event.cost || 'Unpaid'}
                    </span>
                  </div>

                  <p className="event-desc"><strong>Description:</strong> {event.description}</p>
                </div>

                <div className="event-buttons">
                  <button
                    className="event-btn registered-btn"
                    onClick={() => navigate(`/total-students/${event.id}`)}
                  >
                    REGISTERED STUDENTS 
                  </button>
                  <button
                    className="event-btn attended-btn"
                    onClick={() => navigate(`/attended-students/${event.id}`)}
                  >
                    ATTENDED STUDENTS
                  </button>
                  <button
                    className="event-btn details-btn"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    EVENT DETAILS
                  </button>
                  {event.isCompetition && (
                    <button
                      className="event-btn result-btn"
                      onClick={() => navigate(`/post-result/${event.id}`, { state: { eventName: event.title } })}
                    >
                      POST RESULT
                    </button>
                  )}
                  <button
                    className="event-btn delete-btn"
                    onClick={() => handleDelete(event.id)}
                  >
                    DELETE EVENT
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          !loading && <div className="no-events">
            <p>NO EVENTS FOUND</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventList;