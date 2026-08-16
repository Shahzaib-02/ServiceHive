import express from 'express';
import paymentService from '../services/paymentService.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Process payment when customer pays
router.post('/process', authenticateToken, paymentService.processCustomerPayment);

// Release payment to provider (admin action)
router.post('/:paymentId/release', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const payment = await paymentService.releasePaymentToProvider(req.params.paymentId);
    res.json({
      success: true,
      message: 'Payment released to provider successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Confirm service completion by provider
router.post('/bookings/:bookingId/confirm-provider', authenticateToken, requireRole('provider'), async (req, res) => {
  try {
    const booking = await paymentService.confirmServiceCompletion(req.params.bookingId, req.user.id);
    res.json({
      success: true,
      message: 'Service completion confirmed by provider',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Confirm service by customer
router.post('/bookings/:bookingId/confirm-customer', authenticateToken, requireRole('customer'), async (req, res) => {
  try {
    const booking = await paymentService.confirmServiceByCustomer(req.params.bookingId, req.user.id);
    res.json({
      success: true,
      message: 'Service confirmed by customer',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get payment statistics (admin)
router.get('/stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const stats = await paymentService.getPaymentStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics'
    });
  }
});

// Get provider payment history
router.get('/provider/history', authenticateToken, requireRole('provider'), async (req, res) => {
  try {
    const payments = await paymentService.getProviderPaymentHistory(req.user.id);
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
});

// Get pending payments for admin review
router.get('/pending', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const payments = await paymentService.getPendingPayments();
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending payments'
    });
  }
});

export default router;
