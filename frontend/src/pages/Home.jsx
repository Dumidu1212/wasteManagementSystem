// src/pages/Home.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box p={2}>
      <Typography variant="h3" gutterBottom>
        Welcome to Smart Waste Management
      </Typography>
      <Typography variant="body1">
        Efficient and sustainable waste management solutions for a cleaner environment.
      </Typography>
    </Box>
  );
};

export default Home;
