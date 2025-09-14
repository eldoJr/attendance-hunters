const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getClasses, 
  getClassById, 
  createClass, 
  updateClass, 
  deleteClass,
  enrollStudent,
  removeStudent
} = require('../controllers/classController');

const router = express.Router();

const validateClassId = [
  param('id').isUUID().withMessage('Valid class ID is required')
];

const validateStudentId = [
  param('studentId').isUUID().withMessage('Valid student ID is required')
];

const validateCreateClass = [
  body('name').isLength({ min: 2 }).withMessage('Class name is required'),
  body('courseId').optional().isUUID().withMessage('Valid course ID is required'),
  body('facultyId').optional().isUUID().withMessage('Valid faculty ID is required'),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  body('code').optional().isString(),
  body('section').optional().isString(),
  body('semester').optional().isString(),
  body('academicYear').optional().isString(),
  body('maxCapacity').optional().isInt({ min: 1 }),
  body('room').optional().isString(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('credits').optional().isInt({ min: 1 }),
  body('schedules').optional().isArray()
];

const validateEnrollStudent = [
  body('studentId').isUUID().withMessage('Valid student ID is required')
];

// Routes
router.get('/', authenticate, getClasses);
router.get('/:id', authenticate, validateClassId, handleValidation, getClassById);
router.post('/', authenticate, authorize('admin', 'staff'), validateCreateClass, handleValidation, createClass);
router.put('/:id', authenticate, authorize('admin', 'staff'), validateClassId, handleValidation, updateClass);
router.delete('/:id', authenticate, authorize('admin'), validateClassId, handleValidation, deleteClass);
router.post('/:id/enroll', authenticate, authorize('admin', 'staff'), validateClassId, validateEnrollStudent, handleValidation, enrollStudent);
router.delete('/:id/students/:studentId', authenticate, authorize('admin', 'staff'), validateClassId, validateStudentId, handleValidation, removeStudent);

module.exports = router;