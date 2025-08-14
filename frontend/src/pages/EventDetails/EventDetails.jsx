import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdCalendarMonth } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import "./EventDetails.css";
import BG from "../../Assets/BG.png";
import { getEvent } from "../../api"; // Add this import

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        setError(err.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div
      className="details"
      style={{ backgroundImage: `url(${BG})` }}
    >
    <div className="event-details-container">
      <div className="event-details-wrapper">
        {/* Add image handling if available in your API response */}
        <div className="event-details-content">
          <h3>Event Name: {event.title}</h3>
          <div className="small-details">
            <p className="date">
              <MdCalendarMonth className="icon" />
              <span className="font-weight-med">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </p>
            <p className="location font-weight-med">
              <IoLocationSharp className="icon" />
              {event.location}
            </p>
          </div>
          <p className="description">
            <span className="description-heading">Event Description:</span>
            <span className="description-heading-para">
              {event.description}
            </span>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EventDetails;