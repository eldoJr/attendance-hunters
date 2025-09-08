// Re-export interfaces
export type { Student, Course } from './mockStudents';
export type { Department } from './mockDepartments';
export type { CalendarEvent } from './mockCalendar';
export type { ReportData } from './mockReports';
export type { AttendanceRecord, AttendanceSession } from './mockAttendance';
export type { Class, ClassSchedule } from './mockClasses';
export type { Faculty, OfficeHour } from './mockFaculty';
export type { AttendanceAnalytics, DepartmentStats, ClassStats } from './mockAnalytics';
export type { Report, ReportTemplate, ReportFilter } from './mockReportsData';

// Consolidated data exports
export { MOCK_STUDENTS, COURSES, ATTENDANCE_RECORDS } from './mockStudents';
export { MOCK_DEPARTMENTS } from './mockDepartments';
export { MOCK_CALENDAR_EVENTS } from './mockCalendar';
export { MOCK_REPORTS } from './mockReports';
export { ATTENDANCE_RECORDS as ATTENDANCE_DATA, ATTENDANCE_SESSIONS } from './mockAttendance';
export { CLASSES, COURSES as COURSE_DATA } from './mockClasses';
export { FACULTY } from './mockFaculty';
export { ATTENDANCE_ANALYTICS, LEADERBOARD_DATA } from './mockAnalytics';
export { REPORTS, REPORT_TEMPLATES, REPORT_STATISTICS } from './mockReportsData';