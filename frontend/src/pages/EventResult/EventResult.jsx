import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BG from "../../Assets/BG.png";
import "./EventResult.css";

const EventResult = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        // Fetch results for this event
        const resultsResponse = await fetch(`http://localhost:5000/api/events/${eventId}/results`);
        
        if (resultsResponse.status === 404) {
          // No results found is not an error in this case
          setResults(null);
        } else if (!resultsResponse.ok) {
          throw new Error('Failed to fetch results');
        } else {
          const resultsData = await resultsResponse.json();
          setResults(resultsData);
        }

        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
  <div className="EventResult" style={{ backgroundImage: `url(${BG})` }}>
    <div className="event-results-container">
      <h2>EVENT RESULTS</h2>
      
      {event && (
        <div className="event-info">
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
      )}

      {results ? (
        <div className="results-content">
          <div className="result-section winner-section">
            <h4>🥇 Winner</h4>
            <p className="winner-name">{results.winner}</p>
          </div>

          <div className="result-section runner-up-section">
            <h4>🥈 Runner-Up</h4>
            <p className="runner-up-name">{results.runner_up}</p>
          </div>

          <div className="result-meta">
            <p>Results posted on: {new Date(results.posted_at).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="no-results">
          <p>No results have been posted for this event yet.</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default EventResult;