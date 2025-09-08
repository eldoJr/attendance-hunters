export interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Lab Instructor';
  specialization: string[];
  qualifications: string[];
  experience: number; // years
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  officeRoom?: string;
  officeHours?: OfficeHour[];
  assignedClasses: string[];
  researchAreas?: string[];
  publications?: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const FACULTY: Faculty[] = [
  {
    id: 'fac_001',
    employeeId: 'EMP001',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@university.edu',
    phone: '+1 (555) 100-2001',
    departmentId: 'dept_001',
    designation: 'Professor',
    specialization: ['Digital Electronics', 'VLSI Design', 'Embedded Systems'],
    qualifications: ['Ph.D. in Electronics Engineering', 'M.Tech in VLSI Design'],
    experience: 15,
    joinDate: '2009-08-15',
    status: 'active',
    officeRoom: 'EE-201',
    officeHours: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '12:00' }
    ],
    assignedClasses: ['cls_001'],
    researchAreas: ['Digital Signal Processing', 'IoT Systems'],
    publications: 45,
    createdAt: '2009-08-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_002',
    employeeId: 'EMP002',
    name: 'Prof. Michael Johnson',
    email: 'michael.johnson@university.edu',
    phone: '+1 (555) 100-2002',
    departmentId: 'dept_002',
    designation: 'Associate Professor',
    specialization: ['Discrete Mathematics', 'Algorithm Analysis', 'Computational Theory'],
    qualifications: ['Ph.D. in Computer Science', 'M.S. in Mathematics'],
    experience: 12,
    joinDate: '2012-01-10',
    status: 'active',
    officeRoom: 'CS-301',
    officeHours: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '14:00', endTime: '16:00' }
    ],
    assignedClasses: ['cls_002'],
    researchAreas: ['Graph Theory', 'Combinatorial Optimization'],
    publications: 32,
    createdAt: '2012-01-10T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_003',
    employeeId: 'EMP003',
    name: 'Dr. Emily Wilson',
    email: 'emily.wilson@university.edu',
    phone: '+1 (555) 100-2003',
    departmentId: 'dept_002',
    designation: 'Assistant Professor',
    specialization: ['Data Structures', 'Algorithms', 'Software Engineering'],
    qualifications: ['Ph.D. in Computer Science', 'M.Tech in Software Engineering'],
    experience: 8,
    joinDate: '2016-07-20',
    status: 'active',
    officeRoom: 'CS-205',
    officeHours: [
      { dayOfWeek: 1, startTime: '11:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '11:00', endTime: '13:00' }
    ],
    assignedClasses: ['cls_003'],
    researchAreas: ['Machine Learning', 'Data Mining'],
    publications: 18,
    createdAt: '2016-07-20T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_004',
    employeeId: 'EMP004',
    name: 'Prof. Robert Davis',
    email: 'robert.davis@university.edu',
    phone: '+1 (555) 100-2004',
    departmentId: 'dept_001',
    designation: 'Professor',
    specialization: ['Microprocessors', 'Computer Architecture', 'Embedded Systems'],
    qualifications: ['Ph.D. in Computer Engineering', 'M.S. in Electronics'],
    experience: 20,
    joinDate: '2004-03-01',
    status: 'active',
    officeRoom: 'EE-105',
    officeHours: [
      { dayOfWeek: 3, startTime: '09:00', endTime: '11:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '11:00' }
    ],
    assignedClasses: ['cls_004'],
    researchAreas: ['Real-time Systems', 'Hardware-Software Co-design'],
    publications: 67,
    createdAt: '2004-03-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_005',
    employeeId: 'EMP005',
    name: 'Dr. Lisa Brown',
    email: 'lisa.brown@university.edu',
    phone: '+1 (555) 100-2005',
    departmentId: 'dept_003',
    designation: 'Associate Professor',
    specialization: ['Linear Algebra', 'Numerical Analysis', 'Applied Mathematics'],
    qualifications: ['Ph.D. in Mathematics', 'M.S. in Applied Mathematics'],
    experience: 14,
    joinDate: '2010-09-15',
    status: 'active',
    officeRoom: 'MATH-201',
    officeHours: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '12:00' }
    ],
    assignedClasses: ['cls_005'],
    researchAreas: ['Optimization Theory', 'Statistical Analysis'],
    publications: 28,
    createdAt: '2010-09-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_006',
    employeeId: 'EMP006',
    name: 'Prof. David Garcia',
    email: 'david.garcia@university.edu',
    phone: '+1 (555) 100-2006',
    departmentId: 'dept_002',
    designation: 'Professor',
    specialization: ['Database Systems', 'Information Systems', 'Big Data'],
    qualifications: ['Ph.D. in Information Systems', 'M.Tech in Computer Science'],
    experience: 18,
    joinDate: '2006-01-20',
    status: 'active',
    officeRoom: 'CS-401',
    assignedClasses: [],
    researchAreas: ['NoSQL Databases', 'Cloud Computing'],
    publications: 52,
    createdAt: '2006-01-20T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_007',
    employeeId: 'EMP007',
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.lee@university.edu',
    phone: '+1 (555) 100-2007',
    departmentId: 'dept_001',
    designation: 'Assistant Professor',
    specialization: ['Communication Systems', 'Signal Processing', 'Wireless Networks'],
    qualifications: ['Ph.D. in Electronics & Communication', 'M.Tech in Communication Systems'],
    experience: 6,
    joinDate: '2018-08-01',
    status: 'active',
    officeRoom: 'EE-302',
    assignedClasses: [],
    researchAreas: ['5G Networks', 'Antenna Design'],
    publications: 15,
    createdAt: '2018-08-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fac_008',
    employeeId: 'EMP008',
    name: 'Prof. James Martinez',
    email: 'james.martinez@university.edu',
    phone: '+1 (555) 100-2008',
    departmentId: 'dept_004',
    designation: 'Professor',
    specialization: ['Network Security', 'Web Development', 'Cloud Computing'],
    qualifications: ['Ph.D. in Information Technology', 'M.S. in Computer Networks'],
    experience: 16,
    joinDate: '2008-02-15',
    status: 'active',
    officeRoom: 'IT-201',
    assignedClasses: [],
    researchAreas: ['Cybersecurity', 'Distributed Systems'],
    publications: 41,
    createdAt: '2008-02-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];