// src/components/Auth/PersonnelForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Alert, Typography } from '@mui/material';
import { registerPersonnel } from '../../services/adminService';
import CenteredLayout from '../Layout/CenteredLayout'; // Import the layout

const PersonnelForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await registerPersonnel(formData);
      setSuccessMsg('Personnel registered successfully!');
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      setErrorMsg(error.message || 'Failed to register personnel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredLayout>
      <Box
        maxWidth="500px"
        p={4}
        bgcolor="#f5f5f5"
        borderRadius={8}
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      >
        <Typography variant="h5" gutterBottom>
          Register Waste Management Personnel
        </Typography>
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <form onSubmit={onSubmit}>
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            helperText="Minimum 6 characters"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Personnel'}
          </Button>
        </form>
      </Box>
    </CenteredLayout>
  );
};

export default PersonnelForm;
