import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Profile', path: '/profile', icon: <AccountCircleIcon /> },
    { text: 'Schedule Collection', path: '/schedule-collection', icon: <ScheduleIcon /> },
    { text: 'Payment', path: '/payment', icon: <PaymentIcon /> },
    { text: 'Reports', path: '/reports', icon: <ReportIcon /> },
  ];

  // Add role-based menu items
  if (auth.user && auth.user.role === 'admin') {
    menuItems.push({ text: 'Admin Dashboard', path: '/admin-dashboard', icon: <DashboardIcon /> });
  }

  if (auth.user && auth.user.role === 'personnel') {
    menuItems.push({ text: 'Personnel Dashboard', path: '/personnel-dashboard', icon: <DashboardIcon /> });
  }

  if (auth.user && auth.user.role === 'user') {
    menuItems.push({ text: 'User Dashboard', path: '/user-dashboard', icon: <DashboardIcon /> });
  }

  if (!auth.user) {
    return null; // Do not render the sidebar if the user is not logged in
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 280,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 280, boxSizing: 'border-box', backgroundColor: '#2E7D32', color: '#fff' },
      }}
    >
      {/* Branding */}
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#fff' }}>
          Smart Waste Management
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List>
        {menuItems.map((item, index) => (
          <ListItem 
            button 
            key={index} 
            onClick={() => navigate(item.path)} 
            sx={{
              '&:hover': {
                backgroundColor: '#1B5E20',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ padding: '10px', textAlign: 'center', marginTop: 'auto' }}>
        <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
          © 2024 Smart Waste Management
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
