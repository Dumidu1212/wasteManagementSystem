// Example structure of AuthContext
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.token) {
        try {
          const data = await getUserProfile();
          setAuth((prevAuth) => ({ ...prevAuth, user: data, loading: false }));
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setAuth({ user: null, token: null, loading: false });
          localStorage.removeItem('token');
        }
      } else {
        setAuth({ user: null, token: null, loading: false });
      }
    };

    fetchUser();
  }, [auth.token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuth((prevAuth) => ({ ...prevAuth, token }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ user: null, token: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
