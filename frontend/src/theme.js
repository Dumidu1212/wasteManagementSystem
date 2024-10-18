// src/theme.js
import { createTheme } from '@mui/material/styles';

// Define custom colors
const primaryGreen = '#10B981'; // Primary Green
const secondaryGreen = '#34D399'; // Secondary Green
const darkGreen = '#064E3B'; // Darker Green for Footer
const lightBackground = '#F0FFF4'; // Light Background
const darkText = '#064E3B'; // Dark Text (Adjusted for better contrast)
const lightText = '#ffffff'; // Light Text

const theme = createTheme({
  palette: {
    primary: {
      main: primaryGreen,
      light: '#6EE7B7',
      dark: '#047857',
      contrastText: lightText, // Use light text on primary buttons
    },
    secondary: {
      main: secondaryGreen,
      light: '#A7F3D0',
      dark: '#065F46',
      contrastText: lightText, // Use light text on secondary buttons
    },
    background: {
      default: lightBackground, // Light background
      paper: '#ffffff', // Paper components have white background
      dark: darkGreen, // Dark background for footer or app bar
    },
    text: {
      primary: darkText, // Use dark text by default
      secondary: '#555555', // A lighter dark text for secondary text
    },
    // Optional: Define additional colors if needed
    success: {
      main: '#16A34A',
      contrastText: lightText,
    },
    warning: {
      main: '#F59E0B',
      contrastText: darkText,
    },
    error: {
      main: '#DC2626',
      contrastText: lightText,
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: darkText, // Ensure headers use dark text
    },
    h2: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: darkText,
    },
    h3: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      color: darkText,
    },
    h4: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.5,
      color: darkText,
    },
    h5: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      color: darkText,
    },
    h6: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.7,
      color: darkText,
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: darkText, // Ensure body text uses dark text
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: darkText,
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation
      fontWeight: 600,
    },
    // Add more typography settings as needed
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          boxShadow: 'none', // Remove default shadow
          backgroundColor: darkGreen, // Use dark green for AppBar
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: primaryGreen,
          color: lightText,
          '&:hover': {
            backgroundColor: '#059669', // Darker shade on hover
          },
        },
        containedSecondary: {
          backgroundColor: secondaryGreen,
          color: lightText,
          '&:hover': {
            backgroundColor: '#059669', // Darker shade on hover
          },
        },
      },
    },
    // Remove global MuiTypography color override
    // You can specify colors for specific components instead
    MuiTypography: {
      styleOverrides: {
        // If you need to override specific variants, do it here
      },
    },
    // Add more component overrides as needed
  },
  // Optional: Add responsive font sizes
  // responsiveFontSizes: true,
});

export default theme;
