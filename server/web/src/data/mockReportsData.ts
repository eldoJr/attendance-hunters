export interface Report {
  id: string;
  title: string;
  type: 'attendance' | 'performance' | 'analytics' | 'custom';
  category: 'student' | 'class' | 'department' | 'faculty' | 'system';
  description: string;
  generatedBy: string;
  generatedAt: string;
  period: {
    startDate: string;
    endDate: string;
  };
  filters: ReportFilter[];
  data: any;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  size?: string;
  recipients?: string[];
  scheduledFor?: string;
  isScheduled: boolean;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'attendance' | 'performance' | 'analytics' | 'custom';
  category: 'student' | 'class' | 'department' | 'faculty' | 'system';
  fields: ReportField[];
  defaultFilters: ReportFilter[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface ReportField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'percentage';
  required: boolean;
  sortable: boolean;
}

export const REPORTS: Report[] = [
  {
    id: 'rpt_001',
    title: 'Monthly Attendance Summary - January 2024',
    type: 'attendance',
    category: 'system',
    description: 'Comprehensive attendance report for all departments and classes',
    generatedBy: 'admin',
    generatedAt: '2024-01-15T10:30:00Z',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    filters: [
      { field: 'status', operator: 'equals', value: 'active' }
    ],
    data: {
      totalStudents: 58,
      totalClasses: 120,
      overallAttendance: 85.2,
      departmentStats: [
        { department: 'Electronics Engineering', attendance: 87.5, students: 25 },
        { department: 'Computer Science & Engineering', attendance: 83.8, students: 20 },
        { department: 'Mathematics', attendance: 89.2, students: 8 },
        { department: 'Information Technology', attendance: 81.0, students: 5 }
      ]
    },
    format: 'pdf',
    status: 'completed',
    downloadUrl: '/reports/monthly-attendance-jan-2024.pdf',
    size: '2.3 MB',
    isScheduled: false
  },
  {
    id: 'rpt_002',
    title: 'Student Performance Analysis - Q1 2024',
    type: 'performance',
    category: 'student',
    description: 'Individual student performance metrics and risk assessment',
    generatedBy: 'faculty_001',
    generatedAt: '2024-01-14T15:45:00Z',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-03-31'
    },
    filters: [
      { field: 'attendance', operator: 'less_than', value: 75 }
    ],
    data: {
      riskStudents: 5,
      averageAttendance: 72.4,
      recommendations: [
        'Schedule counseling sessions for low-attendance students',
        'Implement early warning system',
        'Increase engagement activities'
      ]
    },
    format: 'excel',
    status: 'completed',
    downloadUrl: '/reports/student-performance-q1-2024.xlsx',
    size: '1.8 MB',
    recipients: ['dean@university.edu', 'hod.cse@university.edu'],
    isScheduled: false
  },
  {
    id: 'rpt_003',
    title: 'Class-wise Attendance Trends',
    type: 'analytics',
    category: 'class',
    description: 'Detailed analysis of attendance patterns across different classes',
    generatedBy: 'admin',
    generatedAt: '2024-01-13T09:20:00Z',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-01-15'
    },
    filters: [
      { field: 'classType', operator: 'equals', value: 'laboratory' }
    ],
    data: {
      totalClasses: 5,
      averageAttendance: 86.3,
      trends: [
        { class: 'Digital Electronics Lab', trend: 'declining', change: -3.2 },
        { class: 'Microprocessor Lab', trend: 'stable', change: 0.5 },
        { class: 'Communication Systems Lab', trend: 'improving', change: 2.1 }
      ]
    },
    format: 'pdf',
    status: 'completed',
    downloadUrl: '/reports/class-attendance-trends.pdf',
    size: '1.5 MB',
    isScheduled: true,
    scheduledFor: 'weekly'
  },
  {
    id: 'rpt_004',
    title: 'Faculty Teaching Load Report',
    type: 'custom',
    category: 'faculty',
    description: 'Analysis of faculty workload and class assignments',
    generatedBy: 'hr_admin',
    generatedAt: '2024-01-12T14:10:00Z',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-05-31'
    },
    filters: [
      { field: 'department', operator: 'equals', value: 'Computer Science & Engineering' }
    ],
    data: {
      totalFaculty: 8,
      averageClassLoad: 2.3,
      workloadDistribution: [
        { faculty: 'Dr. Emily Wilson', classes: 3, students: 45, load: 'high' },
        { faculty: 'Prof. Michael Johnson', classes: 2, students: 30, load: 'medium' },
        { faculty: 'Prof. David Garcia', classes: 1, students: 15, load: 'low' }
      ]
    },
    format: 'excel',
    status: 'generating',
    isScheduled: false
  },
  {
    id: 'rpt_005',
    title: 'Department Comparison Report',
    type: 'analytics',
    category: 'department',
    description: 'Comparative analysis of attendance across departments',
    generatedBy: 'admin',
    generatedAt: '2024-01-11T11:30:00Z',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    filters: [],
    data: {
      departments: 4,
      bestPerforming: 'Mathematics',
      needsImprovement: 'Information Technology',
      overallTrend: 'stable',
      recommendations: [
        'Implement best practices from Mathematics department',
        'Provide additional support to IT department',
        'Regular monitoring and feedback sessions'
      ]
    },
    format: 'pdf',
    status: 'completed',
    downloadUrl: '/reports/department-comparison.pdf',
    size: '2.1 MB',
    recipients: ['provost@university.edu'],
    isScheduled: true,
    scheduledFor: 'monthly'
  }
];

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl_001',
    name: 'Monthly Attendance Summary',
    description: 'Standard monthly attendance report template',
    type: 'attendance',
    category: 'system',
    fields: [
      { name: 'studentName', label: 'Student Name', type: 'string', required: true, sortable: true },
      { name: 'studentId', label: 'Student ID', type: 'string', required: true, sortable: true },
      { name: 'department', label: 'Department', type: 'string', required: true, sortable: true },
      { name: 'attendanceRate', label: 'Attendance %', type: 'percentage', required: true, sortable: true },
      { name: 'classesAttended', label: 'Classes Attended', type: 'number', required: true, sortable: true },
      { name: 'totalClasses', label: 'Total Classes', type: 'number', required: true, sortable: true }
    ],
    defaultFilters: [
      { field: 'status', operator: 'equals', value: 'active' }
    ],
    isPublic: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 15
  },
  {
    id: 'tpl_002',
    name: 'Low Attendance Alert',
    description: 'Report template for students with attendance below threshold',
    type: 'performance',
    category: 'student',
    fields: [
      { name: 'studentName', label: 'Student Name', type: 'string', required: true, sortable: true },
      { name: 'studentId', label: 'Student ID', type: 'string', required: true, sortable: true },
      { name: 'attendanceRate', label: 'Attendance %', type: 'percentage', required: true, sortable: true },
      { name: 'riskLevel', label: 'Risk Level', type: 'string', required: true, sortable: true },
      { name: 'lastAttended', label: 'Last Attended', type: 'date', required: false, sortable: true }
    ],
    defaultFilters: [
      { field: 'attendanceRate', operator: 'less_than', value: 75 }
    ],
    isPublic: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 8
  },
  {
    id: 'tpl_003',
    name: 'Class Performance Analysis',
    description: 'Detailed analysis template for individual classes',
    type: 'analytics',
    category: 'class',
    fields: [
      { name: 'className', label: 'Class Name', type: 'string', required: true, sortable: true },
      { name: 'facultyName', label: 'Faculty', type: 'string', required: true, sortable: true },
      { name: 'enrolledStudents', label: 'Enrolled Students', type: 'number', required: true, sortable: true },
      { name: 'averageAttendance', label: 'Average Attendance %', type: 'percentage', required: true, sortable: true },
      { name: 'totalSessions', label: 'Total Sessions', type: 'number', required: true, sortable: true }
    ],
    defaultFilters: [],
    isPublic: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 12
  }
];

export const REPORT_STATISTICS = {
  totalReports: 156,
  reportsThisMonth: 23,
  scheduledReports: 8,
  averageGenerationTime: '2.3 minutes',
  mostUsedTemplate: 'Monthly Attendance Summary',
  reportsByType: {
    attendance: 45,
    performance: 32,
    analytics: 28,
    custom: 51
  },
  reportsByFormat: {
    pdf: 89,
    excel: 45,
    csv: 15,
    json: 7
  }
};