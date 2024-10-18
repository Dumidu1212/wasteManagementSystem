// src/components/Layout/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static" className="bg-primary">
      <Toolbar>
        <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Waste Management
        </Typography>
        {auth.user ? (
          <>
            <Button color="inherit" onClick={() => handleNavigate('/profile')}>
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => handleNavigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => handleNavigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
