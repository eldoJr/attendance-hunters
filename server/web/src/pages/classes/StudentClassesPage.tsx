import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { BookOpen, User, MapPin, Clock, TrendingUp, Calendar } from 'lucide-react';

export const StudentClassesPage: React.FC = () => {
  const classes = [
    {
      code: 'CS301',
      name: 'Data Structures',
      instructor: 'Dr. Smith',
      room: 'CS-101',
      schedule: 'Mon, Wed 09:30-10:25',
      attendance: 95,
      totalClasses: 40,
      attendedClasses: 38,
      type: 'CRT',
      credits: 4
    },
    {
      code: 'CS302',
      name: 'Algorithms',
      instructor: 'Ms. Johnson',
      room: 'CS-102',
      schedule: 'Mon, Thu 10:45-11:40',
      attendance: 88,
      totalClasses: 35,
      attendedClasses: 31,
      type: 'PSS',
      credits: 3
    },
    {
      code: 'CS303',
      name: 'Database Systems',
      instructor: 'Mr. Wilson',
      room: 'CS-103',
      schedule: 'Mon, Wed 01:15-02:10',
      attendance: 92,
      totalClasses: 38,
      attendedClasses: 35,
      type: 'CRT',
      credits: 4
    },
    {
      code: 'CS304',
      name: 'Software Engineering',
      instructor: 'Dr. Brown',
      room: 'CS-104',
      schedule: 'Mon, Fri 02:30-03:25',
      attendance: 85,
      totalClasses: 42,
      attendedClasses: 36,
      type: 'SB',
      credits: 3
    },
    {
      code: 'CS305',
      name: 'Computer Networks',
      instructor: 'Ms. Davis',
      room: 'CS-105',
      schedule: 'Tue, Thu 09:30-10:25',
      attendance: 90,
      totalClasses: 36,
      attendedClasses: 32,
      type: 'PSS',
      credits: 4
    },
    {
      code: 'LAB01',
      name: 'Programming Lab',
      instructor: 'Mr. Taylor',
      room: 'LAB-01',
      schedule: 'Tue, Fri 03:45-04:40',
      attendance: 100,
      totalClasses: 20,
      attendedClasses: 20,
      type: 'SB',
      credits: 2
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CRT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PSS': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'SB': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const totalCredits = classes.reduce((sum, cls) => sum + cls.credits, 0);
  const overallAttendance = Math.round(
    classes.reduce((sum, cls) => sum + cls.attendance, 0) / classes.length
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
            <p className="text-muted-foreground mt-1">Track your enrolled courses and attendance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{classes.length}</div>
                  <p className="text-xs text-muted-foreground">enrolled</p>
                </div>
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
                  <div className={`text-2xl font-bold mt-1 ${getAttendanceColor(overallAttendance)}`}>
                    {overallAttendance}%
                  </div>
                  <p className="text-xs text-muted-foreground">average</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                  <div className="text-2xl font-bold text-purple-600 mt-1">{totalCredits}</div>
                  <p className="text-xs text-muted-foreground">credit hours</p>
                </div>
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.code} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {classItem.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{classItem.code}</p>
                  </div>
                  <Badge className={`${getTypeColor(classItem.type)}`}>
                    {classItem.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.credits} Credits</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className={`text-sm font-bold ${getAttendanceColor(classItem.attendance)}`}>
                      {classItem.attendance}%
                    </span>
                  </div>
                  <Progress value={classItem.attendance} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Attended: {classItem.attendedClasses}</span>
                    <span>Total: {classItem.totalClasses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};