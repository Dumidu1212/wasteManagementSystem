import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import api from '../../services/api';

// Styled components for enhanced look with visible borders
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '1px solid #ccc', // Visible borders
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  borderBottom: '2px solid #e0e0e0', // Visible table borders
  color: '#555', // Subtle text color for better contrast
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f5f5f5', // Zebra stripe effect for better readability
  },
  '&:hover': {
    backgroundColor: '#fafafa', // Highlight row on hover
  },
}));

const AdminDashboard = () => {
  const [wastes, setWastes] = useState([]); // Fetch waste collection data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('day'); // Default view is now "Day"

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wastesRes, usersRes] = await Promise.all([
          api.get('/wastes'), // Fetch waste collection data from the /wastes route
          api.get('/users'),
        ]);

        // Sort the waste collections by date, newest first
        const sortedWastes = wastesRes.data.sort(
          (a, b) => new Date(b.collectionDate || b.scheduledDate) - new Date(a.collectionDate || a.scheduledDate)
        );

        // Sort the users by their creation date and limit to 10 latest users
        const sortedUsers = usersRes.data
          .filter((user) => user.role === 'user')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
          .slice(0, 10); // Show only 10 users

        setWastes(sortedWastes); // Set waste collection data with sorted order
        setUsers(sortedUsers); // Set sorted users
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch waste collection data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!wastes || !users) {
    return (
      <Box p={4}>
        <Alert severity="warning">No data available.</Alert>
      </Box>
    );
  }

  // Filter waste collection data based on the current view
  const filterWastesByView = () => {
    const today = new Date();
    if (view === 'day') {
      return wastes.filter(waste => {
        const collectionDate = new Date(waste.collectionDate || waste.scheduledDate);
        return (
          collectionDate.getDate() === today.getDate() &&
          collectionDate.getMonth() === today.getMonth() &&
          collectionDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (view === 'week') {
      return wastes.slice(0, Math.min(wastes.length, 7)); // Limit to 7 for weekly view
    } else if (view === 'month') {
      return wastes.slice(0, Math.min(wastes.length, 30)); // Limit to 30 for monthly view
    }
  };

  // Get the status and format the waste collection date
  const formatStatus = (status) => (status === 'pending' ? 'Pending' : 'Completed');
  const formatDate = (date) => new Date(date).toLocaleDateString();

  // Get day of the week from the scheduled date
  const formatDay = (date) => {
    const options = { weekday: 'long' };
    return new Date(date).toLocaleDateString(undefined, options); // Example: "Monday"
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Admin Dashboard
      </Typography>

      {/* Analytics Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StyledPaper>
            <Typography variant="h6" color="primary">Total Users</Typography>
            <Typography variant="h4" fontWeight={700}>{users.length}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledPaper>
            <Typography variant="h6" color="primary">Total Waste Collection Records</Typography>
            <Typography variant="h4" fontWeight={700}>{wastes.length}</Typography>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Toggle Buttons for Day, Week, and Month views */}
      <ButtonGroup sx={{ mt: 4 }} color="primary">
        <Button onClick={() => setView('day')} variant={view === 'day' ? 'contained' : 'outlined'}>
          Day
        </Button>
        <Button onClick={() => setView('week')} variant={view === 'week' ? 'contained' : 'outlined'}>
          Week
        </Button>
        <Button onClick={() => setView('month')} variant={view === 'month' ? 'contained' : 'outlined'}>
          Month
        </Button>
      </ButtonGroup>

      {/* Tables for Waste Collections and Users in the same row */}
      <Grid container spacing={3} mt={4}>
        {/* Waste Collection Table */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom color="primary">
              Waste Collections - {view.charAt(0).toUpperCase() + view.slice(1)}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Day</StyledTableCell>
                    <StyledTableCell>User Name</StyledTableCell>
                    <StyledTableCell>Area</StyledTableCell>
                    <StyledTableCell>Assigned Person</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterWastesByView().map((waste, index) => (
                    <StyledTableRow key={index}>
                      <TableCell>{formatDate(waste.collectionDate || waste.scheduledDate)}</TableCell> {/* Ensure date is correct */}
                      <TableCell>{formatDay(waste.collectionDate || waste.scheduledDate)}</TableCell> {/* Ensure day is correct */}
                      <TableCell>{waste.collectedBy?.name || 'Unknown'}</TableCell> {/* Ensure user name */}
                      <TableCell>{waste.location || 'N/A'}</TableCell> {/* Ensure area is displayed */}
                      <TableCell>{waste.assignedPersonnel?.name || 'Not Assigned'}</TableCell> {/* Display assigned personnel */}
                      <TableCell>{formatStatus(waste.status)}</TableCell> {/* Display status */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Users Table */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom color="primary">
              Latest Users
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <StyledTableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
