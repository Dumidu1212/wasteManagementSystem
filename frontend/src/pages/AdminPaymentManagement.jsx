import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
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

const AdminPaymentManagement = () => {
  const { auth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
      setFilteredPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user && auth.user.role === 'admin') {
      fetchPayments();
    }
  }, [auth.user]);

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      await api.put(`/payments/${paymentId}`, { status });
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const deletePayment = async (paymentId) => {
    try {
      await api.delete(`/payments/${paymentId}`);
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = payments.filter((payment) =>
      payment.user.name.toLowerCase().includes(query)
    );
    setFilteredPayments(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPayments(payments);
  };

  // Generate PDF for all filtered payments
  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text('Payment Management Report', 105, 20, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Date of Generation: ${currentDate}`, 105, 30, null, null, 'center');

    const tableColumn = ['User', 'Amount', 'Payment Method', 'Status'];
    const tableRows = [];

    filteredPayments.forEach((payment) => {
      const paymentData = [
        payment.user.name,
        payment.amount,
        payment.paymentMethod,
        payment.status,
      ];
      tableRows.push(paymentData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save('payment_management_report.pdf');
  };

  return (
    <Box p={4}>
      {/* Added margin bottom to create space after the title */}
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary" mb={3}>
        Payment Management
      </Typography>

      {/* Flex container to center search bar and align PDF button to the right */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        {/* Enhanced Search Bar with Icon and Clear Functionality */}
        <Grid item xs={12} md={8}>
          <SearchField
            label="Search by User Name"
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
        </Grid>

        {/* Button to generate PDF for filtered payments */}
        <Grid item xs={12} md={4} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          <ActionButton variant="contained" color="primary" onClick={generatePDF}>
            Generate PDF Report
          </ActionButton>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <StyledPaper>
          {filteredPayments.length === 0 ? (
            <Alert severity="info">No payments found.</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>User</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Payment Method</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <StyledTableRow key={payment._id}>
                    <TableCell>{payment.user.name}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <ActionButton
                          variant="contained"
                          color="primary"
                          onClick={() => updatePaymentStatus(payment._id, 'Completed')}
                        >
                          Mark as Completed
                        </ActionButton>
                        <ActionButton
                          variant="outlined"
                          color="secondary"
                          onClick={() => deletePayment(payment._id)}
                        >
                          Delete
                        </ActionButton>
                      </Stack>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </StyledPaper>
      )}
    </Box>
  );
};

export default AdminPaymentManagement;
