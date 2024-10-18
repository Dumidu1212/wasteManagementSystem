import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

// Styled components for an enhanced professional look
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
  marginBottom: theme.spacing(2),
  width: '100%',
  '& input': {
    padding: theme.spacing(1.5),
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

const AdminRecyclingCredits = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State for search results
  const [selectedUser, setSelectedUser] = useState(null);
  const [credits, setCredits] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [loading, setLoading] = useState(true);

  // Fetch users with role 'user' only
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const filteredUsers = response.data.filter((user) => user.role === 'user');
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers); // Initialize with all users
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user && auth.user.role === 'admin') {
      fetchUsers();
    }
  }, [auth.user]);

  const addCredits = async () => {
    try {
      await api.put(`/recycling/add-credits/${selectedUser._id}`, { credits: Number(credits) });
      setMessage(`Added ${credits} credits to ${selectedUser.name}`);
      setCredits('');
      setSelectedUser(null);
      fetchUsers(); // Refresh user data after adding credits
    } catch (error) {
      console.error('Error adding credits:', error);
    }
  };

  // Function to handle the search input and filter users
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredUsers(users);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Recycling Credits Management
      </Typography>

      {/* Search Bar with Icon and Clear Functionality */}
      <SearchField
        label="Search by Name or Email"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: '#667eea' }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <StyledPaper sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Select</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Current Credits</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <StyledTableRow
                  key={user._id}
                  selected={selectedUser && selectedUser._id === user._id}
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell>
                    <input
                      type="radio"
                      checked={selectedUser && selectedUser._id === user._id}
                      onChange={() => setSelectedUser(user)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.recyclingCredits || 0}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledPaper>
      )}

      {selectedUser && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Add Credits to {selectedUser.name}
          </Typography>
          <TextField
            label="Credits"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <ActionButton variant="contained" color="primary" onClick={addCredits}>
            Add Credits
          </ActionButton>
        </Box>
      )}
    </Box>
  );
};

export default AdminRecyclingCredits;
