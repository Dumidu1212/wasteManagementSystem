import express from 'express';
import {
  createWasteCollection,
  getAllWasteCollections,
  getWasteCollectionsByUser,
  updateWasteCollectionStatus,
  deleteWasteCollection,
  assignPersonnel, // Add assignPersonnel function
  scanQRCode,
} from '../controllers/wasteController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scan', protect, authorize('personnel'), scanQRCode);
router.post('/', protect, authorize('admin', 'user'), createWasteCollection);
router.get('/', protect, authorize('admin'), getAllWasteCollections);
// Updated route to ensure users can only access their own data
router.get('/user/:userId', protect, authorize('admin', 'user'), getWasteCollectionsByUser);

router.put('/:id', protect, authorize('admin', 'personnel'), updateWasteCollectionStatus);
router.put('/:id/assign', protect, authorize('admin'), assignPersonnel); // New route for assigning personnel
router.delete('/:id', protect, authorize('admin', 'user'), deleteWasteCollection);



export default router;
