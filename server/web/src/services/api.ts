const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Students API
  async getStudents(): Promise<any[]> {
    try {
      return await this.request<any[]>('/students');
    } catch (error) {
      return this.getFallbackStudents();
    }
  }

  // Departments API
  async getDepartments(): Promise<any[]> {
    try {
      return await this.request<any[]>('/departments');
    } catch (error) {
      return this.getFallbackDepartments();
    }
  }

  // Courses API
  async getCourses(): Promise<any[]> {
    try {
      return await this.request<any[]>('/courses');
    } catch (error) {
      return this.getFallbackCourses();
    }
  }

  // Calendar API
  async getCalendarEvents(): Promise<any[]> {
    try {
      return await this.request<any[]>('/calendar/events');
    } catch (error) {
      return this.getFallbackCalendarEvents();
    }
  }

  // Attendance API
  async getAttendanceRecords(): Promise<any[]> {
    return await this.request<any[]>('/attendance/records');
  }

  async createAttendanceSession(sessionData: any): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.post('/attendance/sessions', sessionData);
  }

  async getAttendanceSession(sessionId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.get(`/attendance/sessions/${sessionId}`);
  }

  async markAttendance(recordData: any): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.post('/attendance/records', recordData);
  }

  async completeAttendanceSession(sessionId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.post(`/attendance/sessions/${sessionId}/complete`, {});
  }

  // Classes API
  async getClasses(): Promise<any[]> {
    try {
      return await this.request<any[]>('/classes');
    } catch (error) {
      return this.getFallbackClasses();
    }
  }

  // Auth API
  async getCurrentUser(): Promise<any> {
    try {
      return await this.request<any>('/auth/me');
    } catch (error) {
      return this.getFallbackUser();
    }
  }

  // Dashboard API
  async getDashboardStats(): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.get('/dashboard/stats');
  }

  // Analytics API
  async getAnalyticsOverview(): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.get('/analytics/overview');
  }

  async getStudentPerformance(studentId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.get(`/analytics/student/${studentId}`);
  }

  async getClassAnalytics(classId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    return await this.get(`/analytics/class/${classId}`);
  }

  // Auth API methods
  async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, message: data.message || `HTTP error! status: ${response.status}` };
      }

      return { success: true, data: data.data || data, message: data.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, message: data.message || `HTTP error! status: ${response.status}` };
      }

      return { success: true, data: data.data, message: data.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      const data = await this.request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async delete<T>(endpoint: string): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      const data = await this.request<T>(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Token management methods
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Fallback data methods
  private getFallbackStudents() {
    return Array.from({ length: 30 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      studentId: `STU${String(i + 1).padStart(3, '0')}`,
      class: `Class ${Math.floor(i / 10) + 1}`,
      section: ['A', 'B', 'C'][i % 3],
      year: Math.floor(i / 10) + 1,
      department: ['Computer Science & Engineering', 'Electronics Engineering'][i % 2],
      attendance: Math.floor(Math.random() * 40) + 60,
      status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)] as 'Active' | 'Inactive',
      lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      enrollmentDate: '2024-01-10',
      gpa: Math.round((Math.random() * 2 + 2) * 10) / 10
    }));
  }

  private getFallbackDepartments() {
    return [
      {
        id: '1',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        head: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        phone: '+1 (555) 123-4567',
        type: 'Technology',
        programs: 5,
        faculty: 25,
        students: 150,
        status: 'Active'
      },
      {
        id: '2',
        name: 'Electronics Engineering',
        code: 'ECE',
        head: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        phone: '+1 (555) 234-5678',
        type: 'Engineering',
        programs: 4,
        faculty: 20,
        students: 120,
        status: 'Active'
      }
    ];
  }

  private getFallbackCourses() {
    return [
      {
        id: '1',
        name: 'Data Structures & Algorithms',
        code: 'CSE301',
        department: 'Computer Science & Engineering',
        students: 45,
        faculty: 'Dr. Alice Brown',
        schedule: 'Mon, Wed, Fri 10:00-11:30'
      },
      {
        id: '2',
        name: 'Digital Electronics',
        code: 'ECE201',
        department: 'Electronics Engineering',
        students: 38,
        faculty: 'Dr. Bob Wilson',
        schedule: 'Tue, Thu 14:00-15:30'
      }
    ];
  }

  private getFallbackCalendarEvents() {
    const today = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        id: `event_${i + 1}`,
        title: `Class ${i + 1}`,
        description: `Description for Class ${i + 1}`,
        date: date.toISOString().split('T')[0],
        time: `${9 + (i % 8)}:00`,
        type: ['lecture', 'lab', 'exam'][i % 3],
        course: `Course ${i + 1}`,
        location: `Room ${100 + i}`,
        department: ['Computer Science', 'Electronics'][i % 2]
      };
    });
  }

  private getFallbackAttendanceRecords() {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      student: `Student ${i + 1}`,
      class: `Class ${Math.floor(i / 5) + 1}`,
      date: new Date().toLocaleDateString(),
      time: `${9 + (i % 8)}:00 AM`,
      status: ['present', 'absent', 'late'][i % 3]
    }));
  }

  private getFallbackClasses() {
    return [
      {
        id: '1',
        name: 'CS101-A',
        code: 'CS101',
        course: { name: 'Introduction to Computer Science', code: 'CS101' },
        currentEnrollment: 45,
        room: 'Room 101'
      },
      {
        id: '2',
        name: 'CS201-B',
        code: 'CS201',
        course: { name: 'Data Structures', code: 'CS201' },
        currentEnrollment: 38,
        room: 'Room 205'
      },
      {
        id: '3',
        name: 'EE101-A',
        code: 'EE101',
        course: { name: 'Circuit Analysis', code: 'EE101' },
        currentEnrollment: 42,
        room: 'Lab 301'
      }
    ];
  }

  private getFallbackUser() {
    return {
      id: '1',
      name: 'Dr. John Smith',
      role: 'staff',
      email: 'john.smith@university.edu'
    };
  }
}

export const apiService = new ApiService();