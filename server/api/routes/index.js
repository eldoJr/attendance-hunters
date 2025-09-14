const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const departmentRoutes = require('./departments');
const facultyRoutes = require('./faculty');
const studentRoutes = require('./students');
const courseRoutes = require('./courses');

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
router.use('/faculty', facultyRoutes);
router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);

module.exports = router;