// src/pages/About.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1">
        Smart Waste Management is dedicated to providing efficient and sustainable waste management solutions.
      </Typography>
    </Box>
  );
};

export default About;
