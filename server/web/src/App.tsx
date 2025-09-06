import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { QRModePage } from './pages/attendance/QRModePage';
import { ManualModePage } from './pages/attendance/ManualModePage';
import { HybridModePage } from './pages/attendance/HybridModePage';
import { LoginPage } from './pages/auth/LoginPage';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './constants';
import { Loading } from './components/ui/loading';
import { NotificationContainer } from './components/ui/notification';
import { ErrorBoundary } from './components/ui/error-boundary';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-all duration-300">
        <Loading size="lg" fullScreen />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="animate-in fade-in duration-300">
        <LoginPage />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="animate-in fade-in duration-300">
        <NotificationContainer />
        <Router>
        <Routes>
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
        </Routes>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;