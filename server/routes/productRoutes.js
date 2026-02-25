const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  createReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

router.post('/:productId/reviews', protect, createReview);

module.exports = router;

