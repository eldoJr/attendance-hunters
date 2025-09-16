import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import QRCode from 'react-qr-code';
import { RefreshCw, Smartphone, QrCode, CheckCircle, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/api';

export const QRModePage: React.FC = () => {
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [sessionActive, setSessionActive] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, late: 0, absent: 0, total: 0 });
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSessionData = async () => {
      const currentSessionId = localStorage.getItem('currentSessionId');
      setSessionId(currentSessionId);
      
      if (currentSessionId) {
        try {
          const response = await apiService.getAttendanceSession(currentSessionId);
          if (response.success && response.data) {
            setSessionData(response.data);
            setAttendanceStats({
              present: response.data.presentCount || 0,
              late: response.data.lateCount || 0,
              absent: response.data.absentCount || 0,
              total: response.data.totalStudents || 0
            });
          }
        } catch (error) {
          console.error('Failed to load session data:', error);
        }
      }
      
      generateQRCode();
    };
    
    loadSessionData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeLeft]);

  const generateQRCode = () => {
    const qrData = {
      sessionId: sessionId || 'temp-session',
      classId: sessionData?.classId || 'unknown',
      className: sessionData?.class?.name || 'Unknown Class',
      sessionType: sessionData?.sessionType || 'lecture',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      expires: Date.now() + (300 * 1000),
      url: `${window.location.origin}/attendance/scan/${sessionId || 'temp'}`
    };
    setQrValue(JSON.stringify(qrData));
    setSessionActive(true);
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="w-full px-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/attendance/take')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold mb-1">QR Code Attendance Mode</h1>
            <p className="text-muted-foreground text-sm">Students scan QR code with mobile app</p>
            {sessionData && (
              <Card className="mt-3 bg-primary/5 border-primary/20 max-w-md mx-auto">
                <CardContent className="p-3">
                  <div className="text-sm">
                    <strong>{sessionData.class?.name || 'Unknown Class'}</strong> • {sessionData.sessionType || 'Lecture'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(sessionData.date).toLocaleDateString()} • {sessionData.startTime}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-green-600">{attendanceStats.present}</div>
              <div className="text-xs text-green-600">Present</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-yellow-600">{attendanceStats.late}</div>
              <div className="text-xs text-yellow-600">Late</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-red-600">{attendanceStats.absent}</div>
              <div className="text-xs text-red-600">Absent</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-600">
                {attendanceStats.total > 0 ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-blue-600">Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Live QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-6 bg-white rounded-lg inline-block">
                {qrValue && <QRCode value={qrValue} size={180} />}
              </div>
              
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                  {formatTime(timeLeft)}
                </div>
                <Badge className={sessionActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                  {sessionActive ? 'Active Session' : 'Session Expired'}
                </Badge>
              </div>

              <Button onClick={generateQRCode}>
                Regenerate QR
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentScans.length > 0 ? (
                  recentScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{scan.studentName}</div>
                        <div className="text-xs text-muted-foreground">{scan.timestamp}</div>
                      </div>
                      <Badge className={scan.status === 'present' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {scan.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Waiting for QR scans...</p>
                    <p className="text-xs mt-1">Students will appear here as they scan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={() => setShowSaveModal(true)}>
            Save Attendance ({attendanceStats.present + attendanceStats.late}/{attendanceStats.total})
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg h-32 flex flex-col justify-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1 text-sm">Step 1: Open App</h3>
                <p className="text-xs text-muted-foreground">Launch mobile app</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg h-32 flex flex-col justify-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-1 text-sm">Step 2: Scan QR</h3>
                <p className="text-xs text-muted-foreground">Point camera at QR code</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg h-32 flex flex-col justify-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-1 text-sm">Step 3: Confirm</h3>
                <p className="text-xs text-muted-foreground">Attendance marked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Attendance Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Save Attendance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save attendance for <strong>{attendanceStats.present + attendanceStats.late}</strong> present and <strong>{attendanceStats.absent}</strong> absent students?
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  setSaving(true);
                  try {
                    if (sessionId) {
                      await apiService.completeAttendanceSession(sessionId);
                    }
                    setShowSaveModal(false);
                    navigate('/attendance', { 
                      state: { 
                        message: `QR attendance saved successfully! ${attendanceStats.present + attendanceStats.late} present, ${attendanceStats.absent} absent.` 
                      }
                    });
                  } catch (error) {
                    console.error('Failed to save attendance:', error);
                    alert('Failed to save attendance. Please try again.');
                  } finally {
                    setSaving(false);
                  }
                }}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};