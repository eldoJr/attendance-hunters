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
  param('id').isString().isLength({ min: 1 }).withMessage('Valid session ID is required')
];

const validateClassId = [
  param('classId').isString().isLength({ min: 1 }).withMessage('Valid class ID is required')
];

const validateCreateSession = [
  body('classId').isString().isLength({ min: 1 }).withMessage('Valid class ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid start time is required (HH:MM or HH:MM:SS)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid end time is required (HH:MM or HH:MM:SS)'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('sessionType').optional().isIn(['lecture', 'lab', 'tutorial', 'exam']).withMessage('Session type must be lecture, lab, tutorial, or exam')
];

const validateMarkAttendance = [
  body('studentId').isString().isLength({ min: 1 }).withMessage('Valid student ID is required'),
  body('classId').isString().isLength({ min: 1 }).withMessage('Valid class ID is required'),
  body('sessionId').isString().isLength({ min: 1 }).withMessage('Valid session ID is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status is required'),
  body('method').optional().isIn(['manual', 'qr', 'biometric', 'rfid']),
  body('notes').optional().isString()
];

const validateUpdateAttendance = [
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status is required'),
  body('notes').optional().isString()
];

const validateAttendanceQuery = [
  query('classId').optional().isString().withMessage('Valid class ID is required'),
  query('studentId').optional().isString().withMessage('Valid student ID is required'),
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