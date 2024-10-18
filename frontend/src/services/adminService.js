// src/services/adminService.js

import api from './api'; // Ensure this path is correct

// Register new waste management personnel
export const registerPersonnel = async (personnelData) => {
  try {
    const response = await api.post('/admin/personnel', personnelData); // Corrected endpoint
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error registering personnel');
  }
};

// Fetch all waste management personnel
export const getPersonnelList = async () => {
  try {
    const response = await api.get('/admin/users'); // Ensure this matches your server route
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching personnel list');
  }
};

// Update personnel details
export const updatePersonnel = async (personnelId, updatedData) => {
  try {
    const response = await api.put(`/admin/users/${personnelId}`, updatedData); // Ensure this matches your server route
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating personnel');
  }
};

// Delete personnel
export const deletePersonnel = async (personnelId) => {
  try {
    const response = await api.delete(`/admin/users/${personnelId}`); // Ensure this matches your server route
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting personnel');
  }
};

// Grouping all functions into AdminService object
const AdminService = {
  registerPersonnel,
  getPersonnelList,
  updatePersonnel,
  deletePersonnel,
  // Add more admin-related service functions here if needed
};

export default AdminService;
