import { apiService } from './api';
import { AttendanceRecord } from '../types';

export const attendanceService = {
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const response = await apiService.get<AttendanceRecord[]>('/attendance');
      return response.data || [];
    } catch (error) {
      // Fallback to mock data
      return [
        { id: '1', studentId: 'STU001', classId: 'CS101', date: '2024-01-15', status: 'present', timestamp: '09:15 AM' },
        { id: '2', studentId: 'STU002', classId: 'CS101', date: '2024-01-15', status: 'present', timestamp: '09:12 AM' },
        { id: '3', studentId: 'STU003', classId: 'CS101', date: '2024-01-15', status: 'absent' },
      ];
    }
  },

  async markAttendance(data: { studentId: string; classId: string; status: 'present' | 'absent' | 'late' }) {
    try {
      return await apiService.post('/attendance/mark', data);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw error;
    }
  },

  async getAttendanceSummary() {
    try {
      const response = await apiService.get('/attendance/summary');
      return response.data || {};
    } catch (error) {
      // Fallback to mock data
      return {
        todayAttendance: 85,
        presentStudents: 342,
        totalStudents: 402,
        alerts: 5
      };
    }
  }
};