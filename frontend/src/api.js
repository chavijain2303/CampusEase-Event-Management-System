import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `Request failed (${response.status})`
    }));
    throw new Error(errorData.error || errorData.message || 'Request failed');
  }
  return response.json();
};

// ====================== EVENT API ======================
export const getEvents = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/events?${query}`, {
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

export const getEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch event: ${error.message}`);
  }
};

export const createEvent = async (eventData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const decoded = jwtDecode(token);
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...eventData,
        organizer: decoded.id
      })
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Event creation failed: ${error.message}`);
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/delete/${eventId}`, {  // Updated endpoint
      method: 'DELETE',
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

// ====================== AUTH API ======================
export const adminLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // No auth header needed for login
      body: JSON.stringify(credentials)
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Admin login failed: ${error.message}`);
  }
};

export const studentLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // No auth header needed for login
      body: JSON.stringify(credentials)
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Student login failed: ${error.message}`);
  }
};

// ====================== REGISTRATION API ======================
export const registerForEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

// ====================== ATTENDANCE API ======================
export const markAttendance = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/attend`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Attendance marking failed: ${error.message}`);
  }
};

// ====================== EVENT RESULTS API ======================
export const postEventResults = async (eventId, results) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/results`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(results)
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to post results: ${error.message}`);
  }
};

export const getEventResults = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/results`, {
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch results: ${error.message}`);
  }
};