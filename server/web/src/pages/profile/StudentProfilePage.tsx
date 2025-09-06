import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Award, Users, BookOpen, CheckCircle, Star } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const certifications = [
    { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2024', verified: true },
    { name: 'Google Analytics Certified', issuer: 'Google', date: '2024', verified: true },
    { name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft', date: '2023', verified: false }
  ];

  const achievements = [
    { title: 'Perfect Attendance', description: '100% attendance for 3 consecutive months', icon: Award, color: 'text-yellow-600' },
    { title: 'Dean\'s List', description: 'Academic excellence recognition', icon: Star, color: 'text-purple-600' },
    { title: 'Coding Champion', description: 'Winner of inter-college programming contest', icon: BookOpen, color: 'text-blue-600' }
  ];

  const activities = [
    { role: 'President', organization: 'Computer Science Society', period: '2024-Present', type: 'Leadership' },
    { role: 'Team Lead', organization: 'Hackathon Club', period: '2023-2024', type: 'Technical' },
    { role: 'Volunteer', organization: 'Tech for Good Initiative', period: '2023-Present', type: 'Community' },
    { role: 'Member', organization: 'Debate Society', period: '2022-Present', type: 'Cultural' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your personal information and achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">AK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">Alex Kumar</h2>
                    <p className="text-muted-foreground">@alex.kumar</p>
                    <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Student
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">alex.kumar@university.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Mumbai, Maharashtra</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined September 2022</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                  <p className="font-medium">IT-2022-001</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Program</p>
                  <p className="font-medium">BTech - Information Technology</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="font-medium">3rd Year</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                  <p className="font-medium text-green-600">8.7/10.0</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className={`p-2 rounded-full bg-background ${achievement.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Verified Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                    </div>
                    <Badge className={cert.verified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }>
                      {cert.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Extracurricular & Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.role}</h4>
                      <p className="text-sm text-muted-foreground">{activity.organization}</p>
                      <p className="text-xs text-muted-foreground">{activity.period}</p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
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