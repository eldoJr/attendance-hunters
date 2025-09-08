export interface AttendanceAnalytics {
  id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'semester';
  startDate: string;
  endDate: string;
  totalClasses: number;
  totalStudents: number;
  overallAttendanceRate: number;
  departmentWiseStats: DepartmentStats[];
  classWiseStats: ClassStats[];
  studentPerformance: StudentPerformanceStats[];
  trends: AttendanceTrend[];
  insights: AnalyticsInsight[];
  generatedAt: string;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalStudents: number;
  averageAttendance: number;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

export interface ClassStats {
  classId: string;
  className: string;
  facultyName: string;
  totalSessions: number;
  averageAttendance: number;
  enrolledStudents: number;
  regularAttendees: number;
  irregularAttendees: number;
  riskStudents: number;
}

export interface StudentPerformanceStats {
  studentId: string;
  studentName: string;
  overallAttendance: number;
  classesAttended: number;
  totalClasses: number;
  streak: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'improving' | 'declining' | 'stable';
}

export interface AttendanceTrend {
  date: string;
  attendanceRate: number;
  presentCount: number;
  totalCount: number;
}

export interface AnalyticsInsight {
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export const ATTENDANCE_ANALYTICS: AttendanceAnalytics = {
  id: 'analytics_001',
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  totalClasses: 120,
  totalStudents: 58,
  overallAttendanceRate: 85.2,
  departmentWiseStats: [
    {
      departmentId: 'dept_001',
      departmentName: 'Electronics Engineering',
      totalStudents: 25,
      averageAttendance: 87.5,
      totalClasses: 45,
      presentCount: 985,
      absentCount: 140,
      lateCount: 25
    },
    {
      departmentId: 'dept_002',
      departmentName: 'Computer Science & Engineering',
      totalStudents: 20,
      averageAttendance: 83.8,
      totalClasses: 40,
      presentCount: 670,
      absentCount: 110,
      lateCount: 20
    },
    {
      departmentId: 'dept_003',
      departmentName: 'Mathematics',
      totalStudents: 8,
      averageAttendance: 89.2,
      totalClasses: 20,
      presentCount: 143,
      absentCount: 15,
      lateCount: 2
    },
    {
      departmentId: 'dept_004',
      departmentName: 'Information Technology',
      totalStudents: 5,
      averageAttendance: 81.0,
      totalClasses: 15,
      presentCount: 61,
      absentCount: 12,
      lateCount: 2
    }
  ],
  classWiseStats: [
    {
      classId: 'cls_001',
      className: 'Digital Electronics Laboratory - Section A',
      facultyName: 'Dr. Sarah Smith',
      totalSessions: 16,
      averageAttendance: 87.5,
      enrolledStudents: 12,
      regularAttendees: 9,
      irregularAttendees: 2,
      riskStudents: 1
    },
    {
      classId: 'cls_002',
      className: 'Discrete Mathematics - Section A',
      facultyName: 'Prof. Michael Johnson',
      totalSessions: 16,
      averageAttendance: 83.8,
      enrolledStudents: 9,
      regularAttendees: 7,
      irregularAttendees: 1,
      riskStudents: 1
    },
    {
      classId: 'cls_003',
      className: 'Data Structures and Algorithms - Section A',
      facultyName: 'Dr. Emily Wilson',
      totalSessions: 16,
      averageAttendance: 89.1,
      enrolledStudents: 8,
      regularAttendees: 7,
      irregularAttendees: 1,
      riskStudents: 0
    }
  ],
  studentPerformance: [
    {
      studentId: '25',
      studentName: 'Zoe Mitchell',
      overallAttendance: 97.0,
      classesAttended: 31,
      totalClasses: 32,
      streak: 15,
      riskLevel: 'low',
      trend: 'stable'
    },
    {
      studentId: '4',
      studentName: 'David Wilson',
      overallAttendance: 95.0,
      classesAttended: 30,
      totalClasses: 32,
      streak: 12,
      riskLevel: 'low',
      trend: 'improving'
    },
    {
      studentId: '24',
      studentName: 'Yuki Tanaka',
      overallAttendance: 94.0,
      classesAttended: 30,
      totalClasses: 32,
      streak: 10,
      riskLevel: 'low',
      trend: 'stable'
    },
    {
      studentId: '8',
      studentName: 'Henry Clark',
      overallAttendance: 59.0,
      classesAttended: 19,
      totalClasses: 32,
      streak: 0,
      riskLevel: 'high',
      trend: 'declining'
    }
  ],
  trends: [
    { date: '2024-01-01', attendanceRate: 82.5, presentCount: 48, totalCount: 58 },
    { date: '2024-01-02', attendanceRate: 85.2, presentCount: 49, totalCount: 58 },
    { date: '2024-01-03', attendanceRate: 87.9, presentCount: 51, totalCount: 58 },
    { date: '2024-01-04', attendanceRate: 84.5, presentCount: 49, totalCount: 58 },
    { date: '2024-01-05', attendanceRate: 86.2, presentCount: 50, totalCount: 58 },
    { date: '2024-01-08', attendanceRate: 88.8, presentCount: 51, totalCount: 58 },
    { date: '2024-01-09', attendanceRate: 83.6, presentCount: 48, totalCount: 58 },
    { date: '2024-01-10', attendanceRate: 89.7, presentCount: 52, totalCount: 58 },
    { date: '2024-01-11', attendanceRate: 86.2, presentCount: 50, totalCount: 58 },
    { date: '2024-01-12', attendanceRate: 84.5, presentCount: 49, totalCount: 58 },
    { date: '2024-01-15', attendanceRate: 87.9, presentCount: 51, totalCount: 58 }
  ],
  insights: [
    {
      type: 'warning',
      title: 'Declining Attendance in Electronics Lab',
      description: 'Digital Electronics Laboratory has seen a 5% drop in attendance over the past week',
      impact: 'medium',
      actionRequired: true
    },
    {
      type: 'critical',
      title: 'High-Risk Students Identified',
      description: '3 students have attendance below 60% and require immediate intervention',
      impact: 'high',
      actionRequired: true
    },
    {
      type: 'success',
      title: 'Mathematics Department Excellence',
      description: 'Mathematics department maintains highest attendance rate at 89.2%',
      impact: 'low',
      actionRequired: false
    },
    {
      type: 'info',
      title: 'Peak Attendance Days',
      description: 'Tuesdays and Thursdays show consistently higher attendance rates',
      impact: 'low',
      actionRequired: false
    }
  ],
  generatedAt: '2024-01-15T12:00:00Z'
};

export const LEADERBOARD_DATA = {
  topPerformers: [
    {
      rank: 1,
      studentId: '25',
      name: 'Zoe Mitchell',
      attendanceRate: 97.0,
      streak: 15,
      points: 2425,
      badges: ['Perfect Week', 'Consistency King', 'Early Bird']
    },
    {
      rank: 2,
      studentId: '4',
      name: 'David Wilson',
      attendanceRate: 95.0,
      streak: 12,
      points: 2375,
      badges: ['Perfect Week', 'Early Bird']
    },
    {
      rank: 3,
      studentId: '24',
      name: 'Yuki Tanaka',
      attendanceRate: 94.0,
      streak: 10,
      points: 2350,
      badges: ['Perfect Week']
    }
  ],
  achievements: [
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: '100% attendance for a week',
      icon: '🏆',
      earnedBy: 15,
      totalStudents: 58
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Never late for 30 days',
      icon: '🌅',
      earnedBy: 8,
      totalStudents: 58
    },
    {
      id: 'consistency_king',
      name: 'Consistency King',
      description: '90%+ attendance for 3 months',
      icon: '👑',
      earnedBy: 3,
      totalStudents: 58
    }
  ],
  departmentRankings: [
    { departmentId: 'dept_003', name: 'Mathematics', averageAttendance: 89.2, rank: 1 },
    { departmentId: 'dept_001', name: 'Electronics Engineering', averageAttendance: 87.5, rank: 2 },
    { departmentId: 'dept_002', name: 'Computer Science & Engineering', averageAttendance: 83.8, rank: 3 },
    { departmentId: 'dept_004', name: 'Information Technology', averageAttendance: 81.0, rank: 4 }
  ]
};