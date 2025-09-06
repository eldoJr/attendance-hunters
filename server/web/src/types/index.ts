// Global type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  timestamp?: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  facultyId: string;
  schedule: string;
  room: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}