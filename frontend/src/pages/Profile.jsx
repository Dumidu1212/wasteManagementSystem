// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const Profile = () => {
  const { auth, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setFormData({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
      });
    }
  }, [auth.user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await api.put('/users/profile', formData);
      login(response.data.token);
      setMessage('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {message && (
        <Typography variant="body1" color="primary" gutterBottom>
          {message}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={onSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={!editMode}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={!editMode}
        />
        {editMode && (
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
          />
        )}
        {editMode ? (
          <>
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
              Save Changes
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </form>
    </Box>
  );
};

export default Profile;
