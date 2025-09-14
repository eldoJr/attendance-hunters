# Attendance Hunters Server

Backend server for the Attendance Management System.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Database Setup
1. Install PostgreSQL
2. Create database: `CREATE DATABASE attendance_system;`
3. Copy `.env.example` to `.env` and configure your database credentials
4. Run schema setup: `npm run db:setup`

### 3. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

### 4. Test Connection
- Health check: `GET http://localhost:3001/api/health`
- Database test: `GET http://localhost:3001/api/db-test`

## Next Steps

1. **Phase 2**: Create API routes structure
2. **Phase 3**: Implement core APIs (auth, students, faculty, attendance)
3. **Phase 4**: Connect frontend to replace mock data

## Database Schema

The database schema is located in `database/schema.sql` and includes:
- Users, Departments, Faculty, Students
- Courses, Classes, Schedules
- Attendance Sessions and Records
- Calendar Events and Reports