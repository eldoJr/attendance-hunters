export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  facultyId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  method: 'manual' | 'qr' | 'biometric' | 'rfid';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  facultyId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
  createdAt: string;
}

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_001',
    studentId: '1',
    classId: 'cls_001',
    facultyId: 'fac_001',
    date: '2024-01-15',
    status: 'present',
    checkInTime: '14:15:00',
    checkOutTime: '16:00:00',
    method: 'qr',
    location: 'Lab-101',
    createdAt: '2024-01-15T14:15:00Z',
    updatedAt: '2024-01-15T14:15:00Z'
  },
  {
    id: 'att_002',
    studentId: '2',
    classId: 'cls_001',
    facultyId: 'fac_001',
    date: '2024-01-15',
    status: 'late',
    checkInTime: '14:25:00',
    checkOutTime: '16:00:00',
    method: 'manual',
    location: 'Lab-101',
    notes: 'Traffic delay',
    createdAt: '2024-01-15T14:25:00Z',
    updatedAt: '2024-01-15T14:25:00Z'
  },
  {
    id: 'att_003',
    studentId: '3',
    classId: 'cls_002',
    facultyId: 'fac_002',
    date: '2024-01-15',
    status: 'present',
    checkInTime: '10:05:00',
    checkOutTime: '11:30:00',
    method: 'biometric',
    location: 'B-205',
    createdAt: '2024-01-15T10:05:00Z',
    updatedAt: '2024-01-15T10:05:00Z'
  },
  {
    id: 'att_004',
    studentId: '4',
    classId: 'cls_001',
    facultyId: 'fac_001',
    date: '2024-01-15',
    status: 'present',
    checkInTime: '14:10:00',
    checkOutTime: '16:00:00',
    method: 'qr',
    location: 'Lab-101',
    createdAt: '2024-01-15T14:10:00Z',
    updatedAt: '2024-01-15T14:10:00Z'
  },
  {
    id: 'att_005',
    studentId: '5',
    classId: 'cls_002',
    facultyId: 'fac_002',
    date: '2024-01-15',
    status: 'absent',
    method: 'manual',
    notes: 'Medical leave',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

export const ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'ses_001',
    classId: 'cls_001',
    facultyId: 'fac_001',
    date: '2024-01-15',
    startTime: '14:00:00',
    endTime: '16:00:00',
    status: 'completed',
    totalStudents: 30,
    presentCount: 25,
    absentCount: 3,
    lateCount: 2,
    attendancePercentage: 83.33,
    createdAt: '2024-01-15T14:00:00Z'
  },
  {
    id: 'ses_002',
    classId: 'cls_002',
    facultyId: 'fac_002',
    date: '2024-01-15',
    startTime: '10:00:00',
    endTime: '11:30:00',
    status: 'completed',
    totalStudents: 25,
    presentCount: 22,
    absentCount: 2,
    lateCount: 1,
    attendancePercentage: 88.00,
    createdAt: '2024-01-15T10:00:00Z'
  }
];