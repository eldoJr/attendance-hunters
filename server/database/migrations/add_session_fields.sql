-- Migration: Add location, notes, and sessionType to attendance_sessions table
-- Date: 2024-01-15

ALTER TABLE attendance_sessions 
ADD COLUMN location VARCHAR(255),
ADD COLUMN notes TEXT,
ADD COLUMN session_type VARCHAR(100);

-- Add index for session_type for better query performance
CREATE INDEX idx_attendance_sessions_session_type ON attendance_sessions(session_type);