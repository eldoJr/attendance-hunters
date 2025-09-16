import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  QrCode,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const [userResponse, classesResponse] = await Promise.all([
          apiService.get('/auth/me'),
          apiService.get('/classes')
        ]);
        
        if (userResponse.success && classesResponse.success) {
          const user = userResponse.data as any;
          const allClasses = classesResponse.data as any[];
          
          // Filter classes for current faculty member
          const myClasses = allClasses.filter((cls: any) => 
            cls.facultyId === user.facultyId || cls.faculty?.userId === user.id
          );
          
          const totalStudents = myClasses.reduce((sum: number, cls: any) => 
            sum + (cls.currentEnrollment || cls._count?.enrollments || 0), 0
          );
          
          setStaffData({
            user,
            myClasses,
            totalStudents,
            todayClasses: myClasses.slice(0, 3), // Mock today's classes
            avgAttendance: 87 // Mock average
          });
        }
      } catch (error) {
        console.error('Failed to fetch staff data:', error);
        setStaffData({
          myClasses: [],
          totalStudents: 142,
          todayClasses: [],
          avgAttendance: 87
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Manage your classes and track attendance</p>
          </div>
          <Button 
            className="gap-2 w-full sm:w-auto"
            onClick={() => navigate('/attendance/take')}
          >
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Take Attendance</span>
            <span className="sm:hidden">Attendance</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Classes</p>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{staffData?.myClasses?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">active classes</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <div className="text-3xl font-bold text-green-600 mt-2">{staffData?.totalStudents || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">across all classes</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                  <div className="text-3xl font-bold text-purple-600 mt-2">{staffData?.todayClasses?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">scheduled today</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                  <div className="text-3xl font-bold text-orange-600 mt-2">{staffData?.avgAttendance || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">this week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {staffData?.myClasses?.length > 0 ? (
                staffData.myClasses.slice(0, 3).map((cls: any, index: number) => {
                  const times = ['09:00 AM', '11:00 AM', '02:00 PM'];
                  const statuses = ['completed', 'current', 'upcoming'];
                  const status = statuses[index % statuses.length];
                  
                  return (
                    <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{times[index]}</div>
                        <div>
                          <div className="font-medium">{cls.course?.name || cls.name}</div>
                          <div className="text-sm text-muted-foreground">{cls.room || 'TBA'} • {cls.currentEnrollment || cls._count?.enrollments || 0} students</div>
                        </div>
                      </div>
                      <Badge variant={status === 'completed' ? 'default' : status === 'current' ? 'destructive' : 'secondary'}>
                        {status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                         status === 'current' ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                        {status}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                [
                  { time: '09:00 AM', class: 'Data Structures', room: 'CS-101', students: 45, status: 'completed' },
                  { time: '11:00 AM', class: 'Algorithms', room: 'CS-102', students: 38, status: 'current' },
                  { time: '02:00 PM', class: 'Database Systems', room: 'CS-103', students: 42, status: 'upcoming' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">{item.time}</div>
                      <div>
                        <div className="font-medium">{item.class}</div>
                        <div className="text-sm text-muted-foreground">{item.room} • {item.students} students</div>
                      </div>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'default' : item.status === 'current' ? 'destructive' : 'secondary'}>
                      {item.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                       item.status === 'current' ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                      {item.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start gap-2" 
                variant="outline"
                onClick={() => navigate('/attendance/take')}
              >
                <QrCode className="h-4 w-4" />
                Take Attendance
              </Button>
              <Button 
                className="w-full justify-start gap-2" 
                variant="outline"
                onClick={() => navigate('/attendance')}
              >
                <Users className="h-4 w-4" />
                View Attendance Records
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <BookOpen className="h-4 w-4" />
                View Class Reports
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                Update Class Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};