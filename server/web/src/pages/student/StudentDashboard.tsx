import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  QrCode, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  BookOpen,
  Target,
  Trophy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../../services/api';

export const StudentDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [userResponse, attendanceResponse, classesResponse] = await Promise.all([
          apiService.get('/auth/me'),
          apiService.get('/attendance/records'),
          apiService.get('/classes')
        ]);
        
        if (userResponse.success) {
          const user = userResponse.data as any;
          let studentAttendance: any[] = [];
          let studentClasses: any[] = [];
          
          if (attendanceResponse.success && user.studentId) {
            studentAttendance = (attendanceResponse.data as any[]).filter((record: any) => 
              record.studentId === user.studentId
            );
          }
          
          if (classesResponse.success && user.studentId) {
            studentClasses = (classesResponse.data as any[]).filter((cls: any) => 
              cls.enrollments?.some((enrollment: any) => enrollment.studentId === user.studentId)
            );
          }
          
          // Calculate overall attendance
          const totalRecords = studentAttendance.length;
          const presentRecords = studentAttendance.filter((record: any) => 
            record.status === 'present' || record.status === 'late'
          ).length;
          const overallAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
          
          setStudentData({
            user,
            overallAttendance,
            todayClasses: studentClasses.slice(0, 4),
            currentStreak: 12, // Mock data
            rank: 8, // Mock data
            classPerformance: studentClasses.map((cls: any) => ({
              subject: cls.course?.name || cls.name,
              attendance: Math.floor(Math.random() * 20) + 80 // Mock individual class attendance
            }))
          });
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
        setStudentData({
          overallAttendance: 87,
          todayClasses: [],
          currentStreak: 12,
          rank: 8,
          classPerformance: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your attendance and achievements</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <QrCode className="h-4 w-4" />
            Scan QR Code
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
                  <div className="text-2xl font-bold text-green-600 mt-1">{studentData?.overallAttendance || 0}%</div>
                  <p className="text-xs text-muted-foreground">This semester</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classes Today</p>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{studentData?.todayClasses?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">enrolled classes</p>
                </div>
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <div className="text-2xl font-bold text-purple-600 mt-1">{studentData?.currentStreak || 0}</div>
                  <p className="text-xs text-muted-foreground">days present</p>
                </div>
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rank</p>
                  <div className="text-2xl font-bold text-orange-600 mt-1">#{studentData?.rank || 0}</div>
                  <p className="text-xs text-muted-foreground">in class</p>
                </div>
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Today's Classes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData?.todayClasses?.length > 0 ? (
                  studentData.todayClasses.map((cls: any, index: number) => {
                    const times = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];
                    const statuses = ['present', 'present', 'upcoming', 'upcoming'];
                    const status = statuses[index % statuses.length];
                    const attendance = studentData.classPerformance?.find((perf: any) => 
                      perf.subject === (cls.course?.name || cls.name)
                    )?.attendance || Math.floor(Math.random() * 20) + 80;
                    
                    return (
                      <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium w-16">{times[index]}</div>
                          <div className="flex-1">
                            <div className="font-medium">{cls.course?.name || cls.name}</div>
                            <div className="text-sm text-muted-foreground">{cls.room || 'TBA'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">{attendance}%</div>
                          <Badge variant={status === 'present' ? 'default' : status === 'upcoming' ? 'secondary' : 'destructive'}>
                            {status === 'present' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {status === 'absent' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  [
                    { time: '09:00 AM', subject: 'Data Structures', room: 'CS-101', status: 'present', attendance: 95 },
                    { time: '11:00 AM', subject: 'Algorithms', room: 'CS-102', status: 'present', attendance: 88 },
                    { time: '02:00 PM', subject: 'Database Systems', room: 'CS-103', status: 'upcoming', attendance: 92 },
                    { time: '04:00 PM', subject: 'Software Engineering', room: 'CS-104', status: 'upcoming', attendance: 85 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium w-16">{item.time}</div>
                        <div className="flex-1">
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-sm text-muted-foreground">{item.room}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">{item.attendance}%</div>
                        <Badge variant={item.status === 'present' ? 'default' : item.status === 'upcoming' ? 'secondary' : 'destructive'}>
                          {item.status === 'present' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {item.status === 'absent' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Perfect Week', desc: '100% attendance this week', color: 'bg-green-500' },
                  { name: '10 Day Streak', desc: 'Attended 10 days in a row', color: 'bg-blue-500' },
                  { name: 'Early Bird', desc: 'First to scan QR code', color: 'bg-purple-500' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 rounded-full ${achievement.color} flex items-center justify-center`}>
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.desc}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData?.classPerformance?.length > 0 ? (
                  studentData.classPerformance.map((item: any, index: number) => {
                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'];
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.subject}</span>
                          <span className="text-muted-foreground">{item.attendance}%</span>
                        </div>
                        <Progress value={item.attendance} className="h-2" />
                      </div>
                    );
                  })
                ) : (
                  [
                    { subject: 'Data Structures', attendance: 95, color: 'bg-green-500' },
                    { subject: 'Algorithms', attendance: 88, color: 'bg-blue-500' },
                    { subject: 'Database Systems', attendance: 92, color: 'bg-purple-500' },
                    { subject: 'Software Eng.', attendance: 85, color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.subject}</span>
                        <span className="text-muted-foreground">{item.attendance}%</span>
                      </div>
                      <Progress value={item.attendance} className="h-2" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};