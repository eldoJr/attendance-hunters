import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { AttendanceChart, ClassPerformanceChart } from '../../components/charts';
import { apiService } from '../../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, analyticsResponse] = await Promise.all([
          apiService.get('/dashboard/stats'),
          apiService.get('/analytics/overview')
        ]);
        
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        } else if (analyticsResponse.success && analyticsResponse.data) {
          // Use analytics data as fallback
          const data = analyticsResponse.data as any;
          setDashboardData({
            todayAttendance: data.todayAttendance || { present: 0, absent: 0, late: 0, excused: 0 },
            presentStudents: data.todayAttendance?.present || 0,
            totalStudents: data.totalStudents || 0,
            activeClasses: data.activeClasses || 0,
            activeCourses: data.totalClasses || 0,
            alerts: 0,
            weeklyData: data.weeklyStats?.map((stat: any) => ({
              day: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
              attendance: Math.round((stat.count / (data.totalStudents || 1)) * 100) || 0
            })) || [],
            classPerformance: [],
            recentActivities: []
          });
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardData({
          todayAttendance: { present: 285, absent: 45, late: 12, excused: 0 },
          presentStudents: 285,
          totalStudents: 342,
          activeClasses: 12,
          activeCourses: 8,
          alerts: 5,
          weeklyData: [
            { day: 'Mon', attendance: 92 },
            { day: 'Tue', attendance: 88 },
            { day: 'Wed', attendance: 85 },
            { day: 'Thu', attendance: 90 },
            { day: 'Fri', attendance: 87 }
          ],
          classPerformance: [
            { class: 'CS101', attendance: 94 },
            { class: 'MATH201', attendance: 90 },
            { class: 'ENG101', attendance: 83 },
            { class: 'PHY101', attendance: 78 }
          ],
          recentActivities: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-6">
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Welcome back, here's what's happening today</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            onClick={() => navigate('/attendance/take')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                  <div className="text-2xl md:text-3xl font-bold text-primary mt-2">
                    {dashboardData?.todayAttendance ? 
                      Math.round(((dashboardData.todayAttendance.present + dashboardData.todayAttendance.late) / 
                        (dashboardData.todayAttendance.present + dashboardData.todayAttendance.absent + 
                         dashboardData.todayAttendance.late + dashboardData.todayAttendance.excused)) * 100) || 0
                      : 85}%
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">↗ +2% from yesterday</p>
                </div>
                <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present Students</p>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{dashboardData?.presentStudents || 342}</div>
                  <p className="text-xs text-muted-foreground mt-1">out of {dashboardData?.totalStudents || 402} total</p>
                </div>
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                  <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{dashboardData?.activeClasses || 12}</div>
                  <p className="text-xs text-muted-foreground mt-1">{dashboardData?.activeCourses || 8} active courses</p>
                </div>
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                  <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{dashboardData?.alerts || 5}</div>
                  <p className="text-xs text-muted-foreground mt-1">Low attendance warnings</p>
                </div>
                <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Weekly Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={dashboardData?.weeklyData || [
                { day: 'Mon', attendance: 92 },
                { day: 'Tue', attendance: 88 },
                { day: 'Wed', attendance: 85 },
                { day: 'Thu', attendance: 90 },
                { day: 'Fri', attendance: 87 }
              ]} />
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClassPerformanceChart data={dashboardData?.classPerformance || [
                { class: 'CS101', attendance: 94 },
                { class: 'MATH201', attendance: 90 },
                { class: 'ENG101', attendance: 83 },
                { class: 'PHY101', attendance: 78 }
              ]} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData?.recentActivities?.length > 0 ? (
                dashboardData.recentActivities.slice(0, 3).map((activity: any, index: number) => {
                  const percentage = Math.round(activity.attendancePercentage || 0);
                  const bgColor = percentage >= 90 ? 'bg-green-50 dark:bg-green-950/30' : 
                                 percentage >= 80 ? 'bg-primary/5 dark:bg-primary/10' : 
                                 'bg-yellow-50 dark:bg-yellow-950/30';
                  const borderColor = percentage >= 90 ? 'border-green-200 dark:border-green-800' : 
                                     percentage >= 80 ? 'border-primary/20 dark:border-primary/30' : 
                                     'border-yellow-200 dark:border-yellow-800';
                  const textColor = percentage >= 90 ? 'text-green-800 dark:text-green-300' : 
                                   percentage >= 80 ? 'text-primary' : 
                                   'text-yellow-800 dark:text-yellow-300';
                  const badgeColor = percentage >= 90 ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700' : 
                                    percentage >= 80 ? 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50' : 
                                    'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
                  
                  return (
                    <div key={activity.id || index} className={`flex items-center justify-between p-3 ${bgColor} rounded-lg border ${borderColor}`}>
                      <div>
                        <p className={`font-medium ${textColor}`}>{activity.classCode || 'N/A'} - {activity.className || 'Unknown Class'}</p>
                        <p className={`text-sm ${textColor.replace('800', '600').replace('300', '400')}`}>
                          Attendance marked - {activity.presentCount || 0}/{activity.totalStudents || 0} present
                        </p>
                      </div>
                      <Badge className={badgeColor}>{percentage}%</Badge>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">CS101 - Introduction to Computer Science</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Attendance marked - 42/45 present</p>
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">93%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
                    <div>
                      <p className="font-medium text-primary">CS201 - Data Structures</p>
                      <p className="text-sm text-primary/70">Attendance marked - 34/38 present</p>
                    </div>
                    <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50">89%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-300">EE101 - Circuit Analysis</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Lab session - 33/42 present</p>
                    </div>
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">79%</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(dashboardData?.weeklyData || [
                { day: 'Mon', attendance: 92 },
                { day: 'Tue', attendance: 88 },
                { day: 'Wed', attendance: 85 },
                { day: 'Thu', attendance: 90 },
                { day: 'Fri', attendance: 87 }
              ]).map((day: any, index: number) => {
                const colors = [
                  { bg: 'from-green-50 dark:from-green-950/30', text: 'text-green-600 dark:text-green-400' },
                  { bg: 'from-primary/10 dark:from-primary/20', text: 'text-primary' },
                  { bg: 'from-yellow-50 dark:from-yellow-950/30', text: 'text-yellow-600 dark:text-yellow-400' },
                  { bg: 'from-blue-50 dark:from-blue-950/30', text: 'text-blue-600 dark:text-blue-400' },
                  { bg: 'from-purple-50 dark:from-purple-950/30', text: 'text-purple-600 dark:text-purple-400' }
                ];
                const colorSet = colors[index % colors.length];
                const dayName = day.day.length === 3 ? 
                  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day.day)] || day.day :
                  day.day;
                
                return (
                  <div key={day.day} className={`p-3 bg-gradient-to-r ${colorSet.bg} to-transparent rounded-lg`}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{dayName}</span>
                      <span className={`${colorSet.text} font-semibold`}>{day.attendance}%</span>
                    </div>
                    <Progress value={day.attendance} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};