import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { TrendingUp, Users, Calendar, BookOpen } from 'lucide-react';
import { AttendanceChart } from '../../components/charts';

export const StudentDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground">Track your attendance and academic progress</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
                  <div className="text-3xl font-bold text-primary mt-2">87%</div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Above 75% requirement</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Classes Attended</p>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">42</div>
                  <p className="text-xs text-muted-foreground mt-1">out of 48 total</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">6</div>
                  <p className="text-xs text-muted-foreground mt-1">Active this semester</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 dark:from-orange-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">4/5</div>
                  <p className="text-xs text-muted-foreground mt-1">Classes attended</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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
                My Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={[
                { day: 'Mon', attendance: 100 },
                { day: 'Tue', attendance: 80 },
                { day: 'Wed', attendance: 100 },
                { day: 'Thu', attendance: 60 },
                { day: 'Fri', attendance: 100 }
              ]} />
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                Course Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Digital Electronics Lab</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 dark:from-primary/20 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Discrete Mathematics</span>
                  <span className="text-primary font-semibold">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-50 dark:from-yellow-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Computer Networks</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="p-3 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Database Systems</span>
                  <span className="text-red-600 dark:text-red-400 font-semibold">74%</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Classes & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                Recent Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Digital Electronics Lab</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Today, 2:00 PM - Present</p>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">Present</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Discrete Mathematics</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Yesterday, 10:00 AM - Present</p>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">Present</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300">Database Systems</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Monday, 11:00 AM - Absent</p>
                </div>
                <Badge className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700">Absent</Badge>
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
                    <p className="text-sm text-primary/70">Tomorrow, 9:00 AM</p>
                  </div>
                  <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50">Room 301</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Prof. Johnson</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300">Software Engineering</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Tomorrow, 2:00 PM</p>
                  </div>
                  <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700">Lab 2</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Prof. Smith</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">Database Systems</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Friday, 11:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">Room 205</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Prof. Davis</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};