import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./TotStu.css";
import BG from "../../Assets/BG.png";
import axios from "axios";

const TotStu = () => {
  const { eventId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(
          `http://localhost:5000/api/events/${eventId}/registrations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.status === 200) {
          setStudents(response.data);
          setError("");
        }
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div
      className="student-register"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="tot-stu-container">
        <h2>REGISTERED STUDENTS</h2>
        {loading && <p className="loading">Loading registrations...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        
        {students.length > 0 ? (
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Enrollment No.</th>
                <th>Email</th>
                <th>Event Name</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.enrollment}</td>
                  <td>{student.email}</td>
                  <td>{student.event}</td>
                  <td>{formatDate(student.registration_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p className="no-students">No students have registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default TotStu;