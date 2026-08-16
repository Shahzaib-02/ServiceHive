



import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';          // ← NEW
import { Server as SocketIOServer } from 'socket.io'; // ← NEW
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes, { registerChatSocket } from './routes/chatRoutes.js'; // ← updated import
import mockRoutes from './routes/mockRoutes.js';
import reviewRoutes from './routes/reviewsRoutes.js';
import serviceApprovalRoutes from './routes/serviceApproval.js';
import paymentsRoutes from './routes/payments.js';
import notificationsRoutes from './routes/notifications.js';

import { errorHandler } from './middleware/errorHandler.js';
import Booking from './models/Booking.js';

dotenv.config({ path: './.env' });

if (!process.env.MONGO_URI) process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/servicehive';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'supersecretkey';
if (!process.env.PORT) process.env.PORT = '5000';

const app = express();

// ── Wrap express app in a plain HTTP server so Socket.io can share the port ──
const httpServer = createServer(app); // ← NEW

// ── Socket.io setup ──────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {              // ← NEW
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});
registerChatSocket(io); // ← NEW — wires /chat namespace
app.set('io', io);

// ── All existing middleware & routes below are UNCHANGED ─────────────────────

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'stripe-signature'],
}));

app.post(
  "/api/webhooks/stripe",
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const Stripe = await import('stripe');
    const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
    });

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const Payment = (await import('./models/Payment.js')).default;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;
        if (bookingId && session.payment_status === 'paid') {
          const paidAt = new Date();
          await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'held',
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            paidAt,
            status: 'pending',
          });
          await Payment.findOneAndUpdate(
            { bookingId },
            {
              paymentStatus: 'paid',
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent,
              paidAt,
              totalAmount: (session.amount_total || 0) / 100,
            },
            { upsert: true },
          );
        }
        break;
      }
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        const bookingId = intent.metadata?.bookingId;
        if (bookingId) {
          const paidAt = new Date();
          await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'held',
            stripePaymentIntentId: intent.id,
            paidAt,
          });
          await Payment.findOneAndUpdate(
            { bookingId },
            {
              paymentStatus: 'paid',
              stripePaymentIntentId: intent.id,
              paidAt,
              totalAmount: (intent.amount_received || intent.amount || 0) / 100,
            },
            { upsert: true },
          );
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (paymentIntentId) {
          const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntentId });
          if (booking && booking.paymentStatus !== 'refunded') {
            await Booking.findByIdAndUpdate(booking._id, {
              paymentStatus: 'refunded',
              refundedAt: new Date(),
            });
            await Payment.findOneAndUpdate(
              { bookingId: booking._id },
              { paymentStatus: 'refunded', refundedAt: new Date() },
            );
          }
        }
        break;
      }
      case 'checkout.session.expired':
      case 'payment_intent.payment_failed':
      default:
        break;
    }

    res.json({ received: true });
  }
);

const jsonParser = express.json({ limit: '50mb' });
app.use((req, res, next) => {
  if (req.method === 'POST' && req.originalUrl.split('?')[0] === '/api/payments/webhook') {
    return next();
  }
  return jsonParser(req, res, next);
});

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/payments', paymentRoutes);

app.use((req, res, next) => { next(); });

connectDB();

app.use("/api/auth",             authRoutes);
app.use("/api/admin",            adminRoutes);
app.use("/api/services",         servicesRoutes);
app.use("/api/bookings",         bookingRoutes);
app.use("/api/reviews",          reviewRoutes);
app.use("/api/notifications",    notificationRoutes);
app.use("/api/chat",             chatRoutes);
app.use("/api/service-approval", serviceApprovalRoutes);
app.use("/api/payment-system",   paymentsRoutes);
app.use("/api/notify",           notificationsRoutes);

app.get("/", (req, res) => res.send("ServiceHive Backend Running..."));

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ← CHANGED: httpServer.listen instead of app.listen (Socket.io requires this)
httpServer.listen(PORT, () => {
  console.log(`ServiceHive Backend running on port ${PORT}`);
});