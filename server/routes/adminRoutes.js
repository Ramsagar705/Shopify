const express = require('express');
const { getDashboardStats, getUsers, setUserRole } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, setUserRole);

module.exports = router;

