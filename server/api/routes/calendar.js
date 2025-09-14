const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
} = require('../controllers/calendarController');

const router = express.Router();

const validateEventId = [
  param('id').isUUID().withMessage('Valid event ID is required')
];

const validateCreateEvent = [
  body('title').isLength({ min: 1 }).withMessage('Event title is required'),
  body('description').optional().isString(),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM)'),
  body('location').optional().isString(),
  body('type').isIn(['Exam', 'Class', 'Holiday', 'Event']).withMessage('Valid event type is required'),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  body('duration').optional().isString()
];

const validateEventsQuery = [
  query('type').optional().isIn(['Exam', 'Class', 'Holiday', 'Event']),
  query('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required')
];

// Routes
router.get('/', authenticate, validateEventsQuery, handleValidation, getEvents);
router.get('/upcoming', authenticate, getUpcomingEvents);
router.get('/:id', authenticate, validateEventId, handleValidation, getEventById);
router.post('/', authenticate, authorize('admin'), validateCreateEvent, handleValidation, createEvent);
router.put('/:id', authenticate, authorize('admin'), validateEventId, handleValidation, updateEvent);
router.delete('/:id', authenticate, authorize('admin'), validateEventId, handleValidation, deleteEvent);

module.exports = router;