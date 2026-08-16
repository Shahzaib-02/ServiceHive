import mongoose from 'mongoose';
import User from '../models/User.js';
import PendingUser from '../models/pendingUser.js';

const clearTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/servicehive');
    console.log('Connected to MongoDB');

    // Clear all pending users
    const pendingResult = await PendingUser.deleteMany({});
    console.log(`Deleted ${pendingResult.deletedCount} pending users`);

    // Clear all non-admin users from main users collection
    const userResult = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Deleted ${userResult.deletedCount} non-admin users`);

    // Reset admin user to default state
    await User.updateOne(
      { email: 'servicehive.admin@gmail.com' },
      { 
        $set: {
          isApproved: true,
          isSuspended: false,
          rejectionReason: ''
        }
      }
    );
    console.log('Admin user reset to default state');

    console.log('\n Database cleaned successfully!');
    console.log('📊 Current state:');
    
    // Count current users
    const userCount = await User.countDocuments();
    const pendingCount = await PendingUser.countDocuments();
    
    console.log(`- Total users in main collection: ${userCount}`);
    console.log(`- Pending users: ${pendingCount}`);
    
    // Show admin user details
    const adminUser = await User.findOne({ email: 'servicehive.admin@gmail.com' });
    if (adminUser) {
      console.log(`- Admin user: ${adminUser.name} (${adminUser.email})`);
      console.log(`- Admin approved: ${adminUser.isApproved}`);
      console.log(`- Admin suspended: ${adminUser.isSuspended}`);
    }

  } catch (error) {
    console.error(' Error clearing test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

clearTestData();
