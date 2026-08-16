

import Notification from '../models/Notification.js'
import User from '../models/User.js'
import { calculateAdminCommission, calculateProviderNetAmount } from '../utils/commissionRates.js'













import express from 'express'
import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()
const ADMIN_COMPLETION_NOTIFY_TITLE = 'Service Completed — Payment Release Required'
const ADMIN_PROVIDER_REJECT_NOTIFY_TITLE = 'Provider Rejected Booking — Refund Required'
const ADMIN_CUSTOMER_REJECT_NOTIFY_TITLE = 'Customer Rejected Service — Partial Refund Required'
const CUSTOMER_REFUND_NOTIFY_TITLE = 'Booking Rejected — Refund Initiated'

/** Notify admins once per booking when provider finishes service (escrow release reminder). */
async function notifyAdminsBookingCompleted(booking, actorUser) {
  try {
    const admins = await User.find({ role: 'admin' }).select('_id')
    if (!admins.length) {
      console.warn('[notifyAdminsBookingCompleted] No admin users found — skipping notifications')
      return
    }

    const providerName =
      actorUser?.name ||
      (booking.providerId && typeof booking.providerId === 'object' ? booking.providerId.name : null) ||
      'Provider'
    const serviceName = booking.serviceId?.title || 'a service'
    const amount = booking.totalAmount || 0
    const commission = calculateAdminCommission(amount)
    const providerGets = calculateProviderNetAmount(amount)

    await Notification.insertMany(
      admins.map((admin) => ({
        userId: admin._id,
        title: ADMIN_COMPLETION_NOTIFY_TITLE,
        message: `${providerName} has completed "${serviceName}". Total: PKR ${amount.toLocaleString()}. Your commission: PKR ${commission.toLocaleString()}. Provider payout: PKR ${providerGets.toLocaleString()}. Please review and release payment.`,
        type: 'warning',
        relatedId: booking._id,
        relatedModel: 'Booking',
        actionUrl: `/admin/bookings/${booking._id}/release`,
        actionText: 'Release Payment',
      }))
    )
    console.log(`✅ Notified ${admins.length} admin(s) about completed booking ${booking._id}`)
  } catch (err) {
    console.error('Failed to create admin completion notifications:', err.message)
  }
}

/** Notify customer when provider rejects a paid booking (test mode - no actual Stripe refund). */
async function notifyCustomerRefund(booking, providerUser, refundAmount) {
  try {
    console.log('[notifyCustomerRefund] Starting notification process...')
    const customerId = typeof booking.customerId === 'object' ? booking.customerId._id : booking.customerId
    console.log('[notifyCustomerRefund] Customer ID:', customerId, 'Type:', typeof booking.customerId)
    if (!customerId) {
      console.warn('[notifyCustomerRefund] No customer ID found — skipping notification')
      return
    }

    const providerName =
      providerUser?.name ||
      (booking.providerId && typeof booking.providerId === 'object' ? booking.providerId.name : null) ||
      'Provider'
    const serviceName = booking.serviceId?.title || 'a service'
    const amount = refundAmount || booking.totalAmount || 0

    const notification = {
      userId: customerId,
      title: CUSTOMER_REFUND_NOTIFY_TITLE,
      message: `${providerName} has rejected your booking for "${serviceName}". A refund of PKR ${amount.toLocaleString()} has been initiated. The amount will be credited back to your original payment method within 5-7 business days.`,
      type: 'warning',
      relatedId: booking._id,
      relatedModel: 'Booking',
      actionUrl: '/customer/payments',
      actionText: 'View Refund Status',
    }
    console.log('[notifyCustomerRefund] Creating notification:', notification)
    const result = await Notification.create(notification)
    console.log(`✅ Notified customer ${customerId} about refund for booking ${booking._id}`, result)
  } catch (err) {
    console.error('Failed to create customer refund notification:', err.message, err.stack)
  }
}

/** Notify admins when provider rejects a booking (full refund required). */
async function notifyAdminsProviderReject(booking, providerUser) {
  try {
    console.log('[notifyAdminsProviderReject] Starting notification process...')
    console.log('[notifyAdminsProviderReject] Booking data:', {
      _id: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      totalAmount: booking.totalAmount
    })

    const admins = await User.find({ role: 'admin' }).select('_id')
    console.log('[notifyAdminsProviderReject] Found admins:', admins.length, admins.map(a => a._id))
    if (!admins.length) {
      console.warn('[notifyAdminsProviderReject] No admin users found — skipping notifications')
      return
    }

    const providerName =
      providerUser?.name ||
      (booking.providerId && typeof booking.providerId === 'object' ? booking.providerId.name : null) ||
      'Provider'
    const serviceName = booking.serviceId?.title || 'a service'
    const amount = booking.totalAmount || 0

    const notifications = admins.map((admin) => ({
      userId: admin._id,
      title: ADMIN_PROVIDER_REJECT_NOTIFY_TITLE,
      message: `${providerName} has rejected booking for "${serviceName}". Full refund of PKR ${amount.toLocaleString()} required. Please review and process the refund to the customer.`,
      type: 'warning',
      relatedId: booking._id,
      relatedModel: 'Booking',
      actionUrl: `/admin/bookings/${booking._id}/refund`,
      actionText: 'Process Refund',
    }))

    console.log('[notifyAdminsProviderReject] Creating notifications:', notifications)
    const result = await Notification.insertMany(notifications)
    console.log(`✅ Notified ${admins.length} admin(s) about provider rejection for booking ${booking._id}`, result)

    // Verify notifications were created
    const createdNotifications = await Notification.find({ title: ADMIN_PROVIDER_REJECT_NOTIFY_TITLE, relatedId: booking._id })
    console.log('[notifyAdminsProviderReject] Verification - found notifications in DB:', createdNotifications.length)
  } catch (err) {
    console.error('Failed to create admin provider rejection notifications:', err.message, err.stack)
    throw err
  }
}

/** Notify admins when customer rejects service after it started (partial refund required). */
async function notifyAdminsCustomerReject(booking, customerUser) {
  try {
    const admins = await User.find({ role: 'admin' }).select('_id')
    if (!admins.length) {
      console.warn('[notifyAdminsCustomerReject] No admin users found — skipping notifications')
      return
    }

    const serviceName = booking.serviceId?.title || 'a service'
    const totalAmount = booking.totalAmount || 0
    const refundFee = totalAmount * 0.06
    const refundAmount = totalAmount - refundFee
    const adminFee = refundFee * 0.08
    const providerShare = refundFee - adminFee

    await Notification.insertMany(
      admins.map((admin) => ({
        userId: admin._id,
        title: ADMIN_CUSTOMER_REJECT_NOTIFY_TITLE,
        message: `Customer has rejected service "${serviceName}" after it started. Partial refund required: PKR ${refundAmount.toLocaleString()} to customer (94%), PKR ${adminFee.toLocaleString()} admin fee (8% of 6% fee), PKR ${providerShare.toLocaleString()} to provider. Please review and process.`,
        type: 'warning',
        relatedId: booking._id,
        relatedModel: 'Booking',
        actionUrl: `/admin/bookings/${booking._id}/refund`,
        actionText: 'Process Refund',
      }))
    )
    console.log(`✅ Notified ${admins.length} admin(s) about customer rejection for booking ${booking._id}`)
  } catch (err) {
    console.error('Failed to create admin customer rejection notifications:', err.message)
  }
}

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let query = {}

    if (req.user.role === 'provider') {
      query.providerId = req.user._id
    } else if (req.user.role === 'customer') {
      query.customerId = req.user._id
    }

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category')
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [
        { customerId: req.user._id },
        { providerId: req.user._id }
      ]
    })
    .populate('serviceId', 'title category')
    .populate('customerId', 'name email')
    .populate('providerId', 'name email')

    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    next(error)
  }
})

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { serviceId, providerId, totalAmount, location, notes, bookingDate } = req.body

    // Validate required fields explicitly so we get a clear error
    if (!serviceId) return res.status(400).json({ success: false, error: { message: 'serviceId is required' } })
    if (!providerId) return res.status(400).json({ success: false, error: { message: 'providerId is required' } })
    if (!totalAmount && totalAmount !== 0) return res.status(400).json({ success: false, error: { message: 'totalAmount is required' } })

    // Build location safely
    const locationData = {
      address: location?.address || location?.fullAddress || 'Customer location',
      coordinates: {
        lat: Number(location?.coordinates?.lat ?? location?.lat ?? 0),
        lng: Number(location?.coordinates?.lng ?? location?.lng ?? 0),
      }
    }

    const booking = new Booking({
      customerId: req.user._id,
      serviceId,
      providerId,
      totalAmount: Number(totalAmount),
      location: locationData,
      notes: notes || '',
      bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
      status: 'pending',
      paymentStatus: 'pending'
    })

    await booking.save()

    // Create payment — pre-save hook calculates adminCommission & providerAmount
    try {
      const payment = new Payment({
        bookingId: booking._id,
        customerId: req.user._id,
        providerId,
        totalAmount: Number(totalAmount),
        commissionPercentage: 0.08,
        paymentStatus: 'pending'
      })
      await payment.save()
    } catch (paymentErr) {
      // Don't fail the booking if payment record creation fails
    }

    // Return populated booking
    const populated = await Booking.findById(booking._id)
      .populate('serviceId', 'title category basePrice')
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')

    res.status(201).json({ message: 'Booking created successfully', booking: populated })
  } catch (error) {
    console.error('💥 Booking controller error:', error)
    console.error('💥 Error message:', error.message)
    console.error('💥 Error stack:', error.stack)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: Object.values(error.errors).map(e => ({ field: e.path, message: e.message }))
        },
        timestamp: new Date().toISOString()
      })
    }
    
    // Direct error response - avoid Express error handler issues
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    })
  }
})

router.patch('/:id/status', authenticateToken, async (req, res, next) => {
  try {
    console.log('🚀 PATCH /:id/status called')
    console.log('📥 Request body:', req.body)
    console.log('👤 User:', req.user._id, req.user.role)

    const { status } = req.body
    
    // Validate status is provided
    if (!status) {
      return res.status(400).json({ error: 'Status field is required' })
    }

    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking ID format' })
    }

    console.log('📊 Status to update:', status)

    const filter = {
      _id: req.params.id,
      $or: [
        { customerId: req.user._id },
        { providerId: req.user._id }
      ]
    }

    console.log('🔍 Filter:', filter)
    const prior = await Booking.findOne(filter).select('status providerId customerId paymentStatus')
    console.log('📋 Prior booking:', prior)

    const updateData = { status }
    if (status === 'completed') updateData.completionDate = new Date()
    if (status === 'accepted')  updateData.paymentStatus  = 'held'

    // Handle refund when provider rejects a booking (test mode - no actual Stripe refund)
    if (status === 'rejected' && prior && String(prior.providerId) === String(req.user._id)) {
      updateData.paymentStatus = 'refund_pending'
    }

    // Customer rejects the service after it has started: mark refund pending for partial refund (6% fee).
    if (
      status === 'cancelled' &&
      prior &&
      prior.status === 'in_progress' &&
      String(prior.customerId) === String(req.user._id)
    ) {
      updateData.paymentStatus = 'refund_pending'
    }

    console.log('📝 Update data:', updateData)

    const booking = await Booking.findOneAndUpdate(
      filter,
      updateData,
      { new: true }
    )
    .populate('serviceId', 'title')
    .populate('customerId', 'name email')
    .populate('providerId', 'name email')

    console.log('✅ Updated booking:', booking)

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    if (status === 'accepted') {
      await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        { paymentStatus: 'held' }
      )
    }

    // Provider assigned to this booking marked it completed (do not rely on role string alone)
    const providerMarkedComplete =
      status === 'completed' &&
      prior &&
      prior.status !== 'completed' &&
      String(prior.providerId) === String(req.user._id)

    if (providerMarkedComplete) {
      await notifyAdminsBookingCompleted(booking, req.user)
    }

    // Provider rejected a booking - notify admins and customer about refund (test mode)
    const providerRejectedWithPayment =
      status === 'rejected' &&
      prior &&
      prior.status !== 'rejected' &&
      String(prior.providerId) === String(req.user._id)

    console.log('🔍 Provider rejection check:', {
      status,
      priorStatus: prior?.status,
      priorPaymentStatus: prior?.paymentStatus,
      providerId: String(prior?.providerId),
      userId: String(req.user._id),
      providerRejectedWithPayment
    })

    if (providerRejectedWithPayment) {
      console.log('📢 Calling notifyAdminsProviderReject...')
      try {
        await notifyAdminsProviderReject(booking, req.user)
        console.log('✅ notifyAdminsProviderReject completed')
      } catch (err) {
        console.error('❌ notifyAdminsProviderReject failed:', err)
      }
      console.log('📢 Calling notifyCustomerRefund...')
      try {
        await notifyCustomerRefund(booking, req.user, booking.totalAmount)
        console.log('✅ notifyCustomerRefund completed')
      } catch (err) {
        console.error('❌ notifyCustomerRefund failed:', err)
      }
    } else {
      console.log('⚠️ Provider rejection condition not met - skipping notifications')
    }

    // Customer rejected service after it started - notify admins about partial refund
    const customerRejectedAfterStart =
      status === 'cancelled' &&
      prior &&
      prior.status !== 'cancelled' &&
      prior.status === 'in_progress' &&
      String(prior.customerId) === String(req.user._id)

    if (customerRejectedAfterStart) {
      await notifyAdminsCustomerReject(booking, req.user)
    }

    res.json(booking)
  } catch (error) {
    next(error)
  }
})

router.post('/:id/confirm-complete', authenticateToken, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [
        { customerId: req.user._id },
        { providerId: req.user._id }
      ]
    })

    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Booking must be completed first' })
    }

    if (String(booking.customerId) === String(req.user._id)) {
      booking.customerConfirmed = true
    }
    if (String(booking.providerId) === String(req.user._id)) {
      booking.providerConfirmed = true
    }

    if (booking.customerConfirmed && booking.providerConfirmed) {
      booking.paymentStatus = 'released'
      booking.releasedAt = new Date()

      const commissionRate = 0.08
      booking.adminCommission = Math.round(booking.totalAmount * commissionRate * 100) / 100
      booking.providerPayout = Math.round((booking.totalAmount - booking.adminCommission) * 100) / 100

      await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        {
          paymentStatus: 'released',
          providerPaymentStatus: 'paid',
          providerPaidAt: new Date(),
          adminCommission: booking.adminCommission,
          providerAmount: booking.providerPayout,
          serviceCompleted: true,
          completedAt: new Date()
        }
      )
    }

    await booking.save()

    res.json({ 
      message: 'Confirmation recorded',
      released: booking.paymentStatus === 'released',
      booking
    })
  } catch (error) {
    next(error)
  }
})

router.get('/provider/earnings', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Provider access required' })
    }

    const bookings = await Booking.find({
      providerId: req.user._id,
      paymentStatus: 'released'
    })

    const totalEarnings = bookings.reduce((sum, b) => sum + (b.providerPayout || 0), 0)
    const totalJobs = bookings.length
    const totalCommission = bookings.reduce((sum, b) => sum + (b.adminCommission || 0), 0)

    res.json({ 
      totalEarnings, 
      totalJobs, 
      totalCommission,
      bookings 
    })
  } catch (error) {
    next(error)
  }
})

// Delete booking (Admin or customer can delete their own)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Allow admin to delete any booking, or customer to delete their own
    const isOwner = String(booking.customerId) === String(req.user._id)
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'You can only delete your own bookings' })
    }

    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    next(error)
  }
})
// POST process refund (Admin only)
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

    // Update booking payment status and change status to released
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      {
        status: 'released',
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