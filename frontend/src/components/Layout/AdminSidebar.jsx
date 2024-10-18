// src/components/Sidebar/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Recycling as RecyclingIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Report as ReportIcon,
  AssignmentInd as AssignmentIndIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useAuth from '../../hooks/useAuth';

const drawerWidth = 250;
const collapsedDrawerWidth = 70; // Slightly increased for better icon spacing

const AdminSidebar = ({ open, handleDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const { auth } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/admin/payments' },
    { text: 'Recycling Credits', icon: <RecyclingIcon />, path: '/admin/recycling-credits' },
    { text: 'Collection Schedules', icon: <ScheduleIcon />, path: '/admin/schedules' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Registration', icon: <AssignmentIndIcon />, path: '/admin/personnel' },
    // { text: 'Reports', icon: <ReportIcon />, path: '/admin/reports' },
  ];

  return (
    <Box
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: theme.palette.background.paper,
        height: '100vh',
        boxShadow: theme.shadows[4],
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Toggle Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: '0 8px',
          height: '64px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {open && (
          <Typography variant="h6" noWrap component="div" sx={{ color: theme.palette.text.primary }}>
            Admin Panel
          </Typography>
        )}
        <IconButton
          onClick={handleDrawerToggle}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              paddingY: open ? 1.5 : 1,
              paddingX: open ? 2 : 'auto',
              backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                marginRight: open ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.primary.main,
                fontSize: '1.2rem',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  noWrap: true,
                  variant: 'body1',
                  sx: { fontWeight: location.pathname === item.path ? 'bold' : 'normal' },
                }}
              />
            )}
          </ListItem>
        ))}
      </List>

      {/* Spacer to push the profile section to the bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Profile Section */}
      {auth.user && (
        <>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: open ? '16px' : '16px 8px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            component={Link}
            to="/admin/profile" // Admin Profile Route
          >
            <Tooltip title={open ? `${auth.user.name}'s Profile` : 'Profile'} placement="right">
              <Avatar
                src={auth.user.avatar || ''}
                alt={auth.user.name}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                {!auth.user.avatar && <AccountCircleIcon />}
              </Avatar>
            </Tooltip>
            {open && (
              <Box sx={{ marginLeft: 2, overflow: 'hidden' }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: '500',
                  }}
                >
                  {auth.user.name}
                </Typography>
              </Box>
            )}
          </Box>
        
        </>
      )}
    </Box>
  );
};

export default AdminSidebar;
