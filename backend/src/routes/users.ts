import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get all users (admin/manager only)
router.get('/', authorize('admin', 'manager'), (req, res) => {
  res.json({ message: 'Get all users - TODO: Implement' });
});

// Get user by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} - TODO: Implement` });
});

// Update user
router.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id} - TODO: Implement` });
});

// Delete user (admin only)
router.delete('/:id', authorize('admin'), (req, res) => {
  res.json({ message: `Delete user ${req.params.id} - TODO: Implement` });
});

export default router;
