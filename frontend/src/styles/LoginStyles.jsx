// src/styles/LoginStyles.jsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Container
export const Container = styled.div`
  width: 90%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

// Styled Heading
export const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #1e770f;
`;

// Styled Button
export const Button1 = styled.button`
  background-color: #1e770f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 50px;
  width: 150px;
  text-align: center;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #155b0b;
  }

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

// Styled Sign-Up Text
export const SignUpText = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #333;
`;

// Styled Sign-Up Link
export const SignUpLink = styled(Link)`
  color: #1e770f;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
