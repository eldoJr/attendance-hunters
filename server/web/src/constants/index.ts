// Application constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  DASHBOARD: '/dashboard',
  ATTENDANCE: '/attendance',
  CLASSES: '/classes',
  STUDENTS: '/students',
  REPORTS: '/reports',
  LEADERBOARD: '/leaderboard',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const;

export const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
} as const;