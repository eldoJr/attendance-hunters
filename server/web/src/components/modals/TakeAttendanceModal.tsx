import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { X, QrCode, UserCheck, Zap, Calendar, Clock, Users, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { COURSES } from '../../data/mockStudents';

interface TakeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'scanner' | 'attendance';
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ isOpen, onClose, initialMode = 'attendance' }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [currentStep, setCurrentStep] = useState(1);


  const courses = COURSES;
  const sections = ['A', 'B', 'C', 'D'];
  const sessionTypes = ['Lecture', 'Lab', 'Tutorial', 'Seminar'];

  const attendanceModes = [
    {
      id: 'qr',
      title: 'QR Code Mode',
      description: 'Students scan QR code with their mobile devices',
      icon: QrCode,
      color: 'blue',
      features: ['Real-time scanning', 'Mobile app required', 'Automatic marking'],
      route: '/attendance/qr-mode'
    },
    {
      id: 'manual',
      title: 'Manual Mode', 
      description: 'Mark attendance manually from student list',
      icon: UserCheck,
      color: 'green',
      features: ['Full control', 'No mobile app needed', 'Bulk operations'],
      route: '/attendance/manual-mode'
    },
    {
      id: 'hybrid',
      title: 'Hybrid Mode',
      description: 'Combine QR scanning with manual adjustments',
      icon: Zap,
      color: 'purple', 
      features: ['Best of both worlds', 'Flexible workflow', 'Review & edit'],
      route: '/attendance/hybrid-mode'
    }
  ];

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProceed = () => {
    if (!selectedCourse || !selectedSection || !sessionType || !selectedMode) return;
    
    const selectedModeData = attendanceModes.find(mode => mode.id === selectedMode);
    if (selectedModeData) {
      const sessionData = {
        courseId: selectedCourse,
        section: selectedSection,
        sessionType,
        timestamp: Date.now(),
        courseName: courses.find(c => c.id === selectedCourse)?.name
      };
      localStorage.setItem('attendanceSession', JSON.stringify(sessionData));
      window.location.href = selectedModeData.route;
    }
  };

  const canProceedStep1 = selectedCourse && selectedSection && sessionType;
  const canProceedStep3 = selectedMode;

  useEffect(() => {
    if (selectedCourse && selectedSection && sessionType && currentStep === 1) {
      setTimeout(() => handleNext(), 300);
    }
  }, [selectedCourse, selectedSection, sessionType, currentStep, handleNext]);

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  if (!isOpen) return null;

  const stepTitles = [
    'Course & Session Details',
    'Session Overview',
    'Choose Attendance Mode'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border">
        {/* Header with Progress */}
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Setup Attendance Session</h2>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="px-4 py-3 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep > index + 1 ? 'bg-green-500 text-white' :
                    currentStep === index + 1 ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > index + 1 ? <CheckCircle className="h-3 w-3" /> : index + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    currentStep === index + 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {title}
                  </span>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-1.5" />
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Course Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-1">Select Course & Session Details</h3>
                <p className="text-muted-foreground text-sm">Choose the course and configure your attendance session</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Course
                  </label>
                  <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background text-sm"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.students} students)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Section
                  </label>
                  <select 
                    value={selectedSection} 
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background text-sm disabled:opacity-50"
                    disabled={!selectedCourse}
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Session Type
                  </label>
                  <select 
                    value={sessionType} 
                    onChange={(e) => setSessionType(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background text-sm disabled:opacity-50"
                    disabled={!selectedCourse}
                  >
                    <option value="">Select Type</option>
                    {sessionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date & Time</label>
                  <Input 
                    value={new Date().toLocaleString()} 
                    readOnly 
                    className="p-3 bg-muted/50 border rounded-lg text-sm" 
                  />
                </div>
              </div>

              {canProceedStep1 && (
                <Card className="p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-300">Ready to proceed</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">All required fields completed</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Session Overview */}
          {currentStep === 2 && selectedCourseData && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-1">Session Overview</h3>
                <p className="text-muted-foreground text-sm">Review your session details before proceeding</p>
              </div>
              
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{selectedCourseData.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{selectedCourseData.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Section</p>
                        <p className="font-medium">Section {selectedSection}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Session Type</p>
                        <p className="font-medium">{sessionType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-medium">{selectedCourseData.students} enrolled</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Ready
                  </Badge>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {attendanceModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;
                  return (
                    <Card 
                      key={mode.id}
                      className={`cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedMode(mode.id)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center ${
                            mode.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                            mode.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                            'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{mode.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{mode.description}</p>
                            <div className="space-y-1">
                              {mode.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                  <CheckCircle className="h-2.5 w-2.5 text-green-500" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} size="sm">
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={onClose} size="sm">
                Cancel
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === 1 ? !canProceedStep1 : false}
                  size="sm"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleProceed}
                  disabled={!canProceedStep3}
                  size="sm"
                >
                  Start Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};