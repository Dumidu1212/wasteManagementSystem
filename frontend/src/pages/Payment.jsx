// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import api from '../services/api';
import { Link } from 'react-router-dom';
import paymentImage from '../assets/images/payment.png';

const Payment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hoverPay, setHoverPay] = useState(false);
  const [hoverLoyalty, setHoverLoyalty] = useState(false);
  const { amount, paymentMethod } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/payments', formData);
      setMessage('Payment processed successfully');
      setFormData({ amount: '', paymentMethod: '' });
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <Box>
      <Box className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mb-6">
        {message && (
          <Typography variant="body1" color="primary" className="mb-4">
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="body1" color="error" className="mb-4">
            {error}
          </Typography>
        )}

        <div
          style={{
            display: 'flex',
            height: '100vh',
            background: 'radial-gradient(circle, #F2F3F4, #E3ECE6, #D5E5D9)',
            padding: '20px',
            fontFamily: 'Poppins, sans-serif',
            alignItems: 'center',
          }}
        >
          {/* Title at the top-left corner */}
          <h2
            style={{
              marginBottom: '550px',
              marginLeft: '50px',
              color: '#1E770F',
              fontWeight: 'bold',
            }}
          >
            Payments
          </h2>

          {/* Image Container */}
          <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
            <img
              src={paymentImage}
              alt="Eco Track"
              style={{
                maxWidth: '100%',
                marginLeft: '-220px',
              }}
            />
          </div>

          {/* Content Container */}
          <div style={{ flex: 1, textAlign: 'left', padding: '20px' }}>
            <p
              style={{
                marginBottom: '100px',
                fontSize: '16px',
                lineHeight: '1.5',
                textAlign: 'center',
                color: 'black',
              }}
            >
              With Eco-Track, managing your waste payments has never been easier or more rewarding!
              Pay your garbage bill with just a few clicks and enjoy exclusive discounts by redeeming your earned loyalty points.
              Our seamless payment system not only helps you stay on top of your waste management responsibilities,
              but also rewards you for your eco-friendly efforts. Track your waste collection, calculate savings,
              and generate payment bills - all in one place with Eco-Track. Join the movement towards a cleaner, greener future,
              and make every payment count!
            </p>

            {/* Buttons Container */}
            <div>
              <Link
                to="/pay"
                style={{
                  backgroundColor: hoverPay ? '#145a08' : '#1E770F',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '10px',
                  width: '250px',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={() => setHoverPay(true)}
                onMouseLeave={() => setHoverPay(false)}
              >
                Pay Now
              </Link>

              <Link
                to="/loyalty"
                style={{
                  backgroundColor: hoverLoyalty ? '#145a08' : '#1E770F',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  display: 'block',
                  width: '250px',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={() => setHoverLoyalty(true)}
                onMouseLeave={() => setHoverLoyalty(false)}
              >
                Check Loyalty Points
              </Link>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Payment;
