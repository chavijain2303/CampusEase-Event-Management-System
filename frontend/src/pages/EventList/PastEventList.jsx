import React from "react";
import "./PastEventList.css";

const pastEvents = [
  {
    id: 1,
    name: "Hackathon 2024",
    date: "January 20, 2024",
    time: "9:00 AM - 9:00 PM",
    location: "Computer Lab",
    description: "A 12-hour coding challenge where students developed innovative tech solutions.",
  },
  {
    id: 2,
    name: "Science Exhibition",
    date: "February 10, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Physics Department",
    description: "A showcase of scientific experiments and projects by students.",
  },
  {
    id: 3,
    name: "Music Fest",
    date: "March 5, 2024",
    time: "6:00 PM - 11:00 PM",
    location: "Open Ground",
    description: "A night of soulful music performances by talented students and bands.",
  },
];

const PastEventList = () => {
  return (
    <div className="past-events-container">
      <h2 id="Header">PAST EVENTS</h2>
      <div className="events-list">
        {pastEvents.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p className="event-description">{event.description}</p>
            <div className="event-buttons">
              <button className="details-btn">Event Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastEventList;
