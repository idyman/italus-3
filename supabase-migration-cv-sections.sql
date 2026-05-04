-- Migration: Add CV Sections Management Table
-- This table manages which CV sections are enabled/disabled and their display order
-- Run this in your Supabase SQL Editor

-- Create CV Sections Table
CREATE TABLE IF NOT EXISTS cv_sections (
  id TEXT PRIMARY KEY, -- section identifier like 'work-experience', 'education', etc.
  name TEXT NOT NULL, -- internal name for the section
  label TEXT NOT NULL, -- display label shown to users
  enabled BOOLEAN DEFAULT true, -- whether the section is shown
  order_index INTEGER DEFAULT 0, -- display order
  is_custom BOOLEAN DEFAULT false, -- whether this is a custom section or built-in
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cv_sections ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on cv_sections" 
  ON cv_sections FOR SELECT USING (true);

-- Create policies to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert on cv_sections" 
  ON cv_sections FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on cv_sections" 
  ON cv_sections FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on cv_sections" 
  ON cv_sections FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_cv_sections_updated_at 
  BEFORE UPDATE ON cv_sections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_sections_order ON cv_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_cv_sections_enabled ON cv_sections(enabled);

-- Insert default CV sections
INSERT INTO cv_sections (id, name, label, enabled, order_index, is_custom) VALUES
  ('profile', 'profile', 'Profile', true, 0, false),
  ('work-experience', 'work-experience', 'Work Experience', true, 1, false),
  ('education', 'education', 'Education', true, 2, false),
  ('skills', 'skills', 'Skills', true, 3, false),
  ('languages', 'languages', 'Languages', true, 4, false)
ON CONFLICT (id) DO NOTHING;
