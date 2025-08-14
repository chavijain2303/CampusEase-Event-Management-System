import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import BG from "../../Assets/BG.png";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const { eventId } = useParams();
  const [eventName, setEventName] = useState("");
  const [winner, setWinner] = useState("");
  const [runnerUp, setRunnerUp] = useState("");
  const [message, setMessage] = useState("");

  // Get event name from navigation state
  useEffect(() => {
    if (location.state?.eventName) {
      setEventName(location.state.eventName);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName || !winner || !runnerUp) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage("Authentication required");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/results`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          winner,
          runnerUp
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post results');
      }

      setMessage("Result Posted Successfully!");
      setWinner("");
      setRunnerUp("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="result" style={{ backgroundImage: `url(${BG})` }}>
      <div className="result-container">
        <h2>POST EVENT RESULT</h2>
        {message && <p className={`message ${message.includes("Success") ? "success" : "error"}`}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name:</label>
            <input 
              type="text" 
              value={eventName} 
              onChange={(e) => setEventName(e.target.value)} 
              placeholder="Enter event name" 
              required 
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label>Winner:</label>
            <input 
              type="text" 
              value={winner} 
              onChange={(e) => setWinner(e.target.value)} 
              placeholder="Enter winner name" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Runner-Up:</label>
            <input 
              type="text" 
              value={runnerUp} 
              onChange={(e) => setRunnerUp(e.target.value)} 
              placeholder="Enter runner-up name" 
              required 
            />
          </div>

          <button type="submit" className="submit-btn">POST RESULT</button>
        </form>
      </div>
    </div>
  );
};

export default Result;