// src/components/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import { TextField, Alert, CircularProgress } from '@mui/material';
import {
  Container,
  Heading,
  Button1,
  SignUpText,
  SignUpLink,
} from '../../styles/LoginStyles';
import CenteredLayout from '../Layout/CenteredLayout'; // Import the layout

const Login = () => {
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.token);
      // Navigation is handled in useEffect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user && auth.user.role) {
      const { role } = auth.user;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'user') {
        navigate('/user-dashboard');
      } else if (role === 'personnel') {
        navigate('/personnel-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [auth.user, navigate]);

  return (
    <CenteredLayout>
      <Container>
        <Heading>Login</Heading>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={onSubmit}>
          <TextField
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          <Button1 type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button1>
        </form>
        <SignUpText>
          Don't have an account? <SignUpLink to="/register">Sign Up</SignUpLink>
        </SignUpText>
      </Container>
    </CenteredLayout>
  );
};

export default Login;
