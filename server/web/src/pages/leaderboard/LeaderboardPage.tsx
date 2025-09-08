import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Search, 
  Filter,
  Crown,
  Flame,
  Star,
  Users
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportUtils';
import { useAppStore } from '../../store';
import { MOCK_STUDENTS, COURSES } from '../../data/mockStudents';

interface Student {
  id: string;
  rank: number;
  name: string;
  studentId: string;
  class: string;
  attendance: number;
  streak: number;
  badges: number;
  points: number;
  lastActive: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  requirement: string;
}

export const LeaderboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('Current Semester');
  const { addNotification } = useAppStore();

  const topStudents: Student[] = MOCK_STUDENTS
    .filter(s => s.status === 'Active' && s.attendance)
    .sort((a, b) => (b.attendance || 0) - (a.attendance || 0))
    .slice(0, 20)
    .map((student, index) => ({
      id: student.id,
      rank: index + 1,
      name: student.name,
      studentId: student.studentId || student.rollNumber,
      class: student.course,
      attendance: student.attendance || 0,
      streak: Math.floor((student.attendance || 0) / 2) + Math.floor(Math.random() * 10),
      badges: Math.floor((student.attendance || 0) / 15) + Math.floor(Math.random() * 3),
      points: Math.floor((student.attendance || 0) * 25) + Math.floor(Math.random() * 200),
      lastActive: student.lastSeen || '2024-01-15'
    }));

  const achievements: Achievement[] = [
    { id: '1', name: 'Perfect Week', description: '100% attendance for a week', icon: <Trophy className="h-4 w-4" />, earned: true, requirement: '7 consecutive days' },
    { id: '2', name: 'Early Bird', description: 'Never late for 30 days', icon: <Award className="h-4 w-4" />, earned: true, requirement: '30 days punctuality' },
    { id: '3', name: 'Consistency King', description: '90%+ attendance for 3 months', icon: <Crown className="h-4 w-4" />, earned: false, progress: 65, requirement: '90 days at 90%+' },
    { id: '4', name: 'Class Champion', description: 'Top attendance in class', icon: <Medal className="h-4 w-4" />, earned: true, requirement: 'Rank #1 in class' },
    { id: '5', name: 'Streak Master', description: '50+ day attendance streak', icon: <Flame className="h-4 w-4" />, earned: false, progress: 80, requirement: '50 consecutive days' },
    { id: '6', name: 'Point Collector', description: 'Earn 2000+ points', icon: <Star className="h-4 w-4" />, earned: true, requirement: '2000 total points' }
  ];

  const filteredStudents = topStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600 dark:text-green-400';
    if (attendance >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground text-sm">Top performing students</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                exportToExcel(filteredStudents, 'leaderboard-rankings');
                addNotification({ message: 'Leaderboard exported successfully', type: 'success' });
              }}
            >
              <Filter className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <div className="text-2xl font-bold text-primary">{MOCK_STUDENTS.filter(s => s.status === 'Active').length}</div>
                </div>
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{topStudents[0]?.attendance}%</div>
                </div>
                <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(MOCK_STUDENTS.reduce((acc, s) => acc + (s.attendance || 0), 0) / MOCK_STUDENTS.length)}%</div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{topStudents.reduce((acc, s) => acc + s.badges, 0)}</div>
                </div>
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-10 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-1.5 border border-input bg-background rounded-md text-sm h-9"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="All">All Classes</option>
                  {COURSES.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
                <select 
                  className="px-3 py-1.5 border border-input bg-background rounded-md text-sm h-9"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="Current Semester">Current Semester</option>
                  <option value="This Month">This Month</option>
                  <option value="This Week">This Week</option>
                  <option value="All Time">All Time</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Trophy className="h-7 w-7 text-yellow-500" />
              Top Performers
            </CardTitle>
            <p className="text-muted-foreground">Celebrating our attendance champions</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-end justify-center gap-8 mb-8">
              {/* 2nd Place */}
              {topStudents[1] && (
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-xl p-6 mb-3 min-h-[120px] flex flex-col justify-end shadow-lg">
                    <Avatar className="mx-auto mb-3 ring-4 ring-gray-400 h-16 w-16">
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-lg font-bold">
                        {topStudents[1].name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Medal className="h-8 w-8 mx-auto text-gray-600" />
                  </div>
                  <h3 className="font-bold text-lg">{topStudents[1].name}</h3>
                  <p className="text-base text-muted-foreground font-semibold">{topStudents[1].attendance}%</p>
                  <Badge variant="secondary" className="text-sm mt-2 px-3 py-1">Silver Medal</Badge>
                </div>
              )}

              {/* 1st Place */}
              {topStudents[0] && (
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-xl p-8 mb-3 min-h-[150px] flex flex-col justify-end shadow-xl relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-yellow-300 rounded-full p-2">
                        <Crown className="h-6 w-6 text-yellow-700" />
                      </div>
                    </div>
                    <Avatar className="mx-auto mb-4 ring-4 ring-yellow-300 h-20 w-20">
                      <AvatarFallback className="bg-yellow-100 text-yellow-700 text-xl font-bold">
                        {topStudents[0].name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Crown className="h-10 w-10 mx-auto text-yellow-700" />
                  </div>
                  <h3 className="font-bold text-xl">{topStudents[0].name}</h3>
                  <p className="text-lg text-muted-foreground font-bold">{topStudents[0].attendance}%</p>
                  <Badge className="bg-yellow-500 text-yellow-900 mt-2 px-4 py-1 text-sm font-bold">🏆 Champion</Badge>
                </div>
              )}

              {/* 3rd Place */}
              {topStudents[2] && (
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-xl p-5 mb-3 min-h-[100px] flex flex-col justify-end shadow-lg">
                    <Avatar className="mx-auto mb-3 ring-4 ring-amber-500 h-14 w-14">
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-base font-bold">
                        {topStudents[2].name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Award className="h-7 w-7 mx-auto text-amber-700" />
                  </div>
                  <h3 className="font-bold text-base">{topStudents[2].name}</h3>
                  <p className="text-sm text-muted-foreground font-semibold">{topStudents[2].attendance}%</p>
                  <Badge variant="outline" className="text-sm mt-2 border-amber-500 text-amber-600 px-3 py-1">Bronze Medal</Badge>
                </div>
              )}
            </div>
            
            {/* Additional Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
              {topStudents.slice(0, 3).map((student, index) => (
                <div key={student.id} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{student.streak} days</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{student.points.toLocaleString()} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rankings Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Full Rankings</span>
                  <Badge variant="outline">{filteredStudents.length} students</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                      <TableHead className="text-center">Streak</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-center">
                            {getRankIcon(student.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.studentId} • {student.class}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-semibold ${getAttendanceColor(student.attendance)}`}>
                              {student.attendance}%
                            </span>
                            <Progress value={student.attendance} className="w-16 h-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="font-medium">{student.streak}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="font-medium">{student.points.toLocaleString()}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border ${
                    achievement.earned ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-muted/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400' : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">{achievement.requirement}</p>
                        {achievement.progress && !achievement.earned && (
                          <div className="mt-2">
                            <Progress value={achievement.progress} className="h-1" />
                            <p className="text-xs text-muted-foreground mt-1">{achievement.progress}% complete</p>
                          </div>
                        )}
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};