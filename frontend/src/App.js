import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await axios.post(`${API_BASE_URL}/api/users`, formData);
      setSuccess('User added successfully!');
      setFormData({ name: '', mobile: '' });
      fetchUsers();
    } catch (err) {
      setError('Failed to add user. Please try again.');
      console.error('Error adding user:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await axios.delete(`${API_BASE_URL}/api/users/${id}`);
      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="container">
      <div className="header">
        <h1>User Management System</h1>
        <p>Manage your user list with ease</p>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="user-form">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter user name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              required
            />
          </div>
          <button type="submit" className="btn">
            Add User
          </button>
        </form>
      </div>

      <div className="user-list">
        <h2 style={{ padding: '1.5rem', margin: 0, borderBottom: '1px solid #e1e5e9' }}>
          User List ({users.length})
        </h2>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="loading">No users found. Add some users to get started!</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-mobile">{user.mobile}</div>
              </div>
              <div className="user-actions">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
