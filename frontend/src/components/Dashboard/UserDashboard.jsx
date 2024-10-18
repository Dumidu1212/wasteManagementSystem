import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
} from '@mui/material';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const UserWasteCollectionDashboard = () => {
  const { auth } = useAuth(); // Get the authenticated user
  const [wasteCollections, setWasteCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch waste collections for the logged-in user
  const fetchUserWasteCollections = useCallback(async () => {
    try {
      const response = await api.get(`/wastes/user/${auth.user._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Pass token to ensure authentication
        },
      });
      setWasteCollections(response.data);
    } catch (error) {
      console.error('Error fetching user waste collections:', error);
    } finally {
      setLoading(false);
    }
  }, [auth.user._id, auth.token]); // Include auth.token as a dependency


  // Function to delete a waste collection
  const deleteWasteCollection = async (wasteId) => {
    try {
      await api.delete(`/wastes/${wasteId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Ensure token is passed
        },
      });
      // Remove the deleted item from the state
      setWasteCollections((prevCollections) =>
        prevCollections.filter((waste) => waste._id !== wasteId)
      );
    } catch (error) {
      console.error('Error deleting waste collection:', error);
    }
  };

  // Call fetchUserWasteCollections when the component mounts
  useEffect(() => {
    fetchUserWasteCollections();
  }, [fetchUserWasteCollections]); // Include fetchUserWasteCollections as a dependency

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Your Waste Collections
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Waste Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Collection Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Personnel</TableCell> {/* Display assigned personnel */}
              <TableCell>Actions</TableCell> {/* Actions like Delete */}
            </TableRow>
          </TableHead>
          <TableBody>
            {wasteCollections.map((waste) => (
              <TableRow key={waste._id}>
                <TableCell>{waste.location}</TableCell>
                <TableCell>{waste.wasteType}</TableCell>
                <TableCell>{waste.quantity}</TableCell>
                <TableCell>{new Date(waste.collectionDate).toLocaleDateString()}</TableCell>
                <TableCell>{waste.status}</TableCell>
                <TableCell>
                  {/* Ensure the assigned personnel is displayed, or show 'Not Assigned' */}
                  {waste.assignedPersonnel ? waste.assignedPersonnel.name : 'Not Assigned'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteWasteCollection(waste._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default UserWasteCollectionDashboard;
