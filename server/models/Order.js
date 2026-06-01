const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentProvider: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'COD'],
      default: 'Razorpay'
    },
    paymentInfo: {
      orderId: String,
      paymentId: String,
      signature: String
    },
    shippingInfo: {
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paidAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

