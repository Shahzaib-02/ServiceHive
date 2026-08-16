// import express from "express";
// import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
// import { getAllUsers, getPendingUsers, approveUser, rejectUser, suspendUser, unsuspendUser, deleteUser } from "../controllers/adminController.js";
// import Booking from "../models/Booking.js";
// import Payment from "../models/Payment.js";

// const router = express.Router();

// // Apply authentication middleware to all admin routes
// router.use(authenticateToken);
// router.use(requireAdmin);

// // Admin user management routes
// router.get("/users", getAllUsers);
// router.get("/users/pending", getPendingUsers);
// router.patch("/users/:userId/approve", approveUser);
// router.patch("/users/:userId/reject", rejectUser);
// router.patch("/users/:userId/suspend", suspendUser);
// router.patch("/users/:userId/unsuspend", unsuspendUser);
// router.delete("/users/:userId", deleteUser);

// // Admin test endpoint
// router.get("/test", async (req, res, next) => {
//   try {
//     res.json({
//       message: 'Admin access working',
//       user: {
//         id: req.user._id,
//         email: req.user.email,
//         role: req.user.role
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Admin booking stats endpoint
// router.get("/bookings/stats", async (req, res, next) => {
//   try {
//     // Get total bookings count
//     const totalBookings = await Booking.countDocuments();
    
//     // Get total revenue from paid bookings
//     const paidBookings = await Booking.find({ paymentStatus: 'paid' });
//     const totalRevenue = paidBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
//     // Get booking counts by status
//     const bookingStats = await Booking.aggregate([
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     const statusCounts = bookingStats.reduce((acc, stat) => {
//       acc[stat._id] = stat.count;
//       return acc;
//     }, {});

//     const result = {
//       totalBookings,
//       totalRevenue,
//       statusCounts,
//       paidBookings: paidBookings.length,
//       pendingBookings: statusCounts.pending || 0,
//       confirmedBookings: statusCounts.confirmed || 0,
//       inProgressBookings: statusCounts.in_progress || 0,
//       completedBookings: statusCounts.completed || 0,
//       cancelledBookings: statusCounts.cancelled || 0
//     };
    
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

// // Admin payments/bookings endpoint
// router.get("/payments", async (req, res, next) => {
//   try {
//     // First try to read from the Payment collection
//     let payments = await Payment.find({ paymentStatus: 'paid' })
//       .populate('customerId', 'name email')
//       .populate('providerId', 'name email')
//       .populate('bookingId', 'bookingDate serviceTitle')
//       .sort({ paidAt: -1 })
//       .lean();

//     // If there are no Payment documents yet, fall back to Booking data
//     if (!payments || payments.length === 0) {
//       const paidBookings = await Booking.find({ paymentStatus: 'paid' })
//         .populate('customerId', 'name email')
//         .populate('providerId', 'name email')
//         .populate('serviceId', 'title category')
//         .sort({ paidAt: -1 })
//         .lean();

//       payments = paidBookings.map(b => ({
//         // create a Payment-like shape so frontend can consume it
//         _id: b._id,
//         bookingId: { _id: b._id, bookingDate: b.bookingDate, serviceTitle: b.serviceId?.title },
//         customerId: b.customerId,
//         providerId: b.providerId,
//         totalAmount: b.totalAmount,
//         adminCommission: 0,
//         paymentStatus: b.paymentStatus,
//         paidAt: b.paidAt,
//       }));
//     }

//     const totalRevenue = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
//     const totalAdminCommission = payments.reduce((sum, p) => sum + (p.adminCommission || 0), 0);

//     res.json({
//       payments,
//       totalRevenue,
//       totalAdminCommission,
//       totalPayments: payments.length,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch payments' });
//   }
// });

// export default router;





import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { getAllUsers, getPendingUsers, approveUser, rejectUser, suspendUser, unsuspendUser, deleteUser } from "../controllers/adminController.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import Service from "../models/Service.js";
import { calculateAdminCommission, calculateProviderNetAmount } from "../utils/commissionRates.js";

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Admin user management routes
router.get("/users", getAllUsers);
router.get("/users/pending", getPendingUsers);
router.patch("/users/:userId/approve", approveUser);
router.patch("/users/:userId/reject", rejectUser);
router.patch("/users/:userId/suspend", suspendUser);
router.patch("/users/:userId/unsuspend", unsuspendUser);
router.delete("/users/:userId", deleteUser);

// Admin test endpoint
router.get("/test", async (req, res, next) => {
  try {
    res.json({ message: 'Admin access working', user: { id: req.user._id, email: req.user.email, role: req.user.role } });
  } catch (error) {
    next(error);
  }
});

// Admin booking stats endpoint
router.get("/bookings/stats", async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const paidBookings  = await Booking.find({ paymentStatus: { $in: ['paid', 'held', 'released'] } });
    const totalRevenue  = paidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const bookingStats  = await Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const statusCounts  = bookingStats.reduce((acc, s) => { acc[s._id] = s.count; return acc }, {});

    res.json({
      totalBookings, totalRevenue, statusCounts,
      paidBookings:      paidBookings.length,
      pendingBookings:   statusCounts.pending    || 0,
      confirmedBookings: statusCounts.confirmed  || 0,
      completedBookings: statusCounts.completed  || 0,
      cancelledBookings: statusCounts.cancelled  || 0,
    });
  } catch (error) {
    next(error);
  }
});

// ✅ NEW: Release payment to provider (admin action)
router.post("/bookings/:bookingId/release-payment", async (req, res, next) => {
  try {
    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId)
      .populate('providerId', 'name email')
      .populate('customerId', 'name email')
      .populate('serviceId', 'title')

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    if (booking.paymentStatus === 'released') {
      return res.status(400).json({ message: 'Payment already released' })
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Booking must be completed before releasing payment' })
    }

    const adminCommission = calculateAdminCommission(booking.totalAmount)
    const providerPayout  = calculateProviderNetAmount(booking.totalAmount)

    // Update booking
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus:   'released',
      releasedAt:      new Date(),
      adminCommission,
      providerPayout,
      providerConfirmed: true,
    })

    // Update payment record
    await Payment.findOneAndUpdate(
      { bookingId },
      {
        paymentStatus:         'released',
        providerPaymentStatus: 'paid',
        providerPaidAt:        new Date(),
        adminCommission,
        providerAmount:        providerPayout,
        serviceCompleted:      true,
        completedAt:           new Date(),
      }
    )

    // ✅ Notify the provider that payment was released
    await Notification.create({
      userId:       booking.providerId._id,
      title:        'Payment Released!',
      message:      `Admin has released your payment for "${booking.serviceId?.title || 'service'}". You will receive PKR ${providerPayout.toLocaleString()} (PKR ${adminCommission.toLocaleString()} commission deducted).`,
      type:         'success',
      relatedId:    booking._id,
      relatedModel: 'Booking',
      actionUrl:    '/provider/earnings',
      actionText:   'View Earnings',
    })

    // ✅ Mark the admin notification for this booking as read
    await Notification.updateMany(
      { relatedId: bookingId, userId: req.user._id },
      { isRead: true }
    )

    res.json({
      message:       'Payment released successfully',
      bookingId,
      providerPayout,
      adminCommission,
      providerName:  booking.providerId?.name,
    })
  } catch (error) {
    next(error)
  }
})

// Admin payments endpoint
router.get("/payments", async (req, res, next) => {
  try {
    let payments = await Payment.find({ paymentStatus: { $in: ['paid', 'held', 'released'] } })
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('bookingId', 'bookingDate serviceTitle status')
      .sort({ createdAt: -1 })
      .lean();

    if (!payments || payments.length === 0) {
      const bookings = await Booking.find({ paymentStatus: { $in: ['paid', 'held', 'released'] } })
        .populate('customerId', 'name email')
        .populate('providerId', 'name email')
        .populate('serviceId', 'title category')
        .sort({ createdAt: -1 })
        .lean();

      payments = bookings.map(b => ({
        _id:          b._id,
        bookingId:    { _id: b._id, bookingDate: b.bookingDate, serviceTitle: b.serviceId?.title },
        customerId:   b.customerId,
        providerId:   b.providerId,
        totalAmount:  b.totalAmount,
        adminCommission: b.adminCommission || 0,
        providerAmount:  b.providerPayout  || 0,
        paymentStatus:   b.paymentStatus,
        paidAt:          b.paidAt,
      }));
    }

    const totalRevenue         = payments.reduce((sum, p) => sum + (p.totalAmount     || 0), 0)
    const totalAdminCommission = payments.reduce((sum, p) => sum + (p.adminCommission || 0), 0)

    res.json({ payments, totalRevenue, totalAdminCommission, totalPayments: payments.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

// Admin service management routes
router.delete("/services/:serviceId", async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    await Service.findByIdAndDelete(req.params.serviceId)
    res.json({ message: 'Service deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router;