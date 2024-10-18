// src/components/Dashboard/PersonnelDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, CircularProgress, Button } from '@mui/material';
import api from '../../services/api';

const PersonnelDashboard = () => {
  const [wasteCollections, setWasteCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWasteCollections = async () => {
    try {
      const response = await api.get('/wastes');
      setWasteCollections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching waste collections:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/wastes/${id}`, { status });
      setWasteCollections(
        wasteCollections.map((waste) =>
          waste._id === id ? { ...waste, status } : waste
        )
      );
    } catch (error) {
      console.error('Error updating waste status:', error);
    }
  };

  useEffect(() => {
    fetchWasteCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Typography variant="h4" className="mb-4">
        Personnel Dashboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {wasteCollections.map((waste) => (
            <Grid item xs={12} sm={6} md={4} key={waste._id}>
              <Paper className="p-4">
                <Typography variant="h6">{waste.wasteType}</Typography>
                <Typography variant="body1">Quantity: {waste.quantity}</Typography>
                <Typography variant="body2">Location: {waste.location}</Typography>
                <Typography variant="body2">Status: {waste.status}</Typography>
                {waste.status === 'pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-2"
                    onClick={() => updateStatus(waste._id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default PersonnelDashboard;
