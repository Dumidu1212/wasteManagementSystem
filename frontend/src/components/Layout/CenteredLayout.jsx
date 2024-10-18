// src/components/Layout/CenteredLayout.jsx
import React from 'react';
import { Box } from '@mui/material';

const CenteredLayout = ({ children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh" // Full viewport height for vertical centering
    width="100%"    // Full width for horizontal centering
    bgcolor="#f0fff4" // Optional: Light background color
  >
    {children}
  </Box>
);

export default CenteredLayout;
