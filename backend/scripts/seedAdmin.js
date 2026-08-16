import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/servicehive');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'servicehive.admin@gmail.com' });
    if (existingAdmin) {
      process.exit(0);
    }

    // Create admin user
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
    console.log('Admin user created successfully');
    console.log('Email: servicehive.admin@gmail.com');
    console.log('Password: servicehive');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
