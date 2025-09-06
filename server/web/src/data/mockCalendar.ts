export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'Exam' | 'Class' | 'Holiday' | 'Event';
  department: string;
  duration: string;
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mid-Term Examination - Data Structures',
    description: 'Mid-semester examination covering arrays, linked lists, and trees',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Exam Hall A',
    type: 'Exam',
    department: 'Computer Science & Engineering',
    duration: '3 hours'
  },
  {
    id: '2',
    title: 'Machine Learning Final Project Presentation',
    description: 'Final project presentations for AIML students',
    date: '2024-02-20',
    time: '02:00 PM',
    location: 'AI Lab',
    type: 'Exam',
    department: 'Artificial Intelligence & Machine Learning',
    duration: '4 hours'
  },
  {
    id: '3',
    title: 'Cybersecurity Workshop',
    description: 'Hands-on workshop on ethical hacking techniques',
    date: '2024-02-10',
    time: '10:00 AM',
    location: 'Security Lab',
    type: 'Event',
    department: 'Cybersecurity & Digital Forensics',
    duration: '6 hours'
  },
  {
    id: '4',
    title: 'Database Systems Lab',
    description: 'Practical session on SQL queries and database design',
    date: '2024-02-12',
    time: '11:00 AM',
    location: 'IT Lab 2',
    type: 'Class',
    department: 'Information Technology',
    duration: '2 hours'
  },
  {
    id: '5',
    title: 'Republic Day',
    description: 'National holiday - No classes',
    date: '2024-01-26',
    time: 'All Day',
    location: 'Campus Wide',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '6',
    title: 'Blockchain Technology Seminar',
    description: 'Industry expert talk on cryptocurrency and DeFi',
    date: '2024-02-18',
    time: '03:00 PM',
    location: 'Auditorium',
    type: 'Event',
    department: 'Blockchain & Cryptocurrency Technology',
    duration: '2 hours'
  },
  {
    id: '7',
    title: 'Software Engineering Final Exam',
    description: 'Comprehensive exam on SDLC, testing, and project management',
    date: '2024-02-25',
    time: '09:00 AM',
    location: 'Exam Hall B',
    type: 'Exam',
    department: 'Software Engineering & DevOps',
    duration: '3 hours'
  },
  {
    id: '8',
    title: 'Data Analytics Practical',
    description: 'Hands-on session with Python and data visualization',
    date: '2024-02-14',
    time: '01:00 PM',
    location: 'Data Lab',
    type: 'Class',
    department: 'Data Science & Analytics',
    duration: '3 hours'
  },
  {
    id: '9',
    title: 'Electronics Lab Assessment',
    description: 'Practical assessment on circuit design and analysis',
    date: '2024-02-22',
    time: '10:00 AM',
    location: 'Electronics Lab',
    type: 'Exam',
    department: 'Electronics Engineering',
    duration: '4 hours'
  },
  {
    id: '10',
    title: 'Mathematics Quiz Competition',
    description: 'Inter-department mathematics competition',
    date: '2024-02-16',
    time: '04:00 PM',
    location: 'Mathematics Hall',
    type: 'Event',
    department: 'Mathematics',
    duration: '2 hours'
  },
  {
    id: '11',
    title: 'DevOps Pipeline Workshop',
    description: 'CI/CD implementation using Jenkins and Docker',
    date: '2024-02-28',
    time: '09:00 AM',
    location: 'Software Lab',
    type: 'Class',
    department: 'Software Engineering & DevOps',
    duration: '5 hours'
  },
  {
    id: '12',
    title: 'AI Ethics Symposium',
    description: 'Discussion on ethical implications of artificial intelligence',
    date: '2024-03-05',
    time: '11:00 AM',
    location: 'Conference Hall',
    type: 'Event',
    department: 'Artificial Intelligence & Machine Learning',
    duration: '3 hours'
  },
  {
    id: '13',
    title: 'Network Security Final Exam',
    description: 'Comprehensive exam on network protocols and security',
    date: '2024-03-08',
    time: '02:00 PM',
    location: 'IT Exam Hall',
    type: 'Exam',
    department: 'Information Technology',
    duration: '3 hours'
  },
  {
    id: '14',
    title: 'Holi',
    description: 'Festival of colors - Campus celebration',
    date: '2024-03-13',
    time: 'All Day',
    location: 'Campus Grounds',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '16',
    title: 'Diwali',
    description: 'Festival of lights - Campus closed',
    date: '2024-11-01',
    time: 'All Day',
    location: 'Campus Wide',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '17',
    title: 'Dussehra',
    description: 'Victory of good over evil - Holiday',
    date: '2024-10-12',
    time: 'All Day',
    location: 'Campus Wide',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '18',
    title: 'Independence Day',
    description: 'National holiday with flag hoisting ceremony',
    date: '2024-08-15',
    time: '08:00 AM',
    location: 'Main Campus',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '19',
    title: 'Gandhi Jayanti',
    description: 'Birth anniversary of Mahatma Gandhi',
    date: '2024-10-02',
    time: 'All Day',
    location: 'Campus Wide',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '20',
    title: 'Eid ul-Fitr',
    description: 'Festival marking end of Ramadan',
    date: '2024-04-10',
    time: 'All Day',
    location: 'Campus Wide',
    type: 'Holiday',
    department: 'All Departments',
    duration: 'Full Day'
  },
  {
    id: '15',
    title: 'Capstone Project Defense',
    description: 'Final year project presentations across all departments',
    date: '2024-03-20',
    time: '09:00 AM',
    location: 'Multiple Venues',
    type: 'Exam',
    department: 'All Departments',
    duration: '8 hours'
  }
];