// src/pages/Terms.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const Terms = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body1">
        By using our services, you agree to abide by our terms and conditions.
      </Typography>
    </Box>
  );
};

export default Terms;
