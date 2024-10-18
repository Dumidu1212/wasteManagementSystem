// src/components/UI/Button.jsx
import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ variant = 'contained', color = 'primary', onClick, children, ...props }) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      onClick={onClick}
      {...props}
      className="rounded-md"
    >
      {children}
    </MuiButton>
  );
};

export default Button;
