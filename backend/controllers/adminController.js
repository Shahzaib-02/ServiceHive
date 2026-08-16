import User from "../models/User.js";
import PendingUser from "../models/pendingUser.js";

// Get all users for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const pendingUsers = await PendingUser.find({}).select('-password');
    
    res.json({
      approvedUsers: users,
      pendingUsers: pendingUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending users only
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await PendingUser.find({}).select('-password');
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user in pending collection
    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    // Move to main users collection with approval
    const approvedUser = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: pendingUser.role,
      phone: pendingUser.phone,
      cnic: pendingUser.cnic,
      city: pendingUser.city,
      cnicFileName: pendingUser.cnicFileName,
      cnicDocumentDataUrl: pendingUser.cnicDocumentDataUrl,
      isApproved: true,
      isSuspended: false,
      rejectionReason: ''
    });

    // Remove from pending collection
    await PendingUser.findByIdAndDelete(userId);

    res.json({
      message: "User approved successfully",
      user: {
        id: approvedUser._id,
        name: approvedUser.name,
        email: approvedUser.email,
        role: approvedUser.role,
        phone: approvedUser.phone,
        city: approvedUser.city,
        isApproved: approvedUser.isApproved,
        isSuspended: approvedUser.isSuspended
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;
    
    // First try to find in pending collection
    const pendingUser = await PendingUser.findById(userId);
    if (pendingUser) {
      // Remove from pending collection
      await PendingUser.findByIdAndDelete(userId);

      // Create rejected user record
      const rejectedUser = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        role: pendingUser.role,
        phone: pendingUser.phone,
        cnic: pendingUser.cnic,
        city: pendingUser.city,
        cnicFileName: pendingUser.cnicFileName,
        cnicDocumentDataUrl: pendingUser.cnicDocumentDataUrl,
        isApproved: false,
        isSuspended: true,
        rejectionReason: rejectionReason || 'Registration rejected by admin'
      });

      return res.json({
        message: "User rejected successfully",
        user: {
          id: rejectedUser._id,
          name: rejectedUser.name,
          email: rejectedUser.email,
          role: rejectedUser.role,
          isApproved: rejectedUser.isApproved,
          isSuspended: rejectedUser.isSuspended,
          rejectionReason: rejectedUser.rejectionReason
        }
      });
    }

    // If not in pending, try to find in main users collection
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isApproved: false, 
        isSuspended: true,
        rejectionReason: rejectionReason || 'User rejected by admin'
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User rejected successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isSuspended: user.isSuspended,
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend user
export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isSuspended: true,
        isApproved: false
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User suspended successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsuspend user
export const unsuspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isSuspended: false,
        isApproved: true
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User unsuspended successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Try to find and delete from pending users first
    const pendingUser = await PendingUser.findByIdAndDelete(userId);
    if (pendingUser) {
      return res.json({
        message: "Pending user deleted successfully"
      });
    }
    
    // Try to find and delete from main users collection
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
