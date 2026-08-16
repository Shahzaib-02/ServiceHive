// server/routes/webhooks.js
import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51TSmB9FhOTFrDGomPiyFHEyyP9PkZ6QQtS2xaZZZxWU7fb2ZsZKYRpmYxWh8dHJfgloIvkTX30Nay3MBX8P1O9aY00mjAron3D');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper to update booking payment status in database
const updateBookingPaymentStatus = async (bookingId, data) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: data.status,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        paidAt: data.paidAt,
        status: 'accepted'
      },
      { new: true }
    );
    
    if (booking) {
      console.log(`✅ Booking ${bookingId} updated successfully`);
    } else {
      console.error(`❌ Booking ${bookingId} not found`);
    }
  } catch (error) {
    console.error(`❌ Failed to update booking ${bookingId}:`, error.message);
  }
};

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      
      if (bookingId) {
        await updateBookingPaymentStatus(bookingId, {
          status: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          paidAt: new Date(),
        });
        console.log(`✅ Payment confirmed for booking ${bookingId}`);
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      console.log(`⏰ Checkout expired for booking ${session.metadata?.bookingId}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;