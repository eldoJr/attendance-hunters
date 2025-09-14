const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  getStudentClasses,
  getStudentAttendance
} = require('../controllers/studentController');

const router = express.Router();

const validateStudentId = [
  param('id').isUUID().withMessage('Valid student ID is required')
];

const validateCreateStudent = [
  body('rollNumber').isLength({ min: 1 }).withMessage('Roll number is required'),
  body('enrollmentNumber').isLength({ min: 1 }).withMessage('Enrollment number is required'),
  body('userId').optional().isUUID().withMessage('Valid user ID is required'),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  body('year').optional().isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),
  body('section').optional().isString(),
  body('enrollmentDate').optional().isISO8601(),
  body('phone').optional().isMobilePhone(),
  body('gpa').optional().isDecimal({ decimal_digits: '0,2' })
];

const validateAttendanceQuery = [
  query('classId').optional().isUUID().withMessage('Valid class ID is required'),
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required')
];

// Routes
router.get('/', authenticate, getStudents);
router.get('/:id', authenticate, validateStudentId, handleValidation, getStudentById);
router.get('/:id/classes', authenticate, validateStudentId, handleValidation, getStudentClasses);
router.get('/:id/attendance', authenticate, validateStudentId, validateAttendanceQuery, handleValidation, getStudentAttendance);
router.post('/', authenticate, authorize('admin'), validateCreateStudent, handleValidation, createStudent);
router.put('/:id', authenticate, authorize('admin', 'staff'), validateStudentId, handleValidation, updateStudent);
router.delete('/:id', authenticate, authorize('admin'), validateStudentId, handleValidation, deleteStudent);

module.exports = router;