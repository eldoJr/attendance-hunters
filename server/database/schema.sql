-- Attendance Management System Database Schema
-- PostgreSQL Database

-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS attendance_sessions CASCADE;
DROP TABLE IF EXISTS student_enrollments CASCADE;
DROP TABLE IF EXISTS class_schedules CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS event_type;
DROP TYPE IF EXISTS report_status;

-- Create ENUM types
CREATE TYPE event_type AS ENUM ('Exam', 'Class', 'Holiday', 'Event');
CREATE TYPE report_status AS ENUM ('Generated', 'Processing', 'Failed');

-- Users table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'staff', 'admin')) NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    head VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    type VARCHAR(50) CHECK (type IN ('Technology', 'Engineering', 'Science')) NOT NULL,
    faculty_count INT DEFAULT 0,
    student_count INT DEFAULT 0,
    programs_count INT DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    established INT CHECK (established >= 1800 AND established <= EXTRACT(YEAR FROM CURRENT_DATE)),
    building VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty table
CREATE TABLE faculty (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(50),
    department_id VARCHAR(50),
    designation VARCHAR(50) CHECK (designation IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Lab Instructor')),
    specialization JSONB,
    qualifications JSONB,
    experience_years INT,
    join_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'on_leave')) DEFAULT 'active',
    office_room VARCHAR(50),
    research_areas JSONB,
    publications_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Students table
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    department_id VARCHAR(50),
    year INT,
    section VARCHAR(10),
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Suspended')) DEFAULT 'Active',
    enrollment_date DATE,
    phone VARCHAR(20),
    gpa NUMERIC(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Courses table
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    credits INT,
    description TEXT,
    prerequisites JSONB,
    level VARCHAR(20) CHECK (level IN ('undergraduate', 'graduate')),
    category VARCHAR(20) CHECK (category IN ('core', 'elective', 'lab')),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Classes table
CREATE TABLE classes (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    faculty_id VARCHAR(50),
    department_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    section VARCHAR(10),
    semester VARCHAR(20),
    academic_year VARCHAR(10),
    max_capacity INT,
    current_enrollment INT DEFAULT 0,
    room VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'completed')) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    credits INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Class schedules table
CREATE TABLE class_schedules (
    id VARCHAR(50) PRIMARY KEY,
    class_id VARCHAR(50) REFERENCES classes(id),
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

-- Student enrollments table
CREATE TABLE student_enrollments (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50),
    class_id VARCHAR(50),
    enrollment_date DATE,
    status VARCHAR(20) CHECK (status IN ('enrolled', 'dropped', 'completed')) DEFAULT 'enrolled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    CONSTRAINT unique_enrollment UNIQUE (student_id, class_id)
);

-- Attendance sessions table
CREATE TABLE attendance_sessions (
    id VARCHAR(50) PRIMARY KEY,
    class_id VARCHAR(50),
    faculty_id VARCHAR(50),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    total_students INT,
    present_count INT DEFAULT 0,
    absent_count INT DEFAULT 0,
    late_count INT DEFAULT 0,
    attendance_percentage NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    CHECK (end_time > start_time)
);

-- Attendance records table
CREATE TABLE attendance_records (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50),
    class_id VARCHAR(50),
    faculty_id VARCHAR(50),
    session_id VARCHAR(50),
    date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused')),
    check_in_time TIME,
    check_out_time TIME,
    method VARCHAR(20) CHECK (method IN ('manual', 'qr', 'biometric', 'rfid')),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(id)
);

-- Calendar events table
CREATE TABLE calendar_events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255),
    type event_type NOT NULL,
    department_id VARCHAR(50),
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Reports table
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(100),
    class_id VARCHAR(50),
    period VARCHAR(100),
    attendance_percentage DECIMAL(5,2),
    student_count INT,
    generated_date DATE,
    status report_status DEFAULT 'Processing',
    file_path VARCHAR(500),
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_enrollment_number ON students(enrollment_number);
CREATE INDEX idx_attendance_records_date ON attendance_records(date);
CREATE INDEX idx_attendance_records_student_class ON attendance_records(student_id, class_id);
CREATE INDEX idx_classes_faculty ON classes(faculty_id);
CREATE INDEX idx_classes_department ON classes(department_id);