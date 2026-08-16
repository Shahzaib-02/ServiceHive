import Notification from '../models/Notification.js';
import User from '../models/User.js';

class NotificationService {
  // Create notification for admin when service provider publishes a service
  async createServiceApprovalNotification(serviceId, providerId) {
    try {
      // Get all admin users
      const admins = await User.find({ role: 'admin' });
      
      const notificationPromises = admins.map(admin => 
        new Notification({
          userId: admin._id,
          title: 'New Service Approval Required',
          message: `A new service has been submitted for approval by a service provider.`,
          type: 'info',
          relatedId: serviceId,
          relatedModel: 'Service',
          actionUrl: `/admin/services/${serviceId}/review`,
          actionText: 'Review Service'
        }).save()
      );

      await Promise.all(notificationPromises);
      console.log(`Service approval notifications sent to ${admins.length} admins`);
    } catch (error) {
      console.error('Error creating service approval notification:', error);
    }
  }

  // Create notification for service provider when admin approves/rejects service
  async createServiceStatusNotification(serviceId, providerId, status, rejectionReason = null) {
    try {
      const title = status === 'approved' ? 'Service Approved' : 'Service Rejected';
      const message = status === 'approved' 
        ? 'Your service has been approved and is now live on the platform.'
        : `Your service has been rejected. Reason: ${rejectionReason || 'Not specified'}`;
      
      await new Notification({
        userId: providerId,
        title,
        message,
        type: status === 'approved' ? 'success' : 'error',
        relatedId: serviceId,
        relatedModel: 'Service',
        actionUrl: `/provider/services/${serviceId}`,
        actionText: 'View Service'
      }).save();

      console.log(`Service ${status} notification sent to provider ${providerId}`);
    } catch (error) {
      console.error('Error creating service status notification:', error);
    }
  }

  // Create notification for service provider when customer books a service
  async createBookingNotification(bookingId, providerId, customerId, serviceName) {
    try {
      await new Notification({
        userId: providerId,
        title: 'New Service Booking',
        message: `A customer has booked your service: ${serviceName}`,
        type: 'info',
        relatedId: bookingId,
        relatedModel: 'Booking',
        actionUrl: `/provider/bookings/${bookingId}`,
        actionText: 'View Booking'
      }).save();

      console.log(`Booking notification sent to provider ${providerId}`);
    } catch (error) {
      console.error('Error creating booking notification:', error);
    }
  }

  // Create notification for admin when payment is received
  async createPaymentNotification(paymentId, amount, commission) {
    try {
      const admins = await User.find({ role: 'admin' });
      
      const notificationPromises = admins.map(admin => 
        new Notification({
          userId: admin._id,
          title: 'Payment Received',
          message: `Payment of RS${amount.toFixed(2)} received. Admin commission: RS${commission.toFixed(2)}`,
          type: 'success',
          relatedId: paymentId,
          relatedModel: 'Payment',
          actionUrl: `/admin/payments/${paymentId}`,
          actionText: 'View Payment'
        }).save()
      );

      await Promise.all(notificationPromises);
      console.log(`Payment notifications sent to ${admins.length} admins`);
    } catch (error) {
      console.error('Error creating payment notification:', error);
    }
  }

  // Create notification for service provider when payment is released
  async createProviderPaymentNotification(paymentId, providerId, amount) {
    try {
      await new Notification({
        userId: providerId,
        title: 'Payment Released',
        message: `Your payment of RS${amount.toFixed(2)} has been released to your account.`,
        type: 'success',
        relatedId: paymentId,
        relatedModel: 'Payment',
        actionUrl: `/provider/payments/${paymentId}`,
        actionText: 'View Payment'
      }).save();

      console.log(`Provider payment notification sent to provider ${providerId}`);
    } catch (error) {
      console.error('Error creating provider payment notification:', error);
    }
  }

  // Create notification for service confirmation
  async createServiceConfirmationNotification(bookingId, userId, userType, serviceName) {
    try {
      const title = userType === 'provider' 
        ? 'Service Confirmation Required' 
        : 'Service Confirmed by Provider';
      
      const message = userType === 'provider'
        ? `Please confirm the service completion for: ${serviceName}`
        : `The service provider has confirmed completion for: ${serviceName}`;

      await new Notification({
        userId,
        title,
        message,
        type: 'info',
        relatedId: bookingId,
        relatedModel: 'Booking',
        actionUrl: userType === 'provider' ? '/provider/bookings' : '/customer/bookings',
        actionText: 'View Booking'
      }).save();

      console.log(`Service confirmation notification sent to ${userType} ${userId}`);
    } catch (error) {
      console.error('Error creating service confirmation notification:', error);
    }
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId) {
    try {
      return await Notification.find({ 
        userId, 
        isRead: false 
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      await Notification.updateOne(
        { _id: notificationId, userId },
        { isRead: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }
}

export default new NotificationService();
