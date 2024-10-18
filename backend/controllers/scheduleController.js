import asyncHandler from 'express-async-handler';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notification.js'; // Notification utility

// @desc    Create a new waste collection schedule (User or Admin)
// @route   POST /api/schedules
// @access  Private (User or Admin)
const createSchedule = asyncHandler(async (req, res) => {
  const { scheduledDate, area, notes } = req.body;
  const userId = req.user._id;

  const schedule = await Schedule.create({
    user: userId,
    scheduledDate,
    area,
    notes,
    createdBy: req.user._id, // Created by user or admin
  });

  // Send notification to the personnel assigned to this area
  sendNotification('New schedule created', `Waste collection scheduled on ${scheduledDate} for area ${area}`);

  res.status(201).json(schedule);
});

// @desc    Get all schedules (Admin)
// @route   GET /api/schedules
// @access  Private (Admin)
const getAllSchedules = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find().populate('user', 'name email');
  res.json(schedules);
});

// @desc    Update schedule status (Admin or Personnel)
// @route   PUT /api/schedules/:id
// @access  Private (Admin or Personnel)
const updateScheduleStatus = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Schedule not found');
  }

  schedule.status = req.body.status || schedule.status;

  const updatedSchedule = await schedule.save();

  // Notify the user of the schedule update
  sendNotification('Schedule status updated', `Your waste collection schedule for ${schedule.scheduledDate} is now ${schedule.status}`);

  res.json(updatedSchedule);
});

// @desc    Assign personnel to a schedule
// @route   PUT /api/schedules/:id/assign
// @access  Private (Admin)
const assignPersonnel = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  const { personnelId } = req.body;

  if (!schedule) {
    res.status(404);
    throw new Error('Schedule not found');
  }

  const personnel = await User.findById(personnelId);
  if (!personnel) {
    res.status(404);
    throw new Error('Personnel not found');
  }

  schedule.assignedPersonnel = personnelId; // Assign personnel to the schedule
  const updatedSchedule = await schedule.save();

  // Notify the personnel about the assignment
  sendNotification('Schedule assignment', `You have been assigned to a new schedule on ${schedule.scheduledDate} for area ${schedule.area}`);

  res.json(updatedSchedule);
});

export { createSchedule, getAllSchedules, updateScheduleStatus, assignPersonnel };
