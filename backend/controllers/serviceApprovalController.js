import Service from '../models/Service.js';
import notificationService from '../services/notificationService.js';
import User from "../models/User.js";

class ServiceApprovalController {
  // Get all services pending approval (for admin)
  async getPendingServices(req, res) {
    try {
      const services = await Service.find({ 
        approvalStatus: 'pending',
        status: 'pending_approval'
      })
      .populate('providerId', 'name email phone')
      .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching pending services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching pending services'
      });
    }
  }

  // Approve a service
  async approveService(req, res) {
    try {
      const { serviceId } = req.params;
      const adminId = req.user.id;

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Update service approval status
      service.approvalStatus = 'approved';
      service.isApproved = true;
      service.status = 'active';
      service.approvedBy = adminId;
      service.approvedAt = new Date();
      await service.save();

      // Send notification to service provider
      await notificationService.createServiceStatusNotification(
        serviceId,
        service.providerId,
        'approved'
      );

      res.json({
        success: true,
        message: 'Service approved successfully',
        data: service
      });

    } catch (error) {
      console.error('Error approving service:', error);
      res.status(500).json({
        success: false,
        message: 'Error approving service'
      });
    }
  }

  // Reject a service
  async rejectService(req, res) {
    try {
      const { serviceId } = req.params;
      const { rejectionReason } = req.body;
      const adminId = req.user.id;

      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required'
        });
      }

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Update service approval status
      service.approvalStatus = 'rejected';
      service.isApproved = false;
      service.status = 'rejected';
      service.rejectionReason = rejectionReason;
      service.rejectedBy = adminId;
      service.rejectedAt = new Date();
      await service.save();

      // Send notification to service provider
      await notificationService.createServiceStatusNotification(
        serviceId,
        service.providerId,
        'rejected',
        rejectionReason
      );

      res.json({
        success: false,
        message: 'Service rejected',
        data: service
      });

    } catch (error) {
      console.error('Error rejecting service:', error);
      res.status(500).json({
        success: false,
        message: 'Error rejecting service'
      });
    }
  }

  // Get service approval history
  async getServiceApprovalHistory(req, res) {
    try {
      const { serviceId } = req.params;
      
      const service = await Service.findById(serviceId)
        .populate('approvedBy', 'name email')
        .populate('rejectedBy', 'name email')
        .populate('providerId', 'name email');

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      const approvalHistory = {
        serviceId: service._id,
        title: service.title,
        provider: service.providerId,
        approvalStatus: service.approvalStatus,
        isApproved: service.isApproved,
        rejectionReason: service.rejectionReason,
        approvedBy: service.approvedBy,
        approvedAt: service.approvedAt,
        rejectedBy: service.rejectedBy,
        rejectedAt: service.rejectedAt,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      };

      res.json({
        success: true,
        data: approvalHistory
      });

    } catch (error) {
      console.error('Error fetching service approval history:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching service approval history'
      });
    }
  }

  // Get provider's services with approval status
  async getProviderServicesWithApproval(req, res) {
    try {
      const providerId = req.user.id;
      
      const services = await Service.find({ providerId })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: services
      });

    } catch (error) {
      console.error('Error fetching provider services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching provider services'
      });
    }
  }

  // Create service and trigger approval workflow
  async createServiceForApproval(req, res) {
    try {
      const serviceData = {
        ...req.body,
        providerId: req.user.id,
        approvalStatus: 'pending',
        isApproved: false,
        status: 'pending_approval'
      };

      const service = new Service(serviceData);
      await service.save();

      // Send notification to admins for approval
      await notificationService.createServiceApprovalNotification(
        service._id,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Service submitted for approval',
        data: service
      });

    } catch (error) {
      console.error('Error creating service for approval:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating service'
      });
    }
  }

  // Get approval statistics for admin dashboard
  async getApprovalStats(req, res) {
    try {
      const stats = await Service.aggregate([
        {
          $group: {
            _id: '$approvalStatus',
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedStats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
      };

      stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
      });

      res.json({
        success: true,
        data: formattedStats
      });

    } catch (error) {
      console.error('Error fetching approval stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching approval statistics'
      });
    }
  }
}

export default new ServiceApprovalController();
