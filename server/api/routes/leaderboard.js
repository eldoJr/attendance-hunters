const express = require('express');
const { query } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validation');
const { 
  getStudentLeaderboard,
  getDepartmentRankings,
  getAchievements
} = require('../controllers/leaderboardController');

const router = express.Router();

const validateLeaderboardQuery = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
  query('classId').optional().isUUID().withMessage('Valid class ID is required'),
  query('period').optional().isInt({ min: 1, max: 365 }).withMessage('Period must be between 1 and 365 days')
];

const validateAchievementsQuery = [
  query('studentId').isUUID().withMessage('Valid student ID is required')
];

// Routes
router.get('/students', authenticate, validateLeaderboardQuery, handleValidation, getStudentLeaderboard);
router.get('/departments', authenticate, getDepartmentRankings);
router.get('/achievements', authenticate, validateAchievementsQuery, handleValidation, getAchievements);

module.exports = router;