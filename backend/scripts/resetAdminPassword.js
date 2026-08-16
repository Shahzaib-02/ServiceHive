import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/servicehive'
const ADMIN_EMAIL = 'servicehive.admin@gmail.com'
const NEW_PASSWORD = 'servicehive'

async function main() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to', MONGO_URI)

    const user = await User.findOne({ email: ADMIN_EMAIL })
    if (!user) {
      console.error('Admin user not found:', ADMIN_EMAIL)
      process.exit(2)
    }

    const hashed = await bcrypt.hash(NEW_PASSWORD, 10)
    user.password = hashed
    await user.save()

    console.log('Admin password updated for', ADMIN_EMAIL)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Error resetting admin password:', err)
    process.exit(1)
  }
}

main()
