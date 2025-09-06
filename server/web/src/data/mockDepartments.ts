export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  email: string;
  phone: string;
  type: 'Technology' | 'Engineering' | 'Science';
  faculty: number;
  students: number;
  programs: number;
  status: 'Active' | 'Inactive';
  established: string;
  building: string;
  description: string;
}

export const MOCK_DEPARTMENTS: Department[] = [
  // Technology Departments (7)
  {
    id: '1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    head: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    type: 'Technology',
    faculty: 24,
    students: 450,
    programs: 6,
    status: 'Active',
    established: '1995',
    building: 'Tech Building A',
    description: 'Leading department in software engineering, AI, and computer systems'
  },
  {
    id: '2',
    name: 'Information Technology',
    code: 'IT',
    head: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    phone: '+1 (555) 234-5678',
    type: 'Technology',
    faculty: 18,
    students: 320,
    programs: 4,
    status: 'Active',
    established: '2001',
    building: 'Tech Building B',
    description: 'Focused on network systems, cybersecurity, and IT management'
  },
  {
    id: '3',
    name: 'Data Science & Analytics',
    code: 'DSA',
    head: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    phone: '+1 (555) 345-6789',
    type: 'Technology',
    faculty: 16,
    students: 280,
    programs: 3,
    status: 'Active',
    established: '2018',
    building: 'Innovation Center',
    description: 'Cutting-edge research in big data, machine learning, and business analytics'
  },
  {
    id: '4',
    name: 'Artificial Intelligence & Machine Learning',
    code: 'AIML',
    head: 'Dr. David Wilson',
    email: 'david.wilson@university.edu',
    phone: '+1 (555) 456-7890',
    type: 'Technology',
    faculty: 20,
    students: 240,
    programs: 4,
    status: 'Active',
    established: '2020',
    building: 'AI Research Center',
    description: 'Advanced AI research, deep learning, and intelligent systems development'
  },
  {
    id: '5',
    name: 'Cybersecurity & Digital Forensics',
    code: 'CDF',
    head: 'Dr. Lisa Brown',
    email: 'lisa.brown@university.edu',
    phone: '+1 (555) 567-8901',
    type: 'Technology',
    faculty: 14,
    students: 180,
    programs: 3,
    status: 'Active',
    established: '2019',
    building: 'Security Lab Complex',
    description: 'Specialized in cybersecurity, ethical hacking, and digital investigation'
  },
  {
    id: '6',
    name: 'Software Engineering & DevOps',
    code: 'SED',
    head: 'Prof. James Anderson',
    email: 'james.anderson@university.edu',
    phone: '+1 (555) 678-9012',
    type: 'Technology',
    faculty: 22,
    students: 380,
    programs: 5,
    status: 'Active',
    established: '2015',
    building: 'Software Development Hub',
    description: 'Modern software development practices, cloud computing, and DevOps methodologies'
  },
  {
    id: '7',
    name: 'Blockchain & Cryptocurrency Technology',
    code: 'BCT',
    head: 'Dr. Maria Garcia',
    email: 'maria.garcia@university.edu',
    phone: '+1 (555) 789-0123',
    type: 'Technology',
    faculty: 12,
    students: 150,
    programs: 2,
    status: 'Active',
    established: '2021',
    building: 'Fintech Innovation Lab',
    description: 'Emerging technologies in blockchain, DeFi, and cryptocurrency systems'
  },
  
  // Engineering Departments
  {
    id: '8',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    head: 'Dr. Robert Taylor',
    email: 'robert.taylor@university.edu',
    phone: '+1 (555) 890-1234',
    type: 'Engineering',
    faculty: 28,
    students: 520,
    programs: 7,
    status: 'Active',
    established: '1985',
    building: 'Engineering Block C',
    description: 'Traditional engineering with focus on electronics and communication systems'
  },
  {
    id: '9',
    name: 'Mechanical Engineering',
    code: 'ME',
    head: 'Prof. Jennifer White',
    email: 'jennifer.white@university.edu',
    phone: '+1 (555) 901-2345',
    type: 'Engineering',
    faculty: 32,
    students: 480,
    programs: 6,
    status: 'Active',
    established: '1980',
    building: 'Mechanical Workshop',
    description: 'Comprehensive mechanical engineering with modern manufacturing focus'
  },
  
  // Science Departments
  {
    id: '10',
    name: 'Mathematics & Statistics',
    code: 'MATH',
    head: 'Dr. Kevin Brown',
    email: 'kevin.brown@university.edu',
    phone: '+1 (555) 012-3456',
    type: 'Science',
    faculty: 20,
    students: 300,
    programs: 4,
    status: 'Active',
    established: '1975',
    building: 'Science Building A',
    description: 'Pure and applied mathematics with statistical analysis focus'
  },
  {
    id: '11',
    name: 'Physics & Applied Sciences',
    code: 'PHYS',
    head: 'Dr. Amanda Davis',
    email: 'amanda.davis@university.edu',
    phone: '+1 (555) 123-4567',
    type: 'Science',
    faculty: 18,
    students: 220,
    programs: 3,
    status: 'Active',
    established: '1978',
    building: 'Physics Laboratory',
    description: 'Theoretical and experimental physics with applied science applications'
  }
];