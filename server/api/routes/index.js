const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const departmentRoutes = require('./departments');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);

module.exports = router;