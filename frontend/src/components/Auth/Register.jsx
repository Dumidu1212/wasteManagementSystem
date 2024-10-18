// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import { TextField, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CenteredLayout from '../Layout/CenteredLayout'; // Import the layout

// Styled components
const Container = styled.div`
  width: 90%;
  max-width: 400px;
  padding: 30px;
  background-color: #e8f5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #1e770f;
`;

const StyledButton = styled.button`
  background-color: #1e770f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: #155b0b;
  }

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

const SignInText = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #333;
`;

const SignInLink = styled(Link)`
  color: #1e770f;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(formData);
      login(data.token);

      // Redirect based on user role (assuming role is returned in response)
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'personnel') {
        navigate('/personnel-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      // Display detailed error message if available
      const errorMessage =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? err.response.data.errors.map((error) => error.msg).join(', ')
          : 'Registration failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredLayout>
      <Container>
        <Heading>Sign Up</Heading>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
            autoFocus
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
          <StyledButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </StyledButton>
        </form>
        <SignInText>
          Already have an account? <SignInLink to="/login">Sign In</SignInLink>
        </SignInText>
      </Container>
    </CenteredLayout>
  );
};

export default Register;
