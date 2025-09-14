import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { GraduationCap, Users, UserPlus, Upload, Plus, Search, Edit, BarChart3, Calendar, Clock, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../components/ui/dropdown-menu';
import { exportToExcel } from '../../utils/exportUtils';
import { useAppStore } from '../../store';
import { apiService } from '../../services/api';

export const ClassesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const { addNotification } = useAppStore();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await apiService.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };
    loadCourses();
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);
  
  const classes = courses.map((course, index) => ({
    id: index + 1,
    name: course.name,
    code: course.code,
    faculty: course.faculty,
    students: course.students,
    enrolled: course.students || 30,
    schedule: course.schedule || 'Mon, Wed, Fri 10:00-11:30',
    room: `Room ${100 + index}`,
    status: 'Active'
  }));

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.faculty || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Class Management</h1>
            <p className="text-muted-foreground">Manage classes, faculty assignments, and student enrollment</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-primary/20 text-primary hover:bg-primary/10"
              onClick={() => {
                exportToExcel(filteredClasses, 'classes-data');
                addNotification({ message: 'Classes data exported successfully', type: 'success' });
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Export Classes
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <div className="text-3xl font-bold text-primary mt-2">12</div>
                  <p className="text-xs text-muted-foreground mt-1">across all departments</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">402</div>
                  <p className="text-xs text-muted-foreground mt-1">enrolled students</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 dark:from-purple-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Faculty Members</p>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">8</div>
                  <p className="text-xs text-muted-foreground mt-1">active instructors</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">3</div>
                  <p className="text-xs text-muted-foreground mt-1">currently in progress</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search classes, codes, or faculty..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                All Classes ({filteredClasses.length})
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
                    <TableHead className="font-semibold">Class Details</TableHead>
                    <TableHead className="font-semibold">Faculty</TableHead>
                    <TableHead className="font-semibold">Enrollment</TableHead>
                    <TableHead className="font-semibold">Schedule</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((classItem) => (
                    <TableRow key={classItem.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium">{classItem.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {classItem.code}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{classItem.room}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{classItem.faculty}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{classItem.students}/{classItem.enrolled}</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(classItem.students / (classItem.enrolled || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {classItem.schedule}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
                          {classItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === classItem.id ? null : classItem.id);
                              }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          {openDropdown === classItem.id && (
                            <>
                              <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40" onClick={() => setOpenDropdown(null)} />
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setOpenDropdown(null)}>
                                  <div className="font-medium text-sm">Edit Class</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOpenDropdown(null)}>
                                  <div className="font-medium text-sm">Manage Students</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOpenDropdown(null)}>
                                  <div className="font-medium text-sm">View Reports</div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </>
                          )}
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredClasses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No classes found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};