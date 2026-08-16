
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const stripe = new Stripe('sk_test_51TSmB9FhOTFrDGomPiyFHEyyP9PkZ6QQtS2xaZZZxWU7fb2ZsZKYRpmYxWh8dHJfgloIvkTX30Nay3MBX8P1O9aY00mjAron3D', {
  apiVersion: '2026-03-25.dahlia',
});

// ============================================================
// ✅ WEBHOOK — must be registered BEFORE express.json() middleware
// This is what actually saves payment to DB after Stripe confirms
// ============================================================
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Only process if payment was successful
    if (session.payment_status !== 'paid') return res.json({ received: true });

    const bookingId = session.metadata?.bookingId;
    if (!bookingId) return res.json({ received: true });

    try {
      // 1. Load the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        console.error('Booking not found for webhook:', bookingId);
        return res.json({ received: true });
      }

      // Avoid duplicate processing
      if (booking.paymentStatus === 'paid') return res.json({ received: true });

      const totalAmount = session.amount_total / 100; // Stripe sends in cents

      // 2. ✅ Create Payment document
      const payment = new Payment({
        bookingId:    booking._id,
        customerId:   booking.customerId,
        providerId:   booking.providerId,
        totalAmount:  totalAmount,
        paymentStatus: 'paid',
        stripeSessionId:        session.id,
        stripePaymentIntentId:  session.payment_intent,
        paidAt: new Date(),
      });
      // pre('save') hook auto-calculates adminCommission + providerAmount
      await payment.save();

      // 3. ✅ Update Booking status
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        status: 'confirmed',
        paidAt: new Date(),
        stripeSessionId: session.id,
      });

      console.log(`✅ Payment saved for booking ${bookingId} — PKR ${totalAmount}`);
    } catch (err) {
      console.error('Error saving payment from webhook:', err);
    }
  }

  res.json({ received: true });
});

router.post('/checkout', authenticateToken, async (req, res, next) => {
  try {
    const body = req.body || {};
    const { bookingId, amount, currency = 'usd' } = body;

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Booking already paid' });
    }

    let finalAmount = amount || booking.totalAmount;

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    const MAX_PKR_AMOUNT = 999999.99;
    if (currency.toLowerCase() === 'pkr' && finalAmount > MAX_PKR_AMOUNT) {

      finalAmount = MAX_PKR_AMOUNT;
    }

    const unitAmount = Math.round(finalAmount * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Booking #${bookingId}`,
              description: `Service booking for ${req.user.name || 'customer'}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
      client_reference_id: bookingId.toString(),
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/bookings?success=true&session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/bookings?canceled=true&booking_id=${bookingId}`,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
});

router.post('/create-intent', authenticateToken, async (req, res, next) => {
  try {
    const body = req.body || {};
    const { bookingId, amount, currency = 'pkr' } = body;

    if (!bookingId) {
      return res.status(400).json({
        message: 'bookingId is required',
      });
    }

    if (!mongoose.isValidObjectId(String(bookingId))) {
      return res.status(400).json({
        message: 'Invalid booking id',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking || String(booking.customerId) !== String(req.user._id)) {
      return res.status(404).json({
        message: 'Booking not found or unauthorized',
      });
    }

    const alreadySettled = ['held', 'released'].includes(booking.paymentStatus);
    if (alreadySettled) {
      return res.status(400).json({ message: 'Booking payment already in progress or completed' });
    }

    let finalAmount = amount || booking.totalAmount;

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const MAX_PKR_AMOUNT = 999999.99;
    if (currency.toLowerCase() === 'pkr' && finalAmount > MAX_PKR_AMOUNT) {
      finalAmount = MAX_PKR_AMOUNT;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalAmount,
      currency: currency.toLowerCase(),
    });
  } catch (error) {
    console.error('create-intent:', error?.message || error);
    if (error?.type?.startsWith?.('Stripe')) {
      return res.status(400).json({
        message: error.message || 'Payment provider error',
        code: error.code,
        type: error.type,
      });
    }
    next(error);
  }
});

router.post('/confirm', authenticateToken, async (req, res, next) => {
  try {
    const body = req.body || {};
    const { sessionId } = body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      bookingId: session.metadata?.bookingId,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      customerId: req.user._id,
      paymentStatus: { $exists: true }
    })
      .populate('serviceId', 'title category')
      .populate('providerId', 'name email')
      .select('paymentStatus stripeSessionId paidAt totalAmount status bookingDate serviceId providerId');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

export default router;