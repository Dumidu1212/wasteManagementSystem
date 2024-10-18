import express from 'express';
import {
  generateNewReport,
  getAllReports,
  getReportById,
  deleteReport,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


// @route   POST /api/reports
// @desc    Generate a new report
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), generateNewReport);

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getAllReports);

// @route   GET /api/reports/:id
// @desc    Get a report by ID
// @access  Private (Admin, Report Generator)
router.get('/:id', protect, authorize('admin', 'user'), getReportById);

// @route   DELETE /api/reports/:id
// @desc    Delete a report
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteReport);

export default router;
