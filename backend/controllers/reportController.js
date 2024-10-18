import asyncHandler from 'express-async-handler';
import Report from '../models/Report.js';
import generateReportData from '../utils/generateReport.js';
import generatePDFReport from '../utils/generatePDFReport.js';
import path from 'path';

// @desc    Generate a new report and create PDF
// @route   POST /api/reports
// @access  Private (Admin)
const generateNewReport = asyncHandler(async (req, res) => {
  const { reportType, criteria } = req.body;

  if (!reportType || !criteria) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  // Generate report data (include payments, users, and collection schedules)
  const data = await generateReportData(reportType, criteria);

  // Save the report in the database
  const report = await Report.create({
    generatedBy: req.user._id,
    reportType,
    criteria,
    data,
  });

  // Generate PDF
  const filePath = path.join(__dirname, `../reports/report_${Date.now()}.pdf`);
  generatePDFReport(data, filePath);

  res.status(201).json({
    message: 'Report generated successfully',
    reportId: report._id,
    filePath, // Send file path for downloading the PDF
  });
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin)
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate('generatedBy', 'name email');
  res.json(reports);
});

// @desc    Get specific report
// @route   GET /api/reports/:id
// @access  Private (Admin, Report Generator)
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate('generatedBy', 'name email');

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  if (req.user.role !== 'admin' && report.generatedBy._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this report');
  }

  res.json(report);
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  await report.remove();
  res.json({ message: 'Report removed' });
});

// @desc    Download a report PDF
// @route   GET /api/reports/:id/download
// @access  Private (Admin, Report Generator)
const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const filePath = report.filePath;
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('Error downloading the file');
    }
  });
});



export { generateNewReport, getAllReports, getReportById, deleteReport, downloadReport };
