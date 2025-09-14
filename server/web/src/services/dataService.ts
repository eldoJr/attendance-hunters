import { apiService } from './api';

// Department Service
export const departmentService = {
  async getAll(params?: { page?: number; limit?: number; type?: string; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    
    const query = queryParams.toString();
    return apiService.get(`/departments${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return apiService.get(`/departments/${id}`);
  },

  async create(data: any) {
    return apiService.post('/departments', data);
  },

  async update(id: string, data: any) {
    return apiService.put(`/departments/${id}`, data);
  },

  async delete(id: string) {
    return apiService.delete(`/departments/${id}`);
  }
};

// Student Service
export const studentService = {
  async getAll(params?: { page?: number; limit?: number; departmentId?: string; year?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiService.get(`/students${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return apiService.get(`/students/${id}`);
  },

  async getClasses(id: string) {
    return apiService.get(`/students/${id}/classes`);
  },

  async getAttendance(id: string, params?: { classId?: string; startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.classId) queryParams.append('classId', params.classId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const query = queryParams.toString();
    return apiService.get(`/students/${id}/attendance${query ? `?${query}` : ''}`);
  }
};

// Faculty Service
export const facultyService = {
  async getAll(params?: { page?: number; limit?: number; departmentId?: string; designation?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params?.designation) queryParams.append('designation', params.designation);
    
    const query = queryParams.toString();
    return apiService.get(`/faculty${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return apiService.get(`/faculty/${id}`);
  },

  async getClasses(id: string) {
    return apiService.get(`/faculty/${id}/classes`);
  }
};

// Class Service
export const classService = {
  async getAll(params?: { page?: number; limit?: number; facultyId?: string; departmentId?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.facultyId) queryParams.append('facultyId', params.facultyId);
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    
    const query = queryParams.toString();
    return apiService.get(`/classes${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return apiService.get(`/classes/${id}`);
  },

  async enrollStudent(classId: string, studentId: string) {
    return apiService.post(`/classes/${classId}/enroll`, { studentId });
  }
};

// Attendance Service
export const attendanceService = {
  async createSession(data: { classId: string; date: string; startTime: string; endTime: string }) {
    return apiService.post('/attendance/sessions', data);
  },

  async getSession(id: string) {
    return apiService.get(`/attendance/sessions/${id}`);
  },

  async markAttendance(data: { studentId: string; classId: string; sessionId: string; status: string; method?: string }) {
    return apiService.post('/attendance/records', data);
  },

  async getRecords(params?: { page?: number; classId?: string; studentId?: string; startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.classId) queryParams.append('classId', params.classId);
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const query = queryParams.toString();
    return apiService.get(`/attendance/records${query ? `?${query}` : ''}`);
  },

  async getClassAttendance(classId: string, params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const query = queryParams.toString();
    return apiService.get(`/attendance/class/${classId}${query ? `?${query}` : ''}`);
  }
};

// Analytics Service
export const analyticsService = {
  async getOverview() {
    return apiService.get('/analytics/overview');
  },

  async getDepartmentAnalytics(id: string) {
    return apiService.get(`/analytics/department/${id}`);
  },

  async getClassAnalytics(id: string) {
    return apiService.get(`/analytics/class/${id}`);
  },

  async getStudentPerformance(id: string) {
    return apiService.get(`/analytics/student/${id}`);
  },

  async getTrends(params?: { period?: number; departmentId?: string; classId?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period.toString());
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params?.classId) queryParams.append('classId', params.classId);
    
    const query = queryParams.toString();
    return apiService.get(`/analytics/trends${query ? `?${query}` : ''}`);
  }
};