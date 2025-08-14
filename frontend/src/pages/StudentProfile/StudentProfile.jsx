import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUniversity, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import "./StudentProfile.css";

const StudentProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put('/api/student/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update both user and formData states with the response
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setFormData(updatedUser);
      
      setEditMode(false);
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
      
      // Update local storage if name changed
      if (updatedUser.name) {
        const userData = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...userData, name: updatedUser.name }));
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setSuccessMessage("");
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-error">{errorMessage || "Error loading profile data"}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button 
          className={`edit-profile-btn ${editMode ? 'cancel-btn' : ''}`}
          onClick={() => {
            setEditMode(!editMode);
            setSuccessMessage("");
            setErrorMessage("");
          }}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
      
      <div className="profile-content">
        {editMode ? (
          <form className="profile-details" onSubmit={handleSubmit}>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div>
                  <span className="detail-label">Name:</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <span className="detail-label">Email:</span>
                  <input
                    type="email"
                    value={formData.email || ''}
                    className="edit-input"
                    disabled
                  />
                </div>
              </div>
              <div className="detail-item">
                <FaPhone className="detail-icon" />
                <div>
                  <span className="detail-label">Phone:</span>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Academic Information</h3>
              <div className="detail-item">
                <FaUniversity className="detail-icon" />
                <div>
                  <span className="detail-label">Student ID:</span>
                  <input
                    type="text"
                    value={formData.enrollment || ''}
                    className="edit-input"
                    disabled
                  />
                </div>
              </div>
              <div className="detail-item">
                <FaGraduationCap className="detail-icon" />
                <div>
                  <span className="detail-label">Department:</span>
                  <input
                    type="text"
                    value={formData.course || ''}
                    className="edit-input"
                    disabled
                  />
                </div>
              </div>
              <div className="detail-item">
                <FaGraduationCap className="detail-icon" />
                <div>
                  <span className="detail-label">Section:</span>
                  <input
                    type="text"
                    name="section"
                    value={formData.section || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" className="save-profile-btn">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div>
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{user.name}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaPhone className="detail-icon" />
                <div>
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{user.contact}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Academic Information</h3>
              <div className="detail-item">
                <FaUniversity className="detail-icon" />
                <div>
                  <span className="detail-label">Student ID:</span>
                  <span className="detail-value">{user.enrollment}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaGraduationCap className="detail-icon" />
                <div>
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{user.course}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaGraduationCap className="detail-icon" />
                <div>
                  <span className="detail-label">Section:</span>
                  <span className="detail-value">{user.section}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <span className="detail-label">Passing Year:</span>
                  <span className="detail-value">{user.passing_year}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;