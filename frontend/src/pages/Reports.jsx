import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Download as DownloadIcon } from '@mui/icons-material';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { saveAs } from 'file-saver'; // For saving files
import { styled } from '@mui/system';


// Styled Container using MUI's styled API and theme
const Container = styled(Box)(({ theme }) => ({
  maxWidth: '900px',
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

const Reports = () => {
  const { auth } = useAuth();
  const [reportType, setReportType] = useState('');
  const [criteria, setCriteria] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (auth.user?.role === 'admin') {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [auth.user]);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportType || !criteria) return;

    setGenerating(true);
    try {
      await api.post('/reports', { reportType, criteria });
      fetchReports(); // Refresh reports list after generating a new report
      setReportType('');
      setCriteria('');
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleViewReport = (report) => {
    setCurrentReport(report);
    setModalOpen(true);
  };

  const handleDownloadReport = async (report) => {
    try {
      const response = await api.get(`/reports/${report._id}/download`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `report_${report._id}.pdf`); // Save the PDF file
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentReport(null);
  };

  if (auth.user?.role !== 'admin') {
    return (
      <Container>
        <Typography variant="h5" align="center" color="text.primary">
          You are not authorized to view this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" color="primary.main">
        Reports
      </Typography>

      {/* Report Generation Section */}
      <Card sx={{ mb: 4, padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="text.primary">
            Generate New Report
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Report Type Selection */}
              <FormControl fullWidth variant="outlined" required>
                <InputLabel id="report-type-label">Report Type</InputLabel>
                <Select
                  labelId="report-type-label"
                  label="Report Type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>

              {/* Criteria Input */}
              <TextField
                label="Criteria"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                variant="outlined"
                fullWidth
                required
                placeholder="Enter criteria (e.g., date range)"
              />
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', paddingRight: 2, paddingBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReport}
            disabled={!reportType || !criteria || generating}
            startIcon={<AddIcon />}
          >
            {generating ? <CircularProgress size={24} color="inherit" /> : 'Generate Report'}
          </Button>
        </CardActions>
      </Card>

      {/* Existing Reports Section */}
      <Typography variant="h6" gutterBottom color="text.primary">
        Existing Reports
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {reports.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No reports available.
            </Typography>
          ) : (
            reports.map((report) => (
              <Card key={report._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="primary.main">
                    {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)} Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generated By: {report.generatedBy.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(report.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="View Report Details">
                    <IconButton color="primary" onClick={() => handleViewReport(report)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Report">
                    <IconButton color="secondary" onClick={() => handleDownloadReport(report)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Report View Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        aria-labelledby="report-dialog-title"
      >
        <DialogTitle id="report-dialog-title">Report Details</DialogTitle>
        <DialogContent dividers>
          {currentReport && (
            <>
              <Typography variant="h6" gutterBottom>
                Report Type: {currentReport.reportType.charAt(0).toUpperCase() + currentReport.reportType.slice(1)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Criteria: {currentReport.criteria}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Data:
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: 'background.paper',
                  padding: 2,
                  borderRadius: 1,
                  overflowX: 'auto',
                  maxHeight: '400px',
                }}
              >
                {JSON.stringify(currentReport.data, null, 2)}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reports;
