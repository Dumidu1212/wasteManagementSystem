// src/pages/Loyalty.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import api from '../services/api';

const Loyalty = () => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const response = await api.get('/recycling/credits');
        setLoyaltyPoints(response.data.recyclingCredits);
      } catch (error) {
        console.error('Error fetching loyalty points:', error);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Loyalty Points
      </Typography>
      {loyaltyPoints !== null ? (
        <Typography variant="h5">
          You have {loyaltyPoints} loyalty points.
        </Typography>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default Loyalty;
