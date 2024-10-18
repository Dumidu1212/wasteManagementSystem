// src/pages/QRCodeScanner.jsx

import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { styled } from '@mui/system';

const ScannerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(5),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
}));

const QRCodeScanner = () => {
  const [scanData, setScanData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = (data) => {
    if (data) {
      setScanData(data.text);
      // Handle the scanned data as needed
      console.log('Scanned QR Code Data:', data.text);
    }
  };

  const handleError = (err) => {
    console.error('Error accessing camera:', err);
    setErrorMsg('Unable to access camera. Please check permissions.');
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <ScannerContainer>
      <Typography variant="h5" gutterBottom>
        QR Code Scanner
      </Typography>
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
      <Box>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={previewStyle}
        />
      </Box>
      {scanData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Scanned Data:</Typography>
          <Typography variant="body1">{scanData}</Typography>
        </Box>
      )}
    </ScannerContainer>
  );
};

export default QRCodeScanner;
