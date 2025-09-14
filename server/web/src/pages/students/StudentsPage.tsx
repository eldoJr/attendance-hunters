import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Download,
  Upload,
  Eye,
  Edit,
  MessageSquare,
  History
} from 'lucide-react';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import { apiService } from '../../services/api';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  section: string;
  year: string;
  department: string;
  attendance: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastSeen: string;
  phone: string;
  enrollmentDate: string;
  gpa: number;
}

export const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentsData = await apiService.getStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to load students:', error);
      }
    };
    loadStudents();
  }, []);

  const departments = Array.from(new Set(students.map(s => s.department)));
  const sections = Array.from(new Set(students.map(s => s.section)));
  const years = Array.from(new Set(students.map(s => s.year)));

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (student.class || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (student.department || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = selectedYear === 'All' || student.year.toString() === selectedYear;
      const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;
      const matchesDepartment = selectedDepartment === 'All' || student.department === selectedDepartment;
      const matchesSection = selectedSection === 'All' || student.section === selectedSection;
      
      const matchesAttendance = 
        attendanceFilter === 'All' ||
        (attendanceFilter === 'High' && (student.attendance || 0) >= 85) ||
        (attendanceFilter === 'Medium' && (student.attendance || 0) >= 70 && (student.attendance || 0) < 85) ||
        (attendanceFilter === 'Low' && (student.attendance || 0) < 70);
      
      return matchesSearch && matchesYear && matchesStatus && matchesDepartment && matchesSection && matchesAttendance;
    });
  }, [searchTerm, selectedYear, selectedStatus, selectedDepartment, selectedSection, attendanceFilter, students]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('All');
    setSelectedStatus('All');
    setSelectedDepartment('All');
    setSelectedSection('All');
    setAttendanceFilter('All');
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600 dark:text-green-400';
    if (attendance >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAttendanceBg = (attendance: number) => {
    if (attendance >= 90) return 'bg-green-500';
    if (attendance >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'Inactive':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'Suspended':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground mt-1">Manage student records and track academic progress</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => exportToExcel(filteredStudents, 'students-data')}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <div className="text-2xl font-bold text-primary mt-1">{students.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">enrolled students</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{students.filter(s => s.status === 'Active').length}</div>
                  <p className="text-xs text-muted-foreground mt-1">currently enrolled</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length) : 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">this semester</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{students.filter(s => (s.attendance || 0) < 70).length}</div>
                  <p className="text-xs text-muted-foreground mt-1">below 70% attendance</p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, ID, email, class, or department..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <select 
                className="p-2 border border-border rounded-md bg-background text-sm"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select 
                className="p-2 border border-border rounded-md bg-background text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="All">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                className="p-2 border border-border rounded-md bg-background text-sm"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="All">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
              <select 
                className="p-2 border border-border rounded-md bg-background text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
              <select 
                className="p-2 border border-border rounded-md bg-background text-sm"
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
              >
                <option value="All">All Attendance</option>
                <option value="High">High (85%+)</option>
                <option value="Medium">Medium (70-84%)</option>
                <option value="Low">Low (&lt;70%)</option>
              </select>
              <Button variant="outline" onClick={clearFilters} className="text-sm">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                All Students ({filteredStudents.length})
              </CardTitle>
              <Badge variant="outline" className="text-muted-foreground">
                Academic Year 2024-25
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Student</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Academic Info</TableHead>
                    <TableHead className="font-semibold">Attendance</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Seen</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {student.studentId}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{student.class}</div>
                          <div className="text-xs text-muted-foreground">{student.department} - Section {student.section}</div>
                          <div className="text-xs text-muted-foreground">Year {student.year}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getAttendanceColor(student.attendance || 0)}`}>
                            {student.attendance || 0}%
                          </span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getAttendanceBg(student.attendance || 0)}`}
                              style={{ width: `${student.attendance || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status || 'Active')}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {student.lastSeen}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <button 
                            className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors rounded-md flex items-center justify-center border border-transparent hover:border-border"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === student.id ? null : student.id);
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openDropdown === student.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                              <div className="absolute right-0 top-8 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-1 animate-in slide-in-from-top-2">
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Profile
                                </button>
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit Details
                                </button>
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <History className="h-4 w-4" />
                                  Attendance History
                                </button>
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Send Message
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No students found</p>
                <p className="text-sm">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};