import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BG from "../../Assets/BG.png";
import "./AttendedStu.css";

const AttendedStu = () => {
  const { eventId } = useParams();
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/events/${eventId}/attendance`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setAttendedStudents(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [eventId]);

  if (loading) return <div className="attended-stu-container">Loading...</div>;
  if (error) return <div className="attended-stu-container">{error}</div>;

  return (
    <div
      className="student-attend"
      style={{ backgroundImage: `url(${BG})` }}
    >
    <div className="attended-stu-container">
      <h2>STUDENTS WHO ATTENDED EVENTS</h2>
      {attendedStudents.length > 0 ? (
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Enrollment No.</th>
              <th>Email</th>
              <th>Course</th>
              <th>Section</th>
              <th>Contact</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {attendedStudents.map((student) => (
              <tr key={student.enrollment}>
                <td>{student.name}</td>
                <td>{student.enrollment}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.section}</td>
                <td>{student.contact}</td>
                <td>{student.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-students">No attendance records found for this event</p>
      )}
    </div>
    </div>
  );
};

export default AttendedStu;