import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
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
import 'jspdf-autotable'; // Importing autoTable for better table formatting

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

const AdminScheduleManagement = () => {
  const { auth } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonnel, setSelectedPersonnel] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  useEffect(() => {
    if (auth.user?.role === 'admin') {
      fetchSchedules();
      getAllPersonnel();
    }
  }, [auth.user]);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/wastes');
      setSchedules(response.data);
      setFilteredSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllPersonnel = async () => {
    try {
      const response = await api.get('/users/personnel');
      setPersonnel(response.data);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  };

  const assignPersonnel = async (scheduleId, personnelId) => {
    try {
      await api.put(`/wastes/${scheduleId}/assign`, { personnelId });
      fetchSchedules();
    } catch (error) {
      console.error('Error assigning personnel:', error);
    }
  };

  const handlePersonnelChange = (scheduleId, personnelId) => {
    setSelectedPersonnel((prevState) => ({ ...prevState, [scheduleId]: personnelId }));
  };

  const confirmAssignment = async (scheduleId) => {
    const personnelId = selectedPersonnel[scheduleId];
    if (personnelId) {
      await assignPersonnel(scheduleId, personnelId);
    } else {
      alert('Please select personnel to assign');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = schedules.filter(
      (schedule) =>
        schedule.collectedBy.name.toLowerCase().includes(query) ||
        schedule.location.toLowerCase().includes(query) ||
        new Date(schedule.collectionDate).toLocaleDateString().includes(query)
    );

    setFilteredSchedules(filtered);
  };

  // Generate PDF for a single schedule
  const generatePDF = (schedule) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text('Waste Collection Schedule', 105, 20, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Date of Generation: ${currentDate}`, 105, 30, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`User: ${schedule.collectedBy.name}`, 20, 50);
    doc.text(`Scheduled Date: ${new Date(schedule.collectionDate).toLocaleDateString()}`, 20, 60);
    doc.text(`Area: ${schedule.location}`, 20, 70);
    doc.text(`Status: ${schedule.status}`, 20, 80);

    doc.save(`schedule_${schedule._id}.pdf`);
  };

  // Generate PDF for all schedules
  const generateAllPDFs = () => {
    const doc = new jsPDF();
    let y = 20;
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text('All Waste Collection Schedules', 105, y, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Date of Generation: ${currentDate}`, 105, y + 10, null, null, 'center');
    y += 30;

    filteredSchedules.forEach((schedule, index) => {
      doc.setFontSize(14);
      doc.text(`Schedule ${index + 1}`, 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.text(`User: ${schedule.collectedBy.name}`, 20, y);
      doc.text(`Scheduled Date: ${new Date(schedule.collectionDate).toLocaleDateString()}`, 20, y + 10);
      doc.text(`Area: ${schedule.location}`, 20, y + 20);
      doc.text(`Status: ${schedule.status}`, 20, y + 30);
      y += 40;

      if (index < filteredSchedules.length - 1) {
        doc.line(20, y, 190, y);
        y += 10;
      }

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('all_schedules.pdf');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Schedule Management
      </Typography>

      {/* Flex container for search bar and PDF button */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} md={8}>
          {/* Search Bar */}
          <SearchField
            label="Search by User, Date or Area"
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
                  <IconButton onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          {/* Button to generate PDFs for all filtered schedules */}
          <ActionButton variant="contained" color="primary" onClick={generateAllPDFs}>
            Generate PDF for All Schedules
          </ActionButton>
        </Grid>
      </Grid>

      <StyledPaper>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Scheduled Date</StyledTableCell>
              <StyledTableCell>Area</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Select Personnel</StyledTableCell>
              <StyledTableCell>Confirm Assignment</StyledTableCell>
              <StyledTableCell>Generate PDF</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <StyledTableRow key={schedule._id}>
                <TableCell>{schedule.collectedBy.name}</TableCell>
                <TableCell>{new Date(schedule.collectionDate).toLocaleDateString()}</TableCell>
                <TableCell>{schedule.location}</TableCell>
                <TableCell>{schedule.status}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel id="personnel-select-label">Assign Personnel</InputLabel>
                    <Select
                      labelId="personnel-select-label"
                      value={selectedPersonnel[schedule._id] || schedule.assignedPersonnel?._id || ''}
                      onChange={(e) => handlePersonnelChange(schedule._id, e.target.value)}
                    >
                      {personnel.map((person) => (
                        <MenuItem key={person._id} value={person._id}>
                          {person.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <ActionButton variant="contained" color="primary" onClick={() => confirmAssignment(schedule._id)}>
                    Confirm Assignment
                  </ActionButton>
                </TableCell>
                <TableCell>
                  <ActionButton variant="contained" color="secondary" onClick={() => generatePDF(schedule)}>
                    Generate PDF
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

export default AdminScheduleManagement;
