const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  createSession,
  getSession,
  markAttendance,
  updateAttendance,
  getAttendanceRecords,
  getClassAttendance,
  completeSession
} = require('../controllers/attendanceController');

const router = express.Router();

const validateSessionId = [
  param('id').isUUID().withMessage('Valid session ID is required')
];

const validateClassId = [
  param('classId').isUUID().withMessage('Valid class ID is required')
];

const validateCreateSession = [
  body('classId').isUUID().withMessage('Valid class ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required (HH:MM)')
];

const validateMarkAttendance = [
  body('studentId').isUUID().withMessage('Valid student ID is required'),
  body('classId').isUUID().withMessage('Valid class ID is required'),
  body('sessionId').isUUID().withMessage('Valid session ID is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status is required'),
  body('method').optional().isIn(['manual', 'qr', 'biometric', 'rfid']),
  body('notes').optional().isString()
];

const validateUpdateAttendance = [
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status is required'),
  body('notes').optional().isString()
];

const validateAttendanceQuery = [
  query('classId').optional().isUUID().withMessage('Valid class ID is required'),
  query('studentId').optional().isUUID().withMessage('Valid student ID is required'),
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  query('status').optional().isIn(['present', 'absent', 'late', 'excused'])
];

// Session routes
router.post('/sessions', authenticate, authorize('staff', 'admin'), validateCreateSession, handleValidation, createSession);
router.get('/sessions/:id', authenticate, validateSessionId, handleValidation, getSession);
router.post('/sessions/:id/complete', authenticate, authorize('staff', 'admin'), validateSessionId, handleValidation, completeSession);

// Attendance marking routes
router.post('/records', authenticate, authorize('staff', 'admin'), validateMarkAttendance, handleValidation, markAttendance);
router.put('/records/:id', authenticate, authorize('staff', 'admin'), validateUpdateAttendance, handleValidation, updateAttendance);
router.get('/records', authenticate, validateAttendanceQuery, handleValidation, getAttendanceRecords);

// Class attendance routes
router.get('/class/:classId', authenticate, validateClassId, handleValidation, getClassAttendance);

module.exports = router;