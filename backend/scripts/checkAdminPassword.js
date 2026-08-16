import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/servicehive'
const ADMIN_EMAIL = 'servicehive.admin@gmail.com'
const PLAINTEXT = 'servicehive'

async function main() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to', MONGO_URI)

    const user = await User.findOne({ email: ADMIN_EMAIL })
    if (!user) {
      console.error('Admin user not found:', ADMIN_EMAIL)
      process.exit(2)
    }

    console.log('Found user:', user.email)
    console.log('Stored hash:', user.password)

    const match = await bcrypt.compare(PLAINTEXT, user.password)
    console.log(`Does plaintext "${PLAINTEXT}" match stored hash? ->`, match)

    await mongoose.disconnect()
    process.exit(match ? 0 : 3)
  } catch (err) {
    console.error('Error checking admin password:', err)
    process.exit(1)
  }
}

main()
