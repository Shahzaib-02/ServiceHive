import express from 'express'
import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'
import Notification from '../models/Notification.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST process refund (Admin only)
// This endpoint should be added to bookingRoutes.js before the export statement
// Usage: router.post('/:id/refund', ...) in bookingRoutes.js
router.post('/:id/refund', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'title')
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    if (booking.paymentStatus !== 'refund_pending') {
      return res.status(400).json({ message: 'Refund not pending for this booking' })
    }

    const totalAmount = booking.totalAmount || 0
    let refundAmount = totalAmount
    let providerPayout = 0
    let adminCommission = 0

    // Determine refund type based on booking status
    if (booking.status === 'rejected') {
      // Provider rejected - full refund to customer
      refundAmount = totalAmount
      providerPayout = 0
      adminCommission = 0
    } else if (booking.status === 'cancelled') {
      // Customer rejected after service started - 6% refund fee
      const refundFee = totalAmount * 0.06
      refundAmount = totalAmount - refundFee
      adminCommission = refundFee * 0.08
      providerPayout = refundFee - adminCommission
    }

    // Update booking payment status
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      {
        paymentStatus: 'refunded',
        providerPayout,
        adminCommission
      },
      { new: true }
    )

    // Update payment record
    await Payment.findOneAndUpdate(
      { bookingId: booking._id },
      {
        paymentStatus: 'refunded',
        providerPaymentStatus: 'refunded',
        refundedAt: new Date(),
        refundAmount,
        providerAmount: providerPayout,
        adminCommission
      }
    )

    // Notify customer about processed refund
    await Notification.create({
      userId: booking.customerId,
      title: 'Refund Processed',
      message: `Your refund of PKR ${refundAmount.toLocaleString()} has been processed. The amount will be credited back to your original payment method within 5-7 business days.`,
      type: 'success',
      relatedId: booking._id,
      relatedModel: 'Booking',
      actionUrl: '/customer/payments',
      actionText: 'View Refund Status',
    })

    // Notify provider if they receive any payout
    if (providerPayout > 0) {
      await Notification.create({
        userId: booking.providerId,
        title: 'Partial Payout Received',
        message: `You have received PKR ${providerPayout.toLocaleString()} for the cancelled booking "${booking.serviceId?.title || 'Service'}".`,
        type: 'success',
        relatedId: booking._id,
        relatedModel: 'Booking',
        actionUrl: '/provider/earnings',
        actionText: 'View Earnings',
      })
    }

    res.json({
      message: 'Refund processed successfully',
      refundAmount,
      providerPayout,
      adminCommission,
      booking: updatedBooking
    })
  } catch (error) {
    next(error)
  }
})

export default router
