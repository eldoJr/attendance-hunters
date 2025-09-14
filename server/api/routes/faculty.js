const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getFaculty, 
  getFacultyById, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty,
  getFacultyClasses
} = require('../controllers/facultyController');

const router = express.Router();

const validateFacultyId = [
  param('id').isUUID().withMessage('Valid faculty ID is required')
];

const validateCreateFaculty = [
  body('employeeId').isLength({ min: 1 }).withMessage('Employee ID is required'),
  body('userId').optional().isUUID().withMessage('Valid user ID is required'),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  body('designation').optional().isIn(['Professor', 'Associate_Professor', 'Assistant_Professor', 'Lecturer', 'Lab_Instructor']),
  body('specialization').optional().isArray(),
  body('qualifications').optional().isArray(),
  body('experienceYears').optional().isInt({ min: 0 }),
  body('joinDate').optional().isISO8601(),
  body('officeRoom').optional().isString(),
  body('researchAreas').optional().isArray(),
  body('publicationsCount').optional().isInt({ min: 0 })
];

// Routes
router.get('/', getFaculty);
router.get('/:id', validateFacultyId, handleValidation, getFacultyById);
router.get('/:id/classes', validateFacultyId, handleValidation, getFacultyClasses);
router.post('/', authenticate, authorize('admin'), validateCreateFaculty, handleValidation, createFaculty);
router.put('/:id', authenticate, authorize('admin', 'staff'), validateFacultyId, handleValidation, updateFaculty);
router.delete('/:id', authenticate, authorize('admin'), validateFacultyId, handleValidation, deleteFaculty);

module.exports = router;