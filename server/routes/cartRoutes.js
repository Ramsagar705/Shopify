const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.delete('/item/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;

