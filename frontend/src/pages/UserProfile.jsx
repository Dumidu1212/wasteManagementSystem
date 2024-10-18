// src/pages/UserProfile.jsx
import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const UserProfile = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!auth.user) {
    return null; // Or a loading spinner
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 4,
        backgroundColor: '#ffffff',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={auth.user.avatar || ''}
          alt={auth.user.name}
          sx={{ width: 80, height: 80, mr: 3 }}
        >
          {!auth.user.avatar && <AccountCircleIcon sx={{ width: 80, height: 80 }} />}
        </Avatar>
        <Typography variant="h5">{auth.user.name}</Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        <strong>Email:</strong> {auth.user.email}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Role:</strong> {auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)}
      </Typography>
      {/* Add more profile details as needed */}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ mt: 3 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default UserProfile;
