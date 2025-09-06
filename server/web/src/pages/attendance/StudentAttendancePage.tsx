import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Target, Calendar, CheckCircle, XCircle, Clock, QrCode, Filter } from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-09');
  const [selectedClass, setSelectedClass] = useState('all');

  const attendanceData = [
    { date: '2025-09-01', class: 'CS301', subject: 'Data Structures', status: 'present', time: '09:30 AM' },
    { date: '2025-09-01', class: 'CS302', subject: 'Algorithms', time: '10:45 AM', status: 'present' },
    { date: '2025-09-01', class: 'CS303', subject: 'Database Systems', time: '01:15 PM', status: 'present' },
    { date: '2025-09-02', class: 'CS306', subject: 'Operating Systems', time: '09:30 AM', status: 'present' },
    { date: '2025-09-02', class: 'CS307', subject: 'Web Development', time: '10:45 AM', status: 'absent' },
    { date: '2025-09-02', class: 'LAB01', subject: 'Programming Lab', time: '03:45 PM', status: 'present' },
    { date: '2025-09-03', class: 'CS301', subject: 'Data Structures', time: '09:30 AM', status: 'present' },
    { date: '2025-09-03', class: 'CS310', subject: 'Machine Learning', time: '10:45 AM', status: 'late' },
    { date: '2025-09-03', class: 'CS311', subject: 'Cybersecurity', time: '01:15 PM', status: 'present' },
    { date: '2025-09-04', class: 'CS302', subject: 'Algorithms', time: '10:45 AM', status: 'present' },
    { date: '2025-09-04', class: 'CS314', subject: 'Blockchain Tech', time: '12:00 PM', status: 'absent' },
    { date: '2025-09-05', class: 'CS317', subject: 'Software Testing', time: '09:30 AM', status: 'present' },
  ];

  const classes = ['CS301', 'CS302', 'CS303', 'CS306', 'CS307', 'CS310', 'CS311', 'CS314', 'CS317', 'LAB01'];

  const filteredData = selectedClass === 'all' 
    ? attendanceData 
    : attendanceData.filter(item => item.class === selectedClass);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'late': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const totalClasses = filteredData.length;
  const presentCount = filteredData.filter(item => item.status === 'present').length;
  const absentCount = filteredData.filter(item => item.status === 'absent').length;
  const lateCount = filteredData.filter(item => item.status === 'late').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
            <p className="text-muted-foreground mt-1">Track your class attendance and performance</p>
          </div>
          <Button className="gap-2">
            <QrCode className="h-4 w-4" />
            Scan QR Code
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <div className="text-2xl font-bold text-green-600 mt-1">{presentCount}</div>
                  <p className="text-xs text-muted-foreground">{attendancePercentage}%</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <div className="text-2xl font-bold text-red-600 mt-1">{absentCount}</div>
                  <p className="text-xs text-muted-foreground">classes missed</p>
                </div>
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Late</p>
                  <div className="text-2xl font-bold text-orange-600 mt-1">{lateCount}</div>
                  <p className="text-xs text-muted-foreground">late arrivals</p>
                </div>
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{totalClasses}</div>
                  <p className="text-xs text-muted-foreground">this month</p>
                </div>
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Records
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredData.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium w-20">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{record.class}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm">{record.subject}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{record.time}</span>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};