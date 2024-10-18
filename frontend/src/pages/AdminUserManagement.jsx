import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table formatting in PDF

const SmallFormControl = styled(FormControl)(({ theme }) => ({
  width: '120px',  // Make sure it's defined
  marginRight: theme.spacing(1),
}));


// Styled components for a professional look
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  border: '1px solid #d1d9e6',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  borderBottom: '2px solid #e0e0e0',
  color: '#333',
  padding: theme.spacing(1),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9fafb',
  },
  '&:hover': {
    backgroundColor: '#f0f4f8',
    transition: 'background-color 0.3s ease',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& input': {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 2,
  },
  '& fieldset': {
    borderColor: '#d1d9e6',
    borderRadius: theme.shape.borderRadius * 2,
  },
  '&:hover fieldset': {
    borderColor: '#667eea',
  },
  '& .MuiInputBase-root': {
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    transition: '0.3s',
  },
  '&:focus-within .MuiInputBase-root': {
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)',
  },
}));

const RoleSelector = styled(FormControl)(({ theme }) => ({
  width: '100%',
  '& .MuiSelect-select': {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 2,
  },
  '& fieldset': {
    borderColor: '#d1d9e6',
    borderRadius: theme.shape.borderRadius * 2,
  },
  '&:hover fieldset': {
    borderColor: '#667eea',
  },
  '& .MuiInputBase-root': {
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    transition: '0.3s',
  },
  '&:focus-within .MuiInputBase-root': {
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.spacing(1),
}));

const AdminUserManagement = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (auth.user && auth.user.role === 'admin') {
      fetchUsers();
    }
  }, [auth.user]);

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterUsers(query, selectedRole);
  };

  // Handle role selection
  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    filterUsers(searchQuery, role);
  };

  // Filter users based on search query and selected role
  const filterUsers = (query, role) => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );

    if (role !== 'all') {
      filtered = filtered.filter((user) => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  // Generate PDF for all users or filtered by role
  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text('User Management Report', 105, 20, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 105, 30, null, null, 'center');

    const tableColumn = ['Name', 'Email', 'Role'];
    const tableRows = [];

    filteredUsers.forEach((user) => {
      const userData = [user.name, user.email, user.role];
      tableRows.push(userData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save('user_management_report.pdf');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        User Management
      </Typography>

      {/* Flex container for search bar and PDF button */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} md={6}>
          {/* Search bar */}
          <SearchField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Name, Email, or Role"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#667eea' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Button to generate PDF */}
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          <ActionButton variant="contained" color="primary" onClick={generatePDF}>
            Generate PDF Report
          </ActionButton>
        </Grid>
      </Grid>

      {/* Role filter */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <RoleSelector variant="outlined" fullWidth>
            <Select value={selectedRole} onChange={handleRoleFilter}>
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="personnel">Personnel</MenuItem>
            </Select>
          </RoleSelector>
        </Grid>
      </Grid>

      <StyledPaper>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell align="center">Update Role</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <StyledTableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="center">
                  <SmallFormControl variant="outlined">
                    <Select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="personnel">Personnel</MenuItem>
                    </Select>
                  </SmallFormControl>
                </TableCell>
                <TableCell align="center">
                  <ActionButton variant="outlined" color="secondary" onClick={() => deleteUser(user._id)}>
                    Delete
                  </ActionButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledPaper>
    </Box>
  );
};

export default AdminUserManagement;
