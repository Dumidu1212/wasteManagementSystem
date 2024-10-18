// src/components/Layout/Footer.jsx
import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#001F1F',
        color: '#ffffff',
        py: 2,
        px: 1,
        mt: 'auto',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Company
          </Typography>
          <Link
            component="button"
            color="inherit"
            onClick={() => handleNavigate('/')}
            sx={{ display: 'block', mb: 0.3 }}
          >
            Home
          </Link>
          <Link
            component="button"
            color="inherit"
            onClick={() => handleNavigate('/about')}
            sx={{ display: 'block', mb: 0.3 }}
          >
            About Us
          </Link>
          <Link
            component="button"
            color="inherit"
            onClick={() => handleNavigate('/contact')}
            sx={{ display: 'block', mb: 0.3 }}
          >
            Contact
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Legal
          </Typography>
          <Link
            component="button"
            color="inherit"
            onClick={() => handleNavigate('/privacy')}
            sx={{ display: 'block', mb: 0.3 }}
          >
            Privacy Policy
          </Link>
          <Link
            component="button"
            color="inherit"
            onClick={() => handleNavigate('/terms')}
            sx={{ display: 'block', mb: 0.3 }}
          >
            Terms of Service
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Connect Us
          </Typography>
          {/* Social media icons can be added here */}
          <Typography variant="body2">Email: contact@smartwaste.com</Typography>
          <Typography variant="body2">Phone: (123) 456-7890</Typography>
        </Grid>
      </Grid>

      <Box mt={2} textAlign="center">
        <Typography variant="caption">
          © {new Date().getFullYear()} Smart Waste Management. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
