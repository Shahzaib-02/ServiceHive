import express from 'express';

const router = express.Router();

// Mock endpoints to prevent 404 errors
router.get('/api/bookings', (req, res) => {
  res.json([]);
});

router.get('/api/services', (req, res) => {
  res.json([]);
});

router.get('/api/reviews', (req, res) => {
  res.json([]);
});

router.get('/api/payments', (req, res) => {
  res.json([]);
});

export default router;
