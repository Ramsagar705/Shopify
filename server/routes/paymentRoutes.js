const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  razorpayWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpaySignature);
router.post('/razorpay/webhook', razorpayWebhook);

module.exports = router;

