import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { X, QrCode, UserCheck, Zap, Calendar, Clock, Users, BookOpen, ArrowRight, CheckCircle, User, MapPin, FileText, Timer, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAppStore } from '../../store';

interface TakeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Class {
  id: string;
  name: string;
  code?: string;
  course?: { name: string; code: string };
  currentEnrollment: number;
  room?: string;
  maxCapacity?: number;
  faculty?: { user: { name: string } };
  schedules?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
  }>;
}

interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ isOpen, onClose }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [sessionType, setSessionType] = useState('Lecture');
  const [selectedMode, setSelectedMode] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [classes, setClasses] = useState<Class[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Additional form fields
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [conductedBy, setConductedBy] = useState('');
  const [plannedTopic, setPlannedTopic] = useState('');
  const [planningStatus, setPlanningStatus] = useState('planned');
  const [targetLearning, setTargetLearning] = useState('');
  const [tgLevel, setTgLevel] = useState('');
  
  const { addNotification } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      loadData();
      setCurrentStep(1);
      setSelectedClass('');
      setSessionType('Lecture');
      setSelectedMode('');
      setLocation('');
      setNotes('');
      setConductedBy('');
      setPlannedTopic('');
      setPlanningStatus('planned');
      setTargetLearning('');
      setTgLevel('');
    }
  }, [isOpen]);

  // Auto-fill location from selected class and conducted by from current user
  useEffect(() => {
    const selectedClassData = classes.find(c => c.id === selectedClass);
    if (selectedClassData?.room && !location) {
      setLocation(selectedClassData.room);
    }
  }, [selectedClass, classes, location]);

  useEffect(() => {
    if (currentUser?.name && !conductedBy) {
      setConductedBy(currentUser.name);
    }
  }, [currentUser, conductedBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [classesResponse, userResponse] = await Promise.all([
        apiService.get<Class[]>('/classes'),
        apiService.get<User>('/auth/me')
      ]);
      
      if (classesResponse.success && classesResponse.data) {
        setClasses(classesResponse.data);
      } else {
        // Fallback data
        setClasses([
          {
            id: '1',
            name: 'CS101-A',
            code: 'CS101',
            course: { name: 'Introduction to Computer Science', code: 'CS101' },
            currentEnrollment: 45,
            maxCapacity: 50,
            room: 'Room 101',
            faculty: { user: { name: 'Dr. Smith' } }
          },
          {
            id: '2',
            name: 'CS201-B', 
            code: 'CS201',
            course: { name: 'Data Structures', code: 'CS201' },
            currentEnrollment: 38,
            maxCapacity: 45,
            room: 'Room 205',
            faculty: { user: { name: 'Dr. Johnson' } }
          }
        ]);
      }
      
      if (userResponse.success && userResponse.data) {
        setCurrentUser(userResponse.data);
      } else {
        setCurrentUser({
          id: '1',
          name: 'Dr. John Smith',
          role: 'staff',
          email: 'john.smith@university.edu'
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      addNotification({ message: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const sessionTypes = [
    'Lecture',
    'Lab',
    'Tutorial', 
    'Seminar',
    'Workshop',
    'Exam',
    'Quiz',
    'Presentation'
  ];

  const planningStatuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const tgLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced',
    '1st Year',
    '2nd Year',
    '3rd Year',
    'Final Year'
  ];

  // Sample topics - these could come from database
  const sampleTopics = [
    'Boolean Algebra',
    'K-Maps and Logic Simplification',
    'Sorting Algorithms',
    'Data Structures - Arrays',
    'Mathematical Induction',
    'Digital Logic Gates',
    'Object-Oriented Programming',
    'Database Normalization'
  ];
  
  const attendanceModes = [
    {
      id: 'qr',
      title: 'QR Code Mode',
      description: 'Students scan QR code with their mobile devices',
      icon: QrCode,
      color: 'blue',
      features: ['Real-time scanning', 'Mobile app required', 'Automatic marking']
    },
    {
      id: 'manual',
      title: 'Manual Mode', 
      description: 'Mark attendance manually from student list',
      icon: UserCheck,
      color: 'green',
      features: ['Full control', 'No mobile app needed', 'Bulk operations']
    },
    {
      id: 'hybrid',
      title: 'Hybrid Mode',
      description: 'Combine QR scanning with manual adjustments',
      icon: Zap,
      color: 'purple', 
      features: ['Best of both worlds', 'Flexible workflow', 'Review & edit']
    }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProceed = async () => {
    if (!selectedClass || !sessionType || !selectedMode) {
      addNotification({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      
      const sessionData = {
        classId: selectedClass,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toTimeString().slice(0, 5),
        endTime: new Date(Date.now() + 90 * 60000).toTimeString().slice(0, 5),
        location: location || undefined,
        notes: notes || undefined,
        sessionType: sessionType,
        conductedBy: conductedBy || undefined,
        plannedTopic: plannedTopic || undefined,
        planningStatus: planningStatus,
        targetLearning: targetLearning || undefined,
        tgLevel: tgLevel || undefined
      };

      const response = await apiService.post<{id: string}>('/attendance/sessions', sessionData);
      
      if (response.success && response.data) {
        addNotification({ message: 'Attendance session created successfully', type: 'success' });
        onClose();
        // Navigate based on selected mode
        window.location.href = `/attendance/${selectedMode}/${response.data.id}`;
      } else {
        addNotification({ message: response.message || 'Failed to create session', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      addNotification({ message: 'Failed to create session', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const canProceedStep1 = selectedClass && sessionType;
  const canProceedStep3 = selectedMode;
  
  // Memoized filtered classes for better performance
  const filteredClasses = useMemo(() => {
    // Admin can see all classes, staff only classes with students
    if (currentUser?.role === 'admin') {
      return classes;
    }
    return classes.filter(cls => cls.currentEnrollment > 0);
  }, [classes, currentUser?.role]);
  
  // Validation warnings
  const warnings = useMemo(() => {
    const warns = [];
    if (selectedClassData) {
      if (selectedClassData.currentEnrollment === 0) {
        warns.push('This class has no enrolled students');
      }
      if (selectedClassData.maxCapacity && selectedClassData.currentEnrollment > selectedClassData.maxCapacity) {
        warns.push('Class is over capacity');
      }
    }
    return warns;
  }, [selectedClassData]);
  
  const stepTitles = [
    'Class & Session Details',
    'Session Overview', 
    'Choose Attendance Mode'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl min-h-[90vh] sm:min-h-0 sm:max-h-[90vh] overflow-hidden border my-4 sm:my-0">
        {/* Header with Progress */}
        <div className="relative">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold">Setup Attendance</h2>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-muted/20">
            <div className="flex items-center justify-center sm:justify-between mb-2">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep > index + 1 ? 'bg-green-500 text-white' :
                    currentStep === index + 1 ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > index + 1 ? <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3" /> : index + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${
                    currentStep === index + 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {title}
                  </span>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-4 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-1 sm:h-1.5" />
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)] sm:max-h-none">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : (
            <>
              {/* Step 1: Class Selection */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {currentUser && (
                    <div className="bg-muted/20 rounded p-2 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Instructor:</span>
                        <span className="text-xs">{currentUser.name}</span>
                        <Badge variant="outline" className="text-xs px-1 py-0">{currentUser.role}</Badge>
                        {currentUser.email && (
                          <span className="text-xs text-muted-foreground">({currentUser.email})</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Class <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full p-3 border rounded text-sm focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Class</option>
                        {filteredClasses.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.course?.name || cls.name} ({cls.currentEnrollment} students)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Session Type <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={sessionType} 
                        onChange={(e) => setSessionType(e.target.value)}
                        className="w-full p-3 border rounded text-sm focus:ring-2 focus:ring-primary"
                      >
                        {sessionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Location
                      </label>
                      <Input 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={selectedClassData?.room || "Enter location"}
                        className="text-sm p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Notes
                      </label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Optional session notes..."
                        className="w-full p-3 border rounded text-sm resize-none focus:ring-2 focus:ring-primary"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Conducted By
                        </label>
                        <Input 
                          value={conductedBy}
                          onChange={(e) => setConductedBy(e.target.value)}
                          placeholder="Who is conducting this session"
                          className="text-sm p-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          Planned Topic
                        </label>
                        <select 
                          value={plannedTopic} 
                          onChange={(e) => setPlannedTopic(e.target.value)}
                          className="w-full p-3 border rounded text-sm focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Topic</option>
                          {sampleTopics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Planning Status
                        </label>
                        <select 
                          value={planningStatus} 
                          onChange={(e) => setPlanningStatus(e.target.value)}
                          className="w-full p-3 border rounded text-sm focus:ring-2 focus:ring-primary"
                        >
                          {planningStatuses.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Target Level
                        </label>
                        <select 
                          value={tgLevel} 
                          onChange={(e) => setTgLevel(e.target.value)}
                          className="w-full p-3 border rounded text-sm focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Level</option>
                          {tgLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Target Learning
                      </label>
                      <textarea 
                        value={targetLearning}
                        onChange={(e) => setTargetLearning(e.target.value)}
                        placeholder="Expected learning outcome of this session..."
                        className="w-full p-3 border rounded text-sm resize-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                    </div>

                    {warnings.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                        {warnings.map((warning, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                            <AlertCircle className="h-4 w-4" />
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Session Overview */}
              {currentStep === 2 && selectedClassData && (
                <div className="space-y-4">
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{selectedClassData.course?.name || selectedClassData.name}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Class</p>
                            <p className="font-medium">{selectedClassData.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium">{sessionType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Students</p>
                            <p className="font-medium">{selectedClassData.currentEnrollment}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{location || selectedClassData.room || 'TBD'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Instructor</p>
                            <p className="font-medium">{currentUser?.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium">{new Date().toLocaleDateString()}</p>
                          </div>
                          {conductedBy && (
                            <div>
                              <p className="text-muted-foreground">Conducted By</p>
                              <p className="font-medium">{conductedBy}</p>
                            </div>
                          )}
                          {plannedTopic && (
                            <div>
                              <p className="text-muted-foreground">Planned Topic</p>
                              <p className="font-medium">{plannedTopic}</p>
                            </div>
                          )}
                          {planningStatus && (
                            <div>
                              <p className="text-muted-foreground">Planning Status</p>
                              <p className="font-medium">{planningStatuses.find(s => s.value === planningStatus)?.label}</p>
                            </div>
                          )}
                          {tgLevel && (
                            <div>
                              <p className="text-muted-foreground">TG Level</p>
                              <p className="font-medium">{tgLevel}</p>
                            </div>
                          )}
                        </div>
                        {targetLearning && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-muted-foreground text-sm">Target Learning</p>
                            <p className="font-medium text-sm">{targetLearning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 3: Attendance Mode Selection */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-1">Choose Attendance Mode</h3>
                    <p className="text-muted-foreground text-sm">Select how you want to take attendance for this session</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {attendanceModes.map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = selectedMode === mode.id;
                      return (
                        <Card 
                          key={mode.id}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50'
                          }`}
                          onClick={() => setSelectedMode(mode.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                mode.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                                mode.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                              }`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{mode.title}</h4>
                                <p className="text-xs text-muted-foreground">{mode.description}</p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 p-3 sm:p-4 border-t">
          <div className="flex gap-2 order-2 sm:order-1">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} size="sm" className="flex-1 sm:flex-none">
                Back
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} size="sm" className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </div>
          
          <div className="order-1 sm:order-2">
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 ? !canProceedStep1 : false}
                size="sm"
                className="w-full sm:w-auto"
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleProceed}
                disabled={!canProceedStep3 || submitting}
                size="sm"
                className="w-full sm:w-auto min-w-[120px]"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Start Session'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};