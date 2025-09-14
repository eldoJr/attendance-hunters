const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getReports,
  getReportById,
  generateReport,
  downloadReport
} = require('../controllers/reportController');

const router = express.Router();

const validateReportId = [
  param('id').isUUID().withMessage('Valid report ID is required')
];

const validateGenerateReport = [
  body('type').isIn(['attendance_summary', 'student_performance', 'class_analytics', 'department_overview']).withMessage('Valid report type is required'),
  body('classId').optional().isUUID().withMessage('Valid class ID is required'),
  body('period').optional().isString(),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required')
];

const validateReportsQuery = [
  query('type').optional().isString(),
  query('status').optional().isIn(['Generated', 'Processing', 'Failed']),
  query('classId').optional().isUUID().withMessage('Valid class ID is required')
];

// Routes
router.get('/', authenticate, authorize('admin', 'staff'), validateReportsQuery, handleValidation, getReports);
router.get('/:id', authenticate, authorize('admin', 'staff'), validateReportId, handleValidation, getReportById);
router.post('/generate', authenticate, authorize('admin', 'staff'), validateGenerateReport, handleValidation, generateReport);
router.get('/:id/download', authenticate, authorize('admin', 'staff'), validateReportId, handleValidation, downloadReport);

module.exports = router;