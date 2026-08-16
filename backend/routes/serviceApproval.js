import express from 'express';
import serviceApprovalController from '../controllers/serviceApprovalController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes for service approval
router.get('/pending', authenticateToken, requireRole('admin'), serviceApprovalController.getPendingServices);
router.post('/:serviceId/approve', authenticateToken, requireRole('admin'), serviceApprovalController.approveService);
router.post('/:serviceId/reject', authenticateToken, requireRole('admin'), serviceApprovalController.rejectService);
router.get('/stats', authenticateToken, requireRole('admin'), serviceApprovalController.getApprovalStats);
router.get('/:serviceId/history', authenticateToken, requireRole('admin'), serviceApprovalController.getServiceApprovalHistory);

// Provider routes for service management
router.get('/provider/services', authenticateToken, requireRole('provider'), serviceApprovalController.getProviderServicesWithApproval);
router.post('/create', authenticateToken, requireRole('provider'), serviceApprovalController.createServiceForApproval);

export default router;
