// src/pages/Contact.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const Contact = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1">
        For inquiries, please email us at contact@smartwastemanagement.com or call us at (123) 456-7890.
      </Typography>
    </Box>
  );
};

export default Contact;
