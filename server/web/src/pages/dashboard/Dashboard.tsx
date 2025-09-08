import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { TakeAttendanceModal } from '../../components/modals/TakeAttendanceModal';
import { TrendingUp, Users, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { AttendanceChart, ClassPerformanceChart } from '../../components/charts';
import { useAttendance } from '../../hooks/useAttendance';


export const Dashboard: React.FC = () => {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const { summary } = useAttendance();
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, here's what's happening today</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Present Students</p>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{summary?.presentStudents || 25}</div>
                  <p className="text-xs text-muted-foreground mt-1">out of {summary?.totalStudents || 28} total</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">2</div>
                  <p className="text-xs text-muted-foreground mt-1">2 active courses</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{summary?.alerts || 3}</div>
                  <p className="text-xs text-muted-foreground mt-1">Low attendance warnings</p>
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
                Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClassPerformanceChart data={[
                { class: 'CS101', attendance: 94 },
                { class: 'MATH201', attendance: 90 },
                { class: 'ENG101', attendance: 83 },
                { class: 'PHY101', attendance: 78 }
              ]} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">303105221 - Digital Electronics Laboratory</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Attendance marked - 14/16 present</p>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">90%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
                <div>
                  <p className="font-medium text-primary">303191202 - Discrete Mathematics</p>
                  <p className="text-sm text-primary/70">Attendance marked - 11/12 present</p>
                </div>
                <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50">90%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">303105221 - Digital Electronics Laboratory</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Lab session - 13/16 present</p>
                </div>
                <Badge className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">80%</Badge>
              </div>
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
              <div className="p-3 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Monday</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 dark:from-primary/20 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Tuesday</span>
                  <span className="text-primary font-semibold">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-50 dark:from-yellow-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Wednesday</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Thursday</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 dark:from-purple-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Friday</span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">87%</span>
                </div>
                <Progress value={87} className="h-2" />
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