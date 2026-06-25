const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/statsController');

router.get('/', protect, authorize('admin'), getDashboardStats);

module.exports = router;
