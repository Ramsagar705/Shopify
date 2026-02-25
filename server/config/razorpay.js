const Razorpay = require('razorpay');

// Allow the server to boot even if Razorpay keys are not set yet.
// Payment routes will return a helpful error until configured.
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpayInstance =
  key_id && key_secret
    ? new Razorpay({
        key_id,
        key_secret
      })
    : null;

module.exports = razorpayInstance;

