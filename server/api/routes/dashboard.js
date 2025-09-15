const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

const router = express.Router();

// Routes
router.get('/stats', authenticate, getDashboardStats);

module.exports = router;