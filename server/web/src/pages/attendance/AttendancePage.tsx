import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { QrCode, UserCheck, Users, UserX, Clock, Search, Filter, Download, Edit, MoreVertical, Eye, History, MessageSquare, Calendar } from 'lucide-react';

import { exportToExcel } from '../../utils/exportUtils';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { apiService } from '../../services/api';

interface AttendanceRecord {
  id: string;
  student: {
    user: { name: string };
    rollNumber: string;
  };
  class: {
    name: string;
    course: { name: string; code: string };
  };
  session: {
    date: string;
    startTime: string;
  };
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  notes?: string;
}

interface AttendanceStats {
  presentToday: number;
  absentToday: number;
  lateToday: number;
  totalStudents: number;
}

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  const { addNotification } = useAppStore();
  
  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append('startDate', selectedDate);
        params.append('endDate', selectedDate);
      }
      
      const response = await apiService.get<{data: AttendanceRecord[], total: number}>(`/attendance/records?${params}`);
      
      if (response.success && response.data) {
        setAttendanceRecords(response.data.data || []);
        calculateStats(response.data.data || []);
      } else {
        addNotification({ message: response.message || 'Failed to load attendance records', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to load attendance records:', error);
      addNotification({ message: 'Failed to load attendance records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records: AttendanceRecord[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(record => 
      record.session.date.split('T')[0] === today
    );
    
    const stats = todayRecords.reduce((acc, record) => {
      switch (record.status) {
        case 'present': acc.presentToday++; break;
        case 'absent': acc.absentToday++; break;
        case 'late': acc.lateToday++; break;
      }
      return acc;
    }, { presentToday: 0, absentToday: 0, lateToday: 0, totalStudents: 0 });
    
    stats.totalStudents = stats.presentToday + stats.absentToday + stats.lateToday;
    setAttendanceStats(stats);
  };

  const filteredRecords = attendanceRecords.filter(record => 
    record.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Attendance Records</h1>
            <p className="text-muted-foreground">Track and manage student attendance</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-primary/20 text-primary hover:bg-primary/10"
              onClick={() => navigate('/attendance/take')}
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Scanner
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/attendance/take')}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Take Attendance
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{attendanceStats.presentToday}</div>
                  <p className="text-xs text-muted-foreground mt-1">out of {attendanceStats.totalStudents} total</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{attendanceStats.absentToday}</div>
                  <p className="text-xs text-muted-foreground mt-1">requires follow-up</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 dark:from-yellow-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Late Arrivals</p>
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{attendanceStats.lateToday}</div>
                  <p className="text-xs text-muted-foreground mt-1">within grace period</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students or classes..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative sm:max-w-sm">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-10"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  placeholder="Select date"
                />
              </div>
              <Button 
                variant="outline" 
                className="border-primary/20 text-primary hover:bg-primary/10"
                onClick={() => {
                  exportToExcel(filteredRecords, 'attendance-records');
                  addNotification({ message: 'Attendance records exported successfully', type: 'success' });
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                Attendance Records ({filteredRecords.length})
              </CardTitle>
              <Badge variant="outline" className="text-muted-foreground">
                Today: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Student</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Time</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading attendance records...
                      </TableCell>
                    </TableRow>
                  ) : filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{record.student.user.name}</div>
                            <div className="text-sm text-muted-foreground">{record.student.rollNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.class.name}</div>
                            <div className="text-sm text-muted-foreground">{record.class.course.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(record.session.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {record.checkInTime ? new Date(`1970-01-01T${record.checkInTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                           new Date(`1970-01-01T${record.session.startTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.status === 'present' ? 'default' : 
                                   record.status === 'late' ? 'secondary' : 
                                   record.status === 'excused' ? 'outline' : 'destructive'}
                            className={record.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                     record.status === 'late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                     record.status === 'excused' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                     'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            

          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};