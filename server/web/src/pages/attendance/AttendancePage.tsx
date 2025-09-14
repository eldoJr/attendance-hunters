import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { QrCode, UserCheck, Users, UserX, Clock, Search, Filter, Download, Edit, MoreVertical, Eye, History, MessageSquare } from 'lucide-react';
import { TakeAttendanceModal } from '../../components/modals/TakeAttendanceModal';
import { exportToExcel } from '../../utils/exportUtils';
import { useAppStore } from '../../store';
import { apiService } from '../../services/api';

export const AttendancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  const { addNotification } = useAppStore();
  
  useEffect(() => {
    const loadAttendanceRecords = async () => {
      try {
        const records = await apiService.getAttendanceRecords();
        setAttendanceRecords(records);
      } catch (error) {
        console.error('Failed to load attendance records:', error);
        setAttendanceRecords(getFallbackAttendanceRecords());
      }
    };
    loadAttendanceRecords();
  }, []);

  const getFallbackAttendanceRecords = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      student: `Student ${i + 1}`,
      class: `Class ${Math.floor(i / 5) + 1}`,
      date: new Date().toLocaleDateString(),
      time: `${9 + (i % 8)}:00 AM`,
      status: ['present', 'absent', 'late'][i % 3]
    }));
  };

  const filteredRecords = attendanceRecords.filter(record => 
    record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class.toLowerCase().includes(searchTerm.toLowerCase())
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
              onClick={() => setShowModal(true)}
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Scanner
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowModal(true)}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Mark Attendance
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
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">285</div>
                  <p className="text-xs text-muted-foreground mt-1">out of 342 total</p>
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
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">45</div>
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
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">12</div>
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
              <Input 
                type="date" 
                className="sm:max-w-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
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
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{record.student}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {record.class}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.date}</TableCell>
                      <TableCell className="text-muted-foreground">{record.time}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            record.status === 'present' 
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
                              : record.status === 'absent'
                              ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
                              : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <button 
                            className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors rounded-md flex items-center justify-center border border-transparent hover:border-border"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === record.id ? null : record.id);
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openDropdown === record.id && (
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
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No attendance records found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <TakeAttendanceModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </Layout>
  );
};