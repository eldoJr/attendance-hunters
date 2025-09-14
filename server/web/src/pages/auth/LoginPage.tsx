import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Target, Mail, Lock, Eye, EyeOff, AlertCircle, Users, UserCheck } from 'lucide-react';
import { useAppStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/icons/logo.png';

type UserRole = 'staff' | 'student';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const { addNotification } = useAppStore();
  const { login } = useAuth();




  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const user = await login(email, password, activeRole);
      addNotification({ message: `Welcome back, ${user.firstName || user.name || activeRole}!`, type: 'success' });
      const destination = activeRole === 'staff' ? '/staff-dashboard' : '/student-dashboard';
      window.location.href = destination;
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
      addNotification({ message: 'Invalid credentials. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-slate-900 dark:via-background dark:to-slate-800 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-sm md:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full mb-3 md:mb-4">
            <img src={logo} alt="Logo" className="h-12 w-12 md:h-16 md:w-16 object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Attendance Hunters</h1>
          <p className="text-sm md:text-base text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Role Tabs */}
        <div className="flex mb-4 md:mb-6 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveRole('student')}
            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors ${
              activeRole === 'student'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            Student
          </button>
          <button
            onClick={() => setActiveRole('staff')}
            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors ${
              activeRole === 'staff'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCheck className="h-3 w-3 md:h-4 md:w-4" />
            Staff
          </button>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4 md:pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl">
              Welcome Back
              <Badge variant="outline" className="ml-2 text-xs">
                {activeRole === 'student' ? 'Student' : 'Staff'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <label className="text-xs md:text-sm font-medium">
                  {activeRole === 'student' ? 'Student Email' : 'Staff Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-xs md:text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-10 md:h-11 text-sm md:text-base" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  `Sign In as ${activeRole === 'student' ? 'Student' : 'Staff'}`
                )}
              </Button>
            </form>

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-xs md:text-sm text-muted-foreground">
                Administrator?{' '}
                <a href="/admin" className="text-primary hover:underline">
                  Admin Login
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};