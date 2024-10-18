// routes/collectionRoutes.js
import express from 'express';
import {
  updateCollectionStatus,
  getCollectionSchedules,
  reportIssue,
  getDailyCollectionSummary,
  recordMissedCollection,
} from '../controllers/collectionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin updates collection status
router.put('/:id/status', protect, authorize('admin'), updateCollectionStatus);

// Admin views collection schedules
router.get('/schedules', protect, authorize('admin'), getCollectionSchedules);

// Admin reports an issue
router.post('/report', protect, authorize('admin'), reportIssue);

// Admin views daily collection summary
router.get('/summary/daily', protect, authorize('admin'), getDailyCollectionSummary);

// Admin records missed collection attempts
router.put('/:id/missed', protect, authorize('admin'), recordMissedCollection);

export default router;
