import mongoose from 'mongoose';
import { IndexManager } from './indexManager.js';
import bcrypt from 'bcryptjs';

const seedAdminIfNotExists = async () => {
  try {
    const User = mongoose.model('User');
    
    const existingAdmin = await User.findOne({ email: 'servicehive.admin@gmail.com' });
    if (existingAdmin) {
      return;
    }

    const hashedPassword = await bcrypt.hash('servicehive', 10);
    const admin = new User({
      name: 'Admin',
      email: 'servicehive.admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+92 300 0000000',
      city: 'Karachi',
      isApproved: true,
      isSuspended: false
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('   Email: servicehive.admin@gmail.com');
    console.log('   Password: ' + hashedPassword);
    
  } catch (error) {
    console.log('⚠️ Error seeding admin:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('🔗 MongoDB Connected:', conn.connection.host);
    
    // Create indexes for better performance using IndexManager
    const indexManager = new IndexManager();
    await indexManager.createAllIndexes();
    
    // Seed admin user if doesn't exist
    await seedAdminIfNotExists();
    
  } catch (error) {
    console.log('💥 Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;