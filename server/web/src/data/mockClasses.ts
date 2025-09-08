export interface Class {
  id: string;
  courseId: string;
  facultyId: string;
  departmentId: string;
  name: string;
  code: string;
  section: string;
  semester: string;
  academicYear: string;
  schedule: ClassSchedule[];
  enrolledStudents: string[];
  maxCapacity: number;
  currentEnrollment: number;
  room: string;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate: string;
  credits: number;
  description?: string;
  prerequisites?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClassSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  room: string;
}

export interface Course {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  credits: number;
  description: string;
  prerequisites?: string[];
  level: 'undergraduate' | 'graduate';
  category: 'core' | 'elective' | 'lab';
  status: 'active' | 'inactive';
  createdAt: string;
}

export const COURSES: Course[] = [
  {
    id: 'crs_001',
    departmentId: 'dept_001',
    name: 'Digital Electronics Laboratory',
    code: '303105221',
    credits: 2,
    description: 'Hands-on laboratory course covering digital circuits and systems',
    level: 'undergraduate',
    category: 'lab',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'crs_002',
    departmentId: 'dept_002',
    name: 'Discrete Mathematics',
    code: '303191202',
    credits: 3,
    description: 'Mathematical foundations for computer science',
    level: 'undergraduate',
    category: 'core',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'crs_003',
    departmentId: 'dept_002',
    name: 'Data Structures and Algorithms',
    code: '303201301',
    credits: 4,
    description: 'Fundamental data structures and algorithmic techniques',
    prerequisites: ['303191202'],
    level: 'undergraduate',
    category: 'core',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'crs_004',
    departmentId: 'dept_001',
    name: 'Microprocessor Systems',
    code: '303105222',
    credits: 3,
    description: 'Architecture and programming of microprocessor systems',
    level: 'undergraduate',
    category: 'core',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'crs_005',
    departmentId: 'dept_003',
    name: 'Linear Algebra',
    code: '303191203',
    credits: 3,
    description: 'Vector spaces, matrices, and linear transformations',
    level: 'undergraduate',
    category: 'core',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const CLASSES: Class[] = [
  {
    id: 'cls_001',
    courseId: 'crs_001',
    facultyId: 'fac_001',
    departmentId: 'dept_001',
    name: 'Digital Electronics Laboratory - Section A',
    code: '303105221-A',
    section: 'A',
    semester: 'Spring',
    academicYear: '2024',
    schedule: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '16:00', room: 'Lab-101' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '16:00', room: 'Lab-101' }
    ],
    enrolledStudents: ['1', '2', '4', '6', '10', '12', '14', '16', '18', '20', '22', '26'],
    maxCapacity: 35,
    currentEnrollment: 12,
    room: 'Lab-101',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-05-15',
    credits: 2,
    description: 'Practical implementation of digital circuits',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'cls_002',
    courseId: 'crs_002',
    facultyId: 'fac_002',
    departmentId: 'dept_002',
    name: 'Discrete Mathematics - Section A',
    code: '303191202-A',
    section: 'A',
    semester: 'Spring',
    academicYear: '2024',
    schedule: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '11:30', room: 'B-205' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '11:30', room: 'B-205' }
    ],
    enrolledStudents: ['3', '5', '7', '9', '13', '17', '21', '25', '27'],
    maxCapacity: 30,
    currentEnrollment: 9,
    room: 'B-205',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-05-15',
    credits: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'cls_003',
    courseId: 'crs_003',
    facultyId: 'fac_003',
    departmentId: 'dept_002',
    name: 'Data Structures and Algorithms - Section A',
    code: '303201301-A',
    section: 'A',
    semester: 'Spring',
    academicYear: '2024',
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'A-301' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '10:30', room: 'A-301' }
    ],
    enrolledStudents: ['29', '34', '39', '44', '49', '51', '56', '58'],
    maxCapacity: 32,
    currentEnrollment: 8,
    room: 'A-301',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-05-15',
    credits: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'cls_004',
    courseId: 'crs_004',
    facultyId: 'fac_004',
    departmentId: 'dept_001',
    name: 'Microprocessor Systems - Section A',
    code: '303105222-A',
    section: 'A',
    semester: 'Spring',
    academicYear: '2024',
    schedule: [
      { dayOfWeek: 3, startTime: '11:00', endTime: '12:30', room: 'Lab-102' },
      { dayOfWeek: 5, startTime: '11:00', endTime: '12:30', room: 'Lab-102' }
    ],
    enrolledStudents: ['30', '35', '40', '45'],
    maxCapacity: 28,
    currentEnrollment: 4,
    room: 'Lab-102',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-05-15',
    credits: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'cls_005',
    courseId: 'crs_005',
    facultyId: 'fac_005',
    departmentId: 'dept_003',
    name: 'Linear Algebra - Section A',
    code: '303191203-A',
    section: 'A',
    semester: 'Spring',
    academicYear: '2024',
    schedule: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '15:30', room: 'B-301' },
      { dayOfWeek: 4, startTime: '14:00', endTime: '15:30', room: 'B-301' }
    ],
    enrolledStudents: ['31', '36', '41', '46'],
    maxCapacity: 25,
    currentEnrollment: 4,
    room: 'B-301',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-05-15',
    credits: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];