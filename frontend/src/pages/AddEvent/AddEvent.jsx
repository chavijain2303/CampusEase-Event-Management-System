import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api";
import "./AddEvent.css";

const AddEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    availability: "all",
    eventType: "Technical",
    cost: "Unpaid",
    batch: "",
    course: "",
    branch: "",
    isCompetition: false // New field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData({
      ...eventData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic field validation
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
      setError("Please fill all required fields");
      return;
    }

    // Specific availability validation
    if (eventData.availability === "specific") {
      if (!eventData.batch || !eventData.course) {
        setError("Please fill batch and course for specific availability");
        return;
      }
      if (eventData.course === "Btech" && !eventData.branch) {
        setError("Please select branch for B.Tech students");
        return;
      }
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not authenticated. Please log in.");

      setLoading(true);

      // Prepare payload
      const payload = {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        availability: eventData.availability,
        eventType: eventData.eventType,
        cost: eventData.cost,
        isCompetition: eventData.isCompetition,
        organizer: user.id,
      };

      // Add specific student details if needed
      if (eventData.availability === "specific") {
        payload.batch = eventData.batch;
        payload.course = eventData.course;
        if (eventData.course === "Btech") {
          payload.branch = eventData.branch;
        }
      }

      await createEvent(payload);

      // Reset form instead of navigating away
      setEventData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        availability: "all",
        eventType: "Technical",
        cost: "Unpaid",
        batch: "",
        course: "",
        branch: "",
        isCompetition: false
      });

      // Show success message
      setError(""); // Clear any previous errors
      alert("Event created successfully!"); // Or use a more elegant notification system

    } catch (err) {
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="add-event-container">
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
      
      <h2>CREATE NEW EVENT</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={eventData.location}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
          required
        ></textarea>

        <div className="checkbox-container">
          <input
            type="checkbox"
            name="isCompetition"
            id="isCompetition"
            checked={eventData.isCompetition}
            onChange={handleChange}
          />
          <label htmlFor="isCompetition">Is this event a competition?</label>
        </div>

        <select name="availability" value={eventData.availability} onChange={handleChange}>
          <option value="all">Open to All</option>
          <option value="specific">Specific Students</option>
        </select>
        
        {eventData.availability === "specific" && (
          <>
            <input
              type="text"
              name="batch"
              placeholder="Batch (e.g., 2021-2025)"
              value={eventData.batch}
              onChange={handleChange}
              required
            />

            <select 
              name="course" 
              value={eventData.course} 
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              <option value="Btech">All</option>
              <option value="Btech">B.Tech</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
            </select>

            {eventData.course === "Btech" && (
              <select
                name="branch"
                value={eventData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                <option value="Btech">All</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>
            )}
          </>
        )}

        <select name="eventType" value={eventData.eventType} onChange={handleChange}>
          <option value="Technical">Technical</option>
          <option value="Non Technical">Non-Technical</option>
        </select>

        <select name="cost" value={eventData.cost} onChange={handleChange}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;