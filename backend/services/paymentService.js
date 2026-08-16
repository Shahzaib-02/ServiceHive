import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import notificationService from './notificationService.js';
import User from '../models/User.js';
import { calculateAdminCommission, calculateProviderNetAmount } from '../utils/commissionRates.js';
 
class PaymentService {
  // Process payment when customer pays for booking
  async processCustomerPayment(bookingId, paymentIntentId, totalAmount) {
    try {
      const booking = await Booking.findById(bookingId).populate('customerId providerId');
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Get admin user for commission tracking
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        throw new Error('Admin user not found');
      }

      // Calculate commission amounts
      const adminCommission = calculateAdminCommission(totalAmount);
      const providerAmount = calculateProviderNetAmount(totalAmount);

      // Create payment record
      const payment = new Payment({
        bookingId,
        customerId: booking.customerId._id,
        providerId: booking.providerId._id,
        adminId: admin._id,
        totalAmount,
        adminCommission,
        providerAmount,
        commissionPercentage,
        paymentStatus: 'paid',
        providerPaymentStatus: 'pending',
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date()
      });

      await payment.save();

      // Update booking payment status
      booking.paymentStatus = 'paid';
      booking.paidAt = new Date();
      booking.stripePaymentIntentId = paymentIntentId;
      booking.adminCommission = adminCommission;
      booking.providerAmount = providerAmount;
      await booking.save();

      // Send notifications
      await notificationService.createPaymentNotification(
        payment._id, 
        totalAmount, 
        adminCommission
      );

      console.log('Customer payment processed successfully:', payment._id);
      return payment;

    } catch (error) {
      console.error('Error processing customer payment:', error);
      throw error;
    }
  }

  // Release payment to service provider after service completion and confirmation
  async releasePaymentToProvider(paymentId) {
    try {
      const payment = await Payment.findById(paymentId).populate('bookingId');
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Check if service is completed and confirmed by both parties
      if (!payment.serviceCompleted || 
          !payment.confirmedByProvider || 
          !payment.confirmedByCustomer) {
        throw new Error('Service must be completed and confirmed by both parties before payment release');
      }

      // Check if payment has already been released to provider
      if (payment.providerPaymentStatus === 'paid') {
        throw new Error('Payment has already been released to provider');
      }

      // Update payment status
      payment.providerPaymentStatus = 'paid';
      payment.providerPaidAt = new Date();
      await payment.save();

      // Update booking
      if (payment.bookingId) {
        payment.bookingId.providerPaid = true;
        payment.bookingId.providerPaidAt = new Date();
        await payment.bookingId.save();
      }

      // Send notification to provider
      await notificationService.createProviderPaymentNotification(
        paymentId,
        payment.providerId,
        payment.providerAmount
      );

      console.log('Payment released to provider successfully:', paymentId);
      return payment;

    } catch (error) {
      console.error('Error releasing payment to provider:', error);
      throw error;
    }
  }

  // Confirm service completion by provider
  async confirmServiceCompletion(bookingId, userId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Verify that the user is the service provider
      if (booking.providerId.toString() !== userId.toString()) {
        throw new Error('Only the service provider can confirm service completion');
      }

      // Update booking confirmation
      booking.confirmedByProvider = true;
      booking.providerConfirmedAt = new Date();
      await booking.save();

      // Update payment record
      const payment = await Payment.findOne({ bookingId });
      if (payment) {
        payment.confirmedByProvider = true;
        await payment.save();
      }

      // Send notification to customer
      const service = await require('../models/Service.js').default.findById(booking.serviceId);
      await notificationService.createServiceConfirmationNotification(
        bookingId,
        booking.customerId,
        'customer',
        service?.title || 'Service'
      );

      console.log('Service completion confirmed by provider:', bookingId);
      return booking;

    } catch (error) {
      console.error('Error confirming service completion:', error);
      throw error;
    }
  }

  // Confirm service completion by customer
  async confirmServiceByCustomer(bookingId, userId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Verify that the user is the customer
      if (booking.customerId.toString() !== userId.toString()) {
        throw new Error('Only the customer can confirm service completion');
      }

      // Update booking confirmation
      booking.confirmedByCustomer = true;
      booking.customerConfirmedAt = new Date();
      await booking.save();

      // Update payment record
      const payment = await Payment.findOne({ bookingId });
      if (payment) {
        payment.confirmedByCustomer = true;
        payment.confirmedByProvider = true; // Auto-confirm provider if customer confirms
        payment.serviceCompleted = true;
        payment.completedAt = new Date();
        await payment.save();
      }

      // Check if both parties have confirmed and payment is ready for release
      if (booking.confirmedByProvider && payment) {
        console.log('Service confirmed by both parties. Payment ready for release to provider.');
        // Here you could automatically release payment or require admin approval
      }

      console.log('Service confirmed by customer:', bookingId);
      return booking;

    } catch (error) {
      console.error('Error confirming service by customer:', error);
      throw error;
    }
  }

  // Get payment statistics for admin
  async getPaymentStats() {
    try {
      const stats = await Payment.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalCommission: { $sum: '$adminCommission' },
            totalProviderPayments: { $sum: '$providerAmount' },
            pendingPayments: {
              $sum: {
                $cond: [{ $eq: ['$providerPaymentStatus', 'pending'] }, '$providerAmount', 0]
              }
            },
            releasedPayments: {
              $sum: {
                $cond: [{ $eq: ['$providerPaymentStatus', 'paid'] }, '$providerAmount', 0]
              }
            },
            paymentCount: { $sum: 1 }
          }
        }
      ]);

      return stats[0] || {
        totalRevenue: 0,
        totalCommission: 0,
        totalProviderPayments: 0,
        pendingPayments: 0,
        releasedPayments: 0,
        paymentCount: 0
      };

    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  }

  // Get provider payment history
  async getProviderPaymentHistory(providerId) {
    try {
      return await Payment.find({ providerId })
        .populate('bookingId', 'totalAmount bookingDate status')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting provider payment history:', error);
      throw error;
    }
  }

  // Get pending payments for admin review
  async getPendingPayments() {
    try {
      return await Payment.find({ providerPaymentStatus: 'pending' })
        .populate('bookingId', 'totalAmount bookingDate status')
        .populate('providerId', 'name email')
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting pending payments:', error);
      throw error;
    }
  }
}

export default new PaymentService();
