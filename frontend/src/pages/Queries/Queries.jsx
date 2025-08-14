import React, { useState, useEffect } from 'react';
import './Queries.css';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:5000/api/admin/queries', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch queries');
        }

        const data = await response.json();
        setQueries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const updateQueryStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/queries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setQueries(queries.map(query => 
        query.id === id ? { ...query, status: newStatus } : query
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    const matchesSearch = query.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         query.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.concern.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="loading">Loading queries...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="queries-container">
      <h2>Student Queries</h2>
      
      <div className="queries-controls">
        {/* <div className="search-box">
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="search-icon">🔍</i>
        </div> */}
        
        <div className="filter-controls">
          <label>
            Filter by Status:
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>
      </div>

      {filteredQueries.length === 0 ? (
        <div className="no-queries">No queries found matching your criteria</div>
      ) : (
        <div className="queries-list">
          {filteredQueries.map(query => (
            <div key={query.id} className={`query-card ${query.status.toLowerCase().replace(' ', '-')}`}>
              <div className="query-header">
                <h3>{query.student_name} ({query.enrollment_number})</h3>
                <span className={`status-badge ${query.status.toLowerCase().replace(' ', '-')}`}>
                  {query.status}
                </span>
              </div>
              
              <div className="query-details">
                <p><strong>Admin:</strong> {query.admin_name}</p>
                <p><strong>Submitted:</strong> {new Date(query.submitted_at).toLocaleString()}</p>
              </div>
              
              <div className="query-concern">
                <p><strong>Concern:</strong></p>
                <p>{query.concern}</p>
              </div>
              
              <div className="query-actions">
                <select
                  value={query.status}
                  onChange={(e) => updateQueryStatus(query.id, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                
                <button 
                  className="reply-btn"
                  onClick={() => {/* Implement reply functionality */}}
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queries;