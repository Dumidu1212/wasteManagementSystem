// src/pages/RegisterPersonnel.jsx

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import adminService from '../services/adminService'; // Ensure correct import path

// Styled Container using MUI's styled API and theme
const Container = styled(Box)(({ theme }) => ({
  maxWidth: '500px',
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 1.5, // 12px if borderRadius is 8
  boxShadow: theme.shadows[5],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

const RegisterPersonnel = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Added confirmPassword field
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { name, email, password, confirmPassword } = formData;

  // Handler for input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setPasswordError('');

    // Frontend validation for password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await adminService.registerPersonnel({
        name,
        email,
        password,
      });
      setSuccessMsg('Personnel registered successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setErrorMsg(
        error.message ||
          'Failed to register personnel. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', // Ensure full viewport height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
        padding: 2,
      }}
    >
      <Container>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Register Waste Management Personnel
        </Typography>

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={name}
                onChange={onChange}
                variant="outlined"
                fullWidth
                required
                placeholder="Enter full name"
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                variant="outlined"
                fullWidth
                required
                placeholder="Enter email address"
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                variant="outlined"
                fullWidth
                required
                placeholder="Enter password"
                helperText="Minimum 6 characters"
              />
            </Grid>

            {/* Confirm Password Field */}
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={onChange}
                variant="outlined"
                fullWidth
                required
                placeholder="Re-enter password"
                error={Boolean(passwordError)}
                helperText={passwordError}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: 2, // 16px if default spacing is 8
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default RegisterPersonnel;
