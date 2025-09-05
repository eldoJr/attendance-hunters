import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { TakeAttendanceModal } from '../../components/modals/TakeAttendanceModal';
import { TrendingUp, Users, Calendar, AlertTriangle, Plus, BookOpen } from 'lucide-react';
import { AttendanceChart, ClassPerformanceChart } from '../../components/charts';
import { useAttendance } from '../../hooks/useAttendance';

export const StaffDashboard: React.FC = () => {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const { summary } = useAttendance();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Faculty Dashboard</h1>
            <p className="text-muted-foreground">Manage your classes and track student attendance</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsAttendanceModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                  <div className="text-3xl font-bold text-primary mt-2">{summary?.todayAttendance || 85}%</div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">↗ +2% from yesterday</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{summary?.totalStudents || 156}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Classes</p>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">4</div>
                  <p className="text-xs text-muted-foreground mt-1">Active courses</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Attendance</p>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{summary?.alerts || 8}</div>
                  <p className="text-xs text-muted-foreground mt-1">Students below 75%</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <AttendanceChart data={[
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
                My Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClassPerformanceChart data={[
                { class: 'Digital Electronics Lab', attendance: 94 },
                { class: 'Computer Networks', attendance: 90 },
                { class: 'Database Systems', attendance: 83 },
                { class: 'Software Engineering', attendance: 88 }
              ]} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Class Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Digital Electronics Lab</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Today, 2:00 PM - 28/30 present</p>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">93%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
                <div>
                  <p className="font-medium text-primary">Computer Networks</p>
                  <p className="text-sm text-primary/70">Yesterday, 9:00 AM - 35/40 present</p>
                </div>
                <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50">88%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">Database Systems</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Monday, 11:00 AM - 32/42 present</p>
                </div>
                <Badge className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">76%</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-primary">Computer Networks</p>
                    <p className="text-sm text-primary/70">Tomorrow, 9:00 AM - 11:00 AM</p>
                  </div>
                  <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50">Room 301</Badge>
                </div>
                <p className="text-xs text-muted-foreground">40 students enrolled</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300">Software Engineering</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Tomorrow, 2:00 PM - 4:00 PM</p>
                  </div>
                  <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700">Lab 2</Badge>
                </div>
                <p className="text-xs text-muted-foreground">25 students enrolled</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">Database Systems</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Friday, 11:00 AM - 1:00 PM</p>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">Room 205</Badge>
                </div>
                <p className="text-xs text-muted-foreground">42 students enrolled</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TakeAttendanceModal 
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />
    </Layout>
  );
};