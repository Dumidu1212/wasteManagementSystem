import express from 'express';
import { createSchedule, getAllSchedules, updateScheduleStatus, assignPersonnel } from '../controllers/scheduleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/schedules
// @desc    Create a new schedule (Admin or User)
// @access  Private (Admin, User)
router.post('/', protect, authorize('admin', 'user'), createSchedule);

// @route   GET /api/schedules
// @desc    Get all schedules (Admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getAllSchedules);

// @route   PUT /api/schedules/:id
// @desc    Update schedule status (Admin or Personnel)
// @access  Private (Admin, Personnel)
router.put('/:id', protect, authorize('admin', 'personnel'), updateScheduleStatus);

// @route   PUT /api/schedules/:id/assign
// @desc    Assign personnel to a schedule (Admin only)
// @access  Private (Admin)
router.put('/:id/assign', protect, authorize('admin'), assignPersonnel);

export default router;
