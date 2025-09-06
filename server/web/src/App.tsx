import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { ClassesPage } from './pages/classes/ClassesPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { FacultyPage } from './pages/faculty/FacultyPage';
import { DepartmentsPage } from './pages/departments/DepartmentsPage';
import { CalendarPage } from './pages/calendar/CalendarPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentSchedulePage } from './pages/calendar/StudentSchedulePage';
import { StudentClassesPage } from './pages/classes/StudentClassesPage';
import { StudentAttendancePage } from './pages/attendance/StudentAttendancePage';
import { StudentProfilePage } from './pages/profile/StudentProfilePage';
import { QRModePage } from './pages/attendance/QRModePage';
import { ManualModePage } from './pages/attendance/ManualModePage';
import { HybridModePage } from './pages/attendance/HybridModePage';
import { LoginPage } from './pages/auth/LoginPage';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './constants';
import { Loading } from './components/ui/loading';
import { NotificationContainer } from './components/ui/notification';
import { ErrorBoundary } from './components/ui/error-boundary';

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-all duration-300">
        <Loading size="lg" fullScreen />
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Routes - only when not authenticated */}
      {!isAuthenticated && (
        <>
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
      
      {/* Authenticated Routes */}
      {isAuthenticated && (
        <>
          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path="/admin" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
              <Route path={ROUTES.CLASSES} element={<ClassesPage />} />
              <Route path={ROUTES.STUDENTS} element={<StudentsPage />} />
              <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
              <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/attendance/qr-mode" element={<QRModePage />} />
              <Route path="/attendance/manual-mode" element={<ManualModePage />} />
              <Route path="/attendance/hybrid-mode" element={<HybridModePage />} />
            </>
          )}
          
          {/* Staff Routes */}
          {user?.role === 'staff' && (
            <>
              <Route path="/" element={<Navigate to="/staff-dashboard" replace />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
              <Route path={ROUTES.CLASSES} element={<ClassesPage />} />
              <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            </>
          )}
          
          {/* Student Routes */}
          {user?.role === 'student' && (
            <>
              <Route path="/" element={<Navigate to="/student-dashboard" replace />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path={ROUTES.ATTENDANCE} element={<StudentAttendancePage />} />
              <Route path="/calendar" element={<StudentSchedulePage />} />
              <Route path={ROUTES.CLASSES} element={<StudentClassesPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />
              <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
            </>
          )}
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="animate-in fade-in duration-300">
          <NotificationContainer />
          <AppContent />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;