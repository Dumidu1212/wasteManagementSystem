// src/components/Layout/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 250;
const collapsedDrawerWidth = 60;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Initialize open state based on screen size
  const [open, setOpen] = useState(!isMobile);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarOpen');
    if (savedState !== null) {
      setOpen(JSON.parse(savedState));
    }
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
    localStorage.setItem('adminSidebarOpen', JSON.stringify(!open));
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Sidebar */}
      <AdminSidebar open={open} handleDrawerToggle={handleDrawerToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: 'margin-left 0.3s',
          marginLeft: open ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
          [theme.breakpoints.down('md')]: {
            marginLeft: 0,
          },
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mb: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Content Outlet */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
