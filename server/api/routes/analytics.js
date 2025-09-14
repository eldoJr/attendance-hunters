const express = require('express');
const { param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getOverview,
  getDepartmentAnalytics,
  getClassAnalytics,
  getStudentPerformance,
  getAttendanceTrends
} = require('../controllers/analyticsController');

const router = express.Router();

const validateId = [
  param('id').isUUID().withMessage('Valid ID is required')
];

const validateTrendsQuery = [
  query('period').optional().isInt({ min: 1, max: 365 }).withMessage('Period must be between 1 and 365 days'),
  query('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  query('classId').optional().isUUID().withMessage('Valid class ID is required')
];

// Routes
router.get('/overview', authenticate, getOverview);
router.get('/department/:id', authenticate, authorize('admin', 'staff'), validateId, handleValidation, getDepartmentAnalytics);
router.get('/class/:id', authenticate, validateId, handleValidation, getClassAnalytics);
router.get('/student/:id', authenticate, validateId, handleValidation, getStudentPerformance);
router.get('/trends', authenticate, validateTrendsQuery, handleValidation, getAttendanceTrends);

module.exports = router;