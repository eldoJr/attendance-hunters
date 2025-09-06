import React from 'react';
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

export const StaffDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your classes and track attendance</p>
          </div>
          <Button className="gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR Code
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Classes</p>
                  <div className="text-3xl font-bold text-blue-600 mt-2">5</div>
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
                  <div className="text-3xl font-bold text-green-600 mt-2">142</div>
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
                  <div className="text-3xl font-bold text-purple-600 mt-2">3</div>
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
                  <div className="text-3xl font-bold text-orange-600 mt-2">87%</div>
                  <p className="text-xs text-muted-foreground mt-1">this week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
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
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2" variant="outline">
                <QrCode className="h-4 w-4" />
                Generate QR Code for Current Class
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Users className="h-4 w-4" />
                Mark Manual Attendance
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