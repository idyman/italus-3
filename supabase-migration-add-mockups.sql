-- Migration to add mockups column to projects table
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE projects ADD COLUMN IF NOT EXISTS mockups JSONB DEFAULT '[]'::jsonb;
