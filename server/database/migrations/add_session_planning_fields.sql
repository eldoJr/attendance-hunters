-- Add new fields to attendance_sessions table for enhanced session planning

-- Add enum for planning status
CREATE TYPE "PlanningStatus" AS ENUM ('planned', 'in_progress', 'completed');

-- Add new columns to attendance_sessions table
ALTER TABLE "public"."attendance_sessions" 
ADD COLUMN "conducted_by" TEXT,
ADD COLUMN "planned_topic" TEXT,
ADD COLUMN "planning_status" "PlanningStatus",
ADD COLUMN "target_learning" TEXT,
ADD COLUMN "tg_level" TEXT;