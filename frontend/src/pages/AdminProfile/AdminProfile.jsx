import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTie, FaBuilding } from "react-icons/fa";
import axios from "axios";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/profile', {
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        setAdmin(response.data);
        setFormData(response.data);
        setPreviewImage(response.data.profileImage || "/default-admin.png");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'profileImage') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await axios.put('/api/admin/profile', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAdmin(response.data.admin);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!admin) return <div>Error loading profile</div>;

  return (
    <div className="admin-profile-container">
      <h2>Admin Profile</h2>
      
      <div className="profile-content">
        <div className="profile-image-section">
          <img src={previewImage} alt="Admin Profile" />
          {editMode && (
            <input 
              type="file" 
              onChange={(e) => {
                const file = e.target.files[0];
                setProfileImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }}
            />
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                name="name" 
                value={formData.name || ''} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Contact</label>
              <input 
                name="contact" 
                value={formData.contact || ''}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Position</label>
              <input 
                name="position" 
                value={formData.position || ''}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Department</label>
              <input 
                name="department" 
                value={formData.department || ''}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
            
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-item">
              <FaUser />
              <span>Name: {admin.name}</span>
            </div>
            <div className="detail-item">
              <FaEnvelope />
              <span>Email: {admin.email}</span>
            </div>
            <div className="detail-item">
              <FaPhone />
              <span>Contact: {admin.contact}</span>
            </div>
            <div className="detail-item">
              <FaUserTie />
              <span>Position: {admin.position}</span>
            </div>
            <div className="detail-item">
              <FaBuilding />
              <span>Department: {admin.department}</span>
            </div>
            
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;