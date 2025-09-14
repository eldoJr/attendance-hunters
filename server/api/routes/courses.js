const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} = require('../controllers/courseController');

const router = express.Router();

const validateCourseId = [
  param('id').isUUID().withMessage('Valid course ID is required')
];

const validateCreateCourse = [
  body('name').isLength({ min: 2 }).withMessage('Course name is required'),
  body('code').isLength({ min: 2 }).withMessage('Course code is required'),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('description').optional().isString(),
  body('prerequisites').optional().isArray(),
  body('level').optional().isIn(['undergraduate', 'graduate']),
  body('category').optional().isIn(['core', 'elective', 'lab'])
];

// Routes
router.get('/', getCourses);
router.get('/:id', validateCourseId, handleValidation, getCourseById);
router.post('/', authenticate, authorize('admin'), validateCreateCourse, handleValidation, createCourse);
router.put('/:id', authenticate, authorize('admin'), validateCourseId, handleValidation, updateCourse);
router.delete('/:id', authenticate, authorize('admin'), validateCourseId, handleValidation, deleteCourse);

module.exports = router;