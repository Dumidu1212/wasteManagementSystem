// src/components/Layout/Navbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  MoreVert as MoreIcon,
  // Report as ReportIcon, // Added import
  // AssignmentInd as AssignmentIndIcon, // Added import
  Schedule as ScheduleIcon, // Added import
  Payment as PaymentIcon, // Added import
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  text-transform: none;
  &:hover {
    background-color: #1e770f; /* Primary Green on Hover */
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Handle mobile menu open
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle mobile menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define common menu items for all authenticated users
  const commonAuthMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    // { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  ];

  // Define additional menu items for admin users
  const adminMenuItems = [
    { text: 'Admin Dashboard', icon: <HomeIcon />, path: '/admin/dashboard' },
    // { text: 'Reports', icon: <ReportIcon />, path: '/admin/reports' },
    // { text: 'Waste Management Personnel Registration', icon: <AssignmentIndIcon />, path: '/admin/personnel' },
  ];

  // Define additional menu items for non-admin authenticated users
  const nonAdminMenuItems = [
    { text: 'About', icon: <HomeIcon />, path: '/about' },
    { text: 'Contact', icon: <HomeIcon />, path: '/contact' },
    { text: 'Schedule Collection', icon: <ScheduleIcon />, path: '/schedule-collection' },
    { text: 'Payment', icon: <PaymentIcon />, path: '/payment' },
  ];

  // Define dashboard links based on role
  const dashboardMenuItems = () => {
    if (auth.user.role === 'admin') {
      return adminMenuItems;
    } else if (auth.user.role === 'personnel') {
      return [{ text: 'Personnel Dashboard', icon: <AccountCircleIcon />, path: '/personnel-dashboard' }];
    } else if (auth.user.role === 'user') {
      return [{ text: 'User Dashboard', icon: <AccountCircleIcon />, path: '/user-dashboard' }];
    } else {
      return [];
    }
  };

  // Combine all menu items based on role
  const getMenuItems = () => {
    if (!auth.user) {
      // Unauthenticated Users
      return [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
      ];
    }

    // Authenticated Users
    let items = [...commonAuthMenuItems];

    // Append dashboard link based on role
    items = items.concat(dashboardMenuItems());

    // If not admin, include additional links
    if (auth.user.role !== 'admin') {
      items = items.concat(nonAdminMenuItems);
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2E7D32' }}>
      <Toolbar>
        {/* Website Logo or Icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>

        {/* Website Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Waste Management
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <StyledButton
              key={item.text}
              color="inherit"
              startIcon={item.icon || null}
              onClick={() => navigate(item.path)}
            >
              {item.text}
            </StyledButton>
          ))}
          {!auth.user ? (
            <>
              <StyledButton
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Login
              </StyledButton>
              <StyledButton
                color="inherit"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/register')}
              >
                Register
              </StyledButton>
            </>
          ) : (
            <StyledButton
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Logout
            </StyledButton>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMenu}>
            <MoreIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  handleClose();
                }}
              >
                {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                {item.text}
              </MenuItem>
            ))}
            {!auth.user ? (
              <>
                <MenuItem
                  onClick={() => {
                    navigate('/login');
                    handleClose();
                  }}
                >
                  <LoginIcon sx={{ marginRight: '8px' }} />
                  Login
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/register');
                    handleClose();
                  }}
                >
                  <PersonAddIcon sx={{ marginRight: '8px' }} />
                  Register
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                <LogoutIcon sx={{ marginRight: '8px' }} />
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
