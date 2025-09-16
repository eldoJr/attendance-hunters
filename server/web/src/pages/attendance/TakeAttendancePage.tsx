import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Loading } from '../../components/ui/loading';
import { ArrowLeft, Users, MapPin, FileText, Clock, CheckCircle, QrCode, Zap } from 'lucide-react';
import { apiService } from '../../services/api';

interface Class {
  id: string;
  name: string;
  code: string;
  department: string | { name: string };
  studentCount: number;
  schedule?: string;
  faculty?: { user: { name: string } };
}

interface AttendanceData {
  classId: string;
  location: string;
  notes: string;
  sessionType: 'lecture' | 'lab' | 'tutorial' | 'exam';
  conductedBy: string;
  plannedTopic: string;
  planningStatus: 'planned' | 'in_progress' | 'completed';
  targetLearning: string;
  tgLevel: string;
}

const TakeAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    classId: '',
    location: '',
    notes: '',
    sessionType: 'lecture',
    conductedBy: '',
    plannedTopic: '',
    planningStatus: 'planned',
    targetLearning: '',
    tgLevel: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiService.get('/auth/me');
      if (response.success && response.data) {
        setCurrentUser(response.data);
        setAttendanceData(prev => ({ ...prev, conductedBy: (response.data as any).name || '' }));
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<Class[]>('/classes');
      if (response.success && response.data) {
        const classesData = (response.data as any[]).map((cls: any) => ({
          id: cls.id,
          name: cls.name || cls.course?.name || 'Unknown Class',
          code: cls.code || cls.course?.code || 'N/A',
          department: cls.department?.name || cls.course?.department || 'Unknown Department',
          studentCount: cls.currentEnrollment || cls._count?.enrollments || 0,
          schedule: cls.schedule || undefined,
          faculty: cls.faculty || undefined
        }));
        setClasses(classesData);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classItem: Class) => {
    setSelectedClass(classItem);
    setAttendanceData(prev => ({ ...prev, classId: classItem.id }));
    setStep(2);
  };

  const handleCreateSession = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      
      const now = new Date();
      const endTime = new Date(now.getTime() + 90 * 60000);
      
      // Format date as YYYY-MM-DD
      const today = new Date();
      const dateStr = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');
      
      const sessionPayload = {
        classId: attendanceData.classId,
        date: dateStr,
        startTime: now.toTimeString().slice(0, 8), // HH:MM:SS format
        endTime: endTime.toTimeString().slice(0, 8), // HH:MM:SS format
        sessionType: attendanceData.sessionType,
        location: attendanceData.location || null,
        notes: attendanceData.notes || null,
        conductedBy: attendanceData.conductedBy || null,
        plannedTopic: attendanceData.plannedTopic || null,
        planningStatus: attendanceData.planningStatus,
        targetLearning: attendanceData.targetLearning || null,
        tgLevel: attendanceData.tgLevel || null
      };
      
      console.log('Creating session with payload:', sessionPayload);
      
      const response = await apiService.post('/attendance/sessions', sessionPayload);
      
      if (response.success) {
        localStorage.setItem('currentSessionId', (response.data as any)?.id || 'temp-session');
        setStep(4);
      } else {
        console.error('Session creation failed:', response.message);
        const errorMsg = response.message || 'Unknown error';
        if (errorMsg.includes('Validation failed')) {
          alert('Please check your input data. Make sure you are logged in and have the proper permissions.');
        } else {
          alert('Failed to create session: ' + errorMsg);
        }
      }
    } catch (error: any) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((stepNum) => (
        <React.Fragment key={stepNum}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
          </div>
          {stepNum < 4 && (
            <div className={`w-12 h-0.5 transition-colors ${step > stepNum ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderClassSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Class</h2>
        <p className="text-muted-foreground">Choose the class for attendance session</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : (
        <div className="grid gap-4">
          {classes.map((classItem) => (
            <Card
              key={classItem.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/30 hover:bg-primary/5"
              onClick={() => handleClassSelect(classItem)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                      <Badge variant="secondary">{classItem.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{typeof classItem.department === 'string' ? classItem.department : (classItem.department as any)?.name || 'Unknown Department'}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {classItem.studentCount} students
                      </span>
                      {classItem.schedule && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.schedule}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderSessionDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Session Details</h2>
        <p className="text-muted-foreground">Configure your attendance session</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Selected Class</h3>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div>
                <p className="font-medium text-foreground">{selectedClass?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedClass?.code} • {typeof selectedClass?.department === 'string' ? selectedClass?.department : (selectedClass?.department as any)?.name || 'Unknown Department'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Session Type
              </label>
              <select
                value={attendanceData.sessionType}
                onChange={(e) => setAttendanceData(prev => ({ 
                  ...prev, 
                  sessionType: e.target.value as AttendanceData['sessionType']
                }))}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              >
                <option value="lecture">Lecture</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <Input
                value={attendanceData.location}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter session location"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Staff Name
              </label>
              <Input
                value={selectedClass?.faculty?.user?.name || 'Not assigned'}
                readOnly
                className="w-full bg-muted/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conducted By
              </label>
              <Input
                value={attendanceData.conductedBy}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, conductedBy: e.target.value }))}
                placeholder="Who is conducting this session"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Planned Topic
              </label>
              <select
                value={attendanceData.plannedTopic}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, plannedTopic: e.target.value }))}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              >
                <option value="">Select Topic</option>
                <option value="Boolean Algebra">Boolean Algebra</option>
                <option value="K-Maps and Logic Simplification">K-Maps and Logic Simplification</option>
                <option value="Sorting Algorithms">Sorting Algorithms</option>
                <option value="Data Structures - Arrays">Data Structures - Arrays</option>
                <option value="Mathematical Induction">Mathematical Induction</option>
                <option value="Digital Logic Gates">Digital Logic Gates</option>
                <option value="Object-Oriented Programming">Object-Oriented Programming</option>
                <option value="Database Normalization">Database Normalization</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Planning Status
              </label>
              <select
                value={attendanceData.planningStatus}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, planningStatus: e.target.value as AttendanceData['planningStatus'] }))}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Level
              </label>
              <select
                value={attendanceData.tgLevel}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, tgLevel: e.target.value }))}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Learning
              </label>
              <textarea
                value={attendanceData.targetLearning}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, targetLearning: e.target.value }))}
                placeholder="Expected learning outcome of this session..."
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                value={attendanceData.notes}
                onChange={(e) => setAttendanceData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Optional session notes..."
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/attendance')}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setStep(3)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );

  const renderModeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Attendance Mode</h2>
        <p className="text-muted-foreground">Select how you want to take attendance</p>
      </div>

      <div className="grid gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/30 hover:bg-primary/5"
          onClick={() => {
            handleCreateSession();
            navigate('/attendance/qr-mode');
          }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">QR Code Mode</h3>
              <p className="text-sm text-muted-foreground">Students scan QR code to mark attendance</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/30 hover:bg-primary/5"
          onClick={() => {
            handleCreateSession();
            navigate('/attendance/manual-mode');
          }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Manual Mode</h3>
              <p className="text-sm text-muted-foreground">Manually mark attendance for each student</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/30 hover:bg-primary/5"
          onClick={() => {
            handleCreateSession();
            navigate('/attendance/hybrid-mode');
          }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Hybrid Mode</h3>
              <p className="text-sm text-muted-foreground">Combine QR code and manual attendance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(2)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/attendance')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Session Created!</h2>
        <p className="text-muted-foreground">Your attendance session has been created successfully</p>
      </div>
      <Button onClick={() => navigate('/attendance')} className="w-full">
        Go to Attendance
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/attendance')}
              className="flex items-center gap-2 hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Attendance
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Take Attendance</h1>
              <p className="text-muted-foreground">Create a new attendance session</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2"
          >
            Cancel
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {step < 4 && renderStepIndicator()}

          <Card className="shadow-sm">
            <CardContent className="p-6">
              {loading && step !== 1 ? (
                <div className="text-center py-8">
                  <Loading />
                  <p className="text-muted-foreground mt-4">Creating session...</p>
                </div>
              ) : (
                <>
                  {step === 1 && renderClassSelection()}
                  {step === 2 && renderSessionDetails()}
                  {step === 3 && renderModeSelection()}
                  {step === 4 && renderSuccess()}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export { TakeAttendancePage };
export default TakeAttendancePage;