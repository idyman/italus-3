-- Migration: Add CV Custom Sections table
-- This allows users to add custom sections like Awards, Publications, Certifications, etc.
-- Run this in your Supabase SQL Editor

-- Create CV Custom Sections Table
CREATE TABLE IF NOT EXISTS cv_custom_sections (
  id SERIAL PRIMARY KEY,
  section_id TEXT NOT NULL UNIQUE, -- unique identifier like 'awards', 'publications'
  section_name TEXT NOT NULL, -- display name like 'Awards & Recognition'
  content TEXT, -- rich text content
  order_index INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cv_custom_sections ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on cv_custom_sections" 
  ON cv_custom_sections FOR SELECT USING (true);

-- Create policies to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert on cv_custom_sections" 
  ON cv_custom_sections FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on cv_custom_sections" 
  ON cv_custom_sections FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on cv_custom_sections" 
  ON cv_custom_sections FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_cv_custom_sections_updated_at 
  BEFORE UPDATE ON cv_custom_sections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_custom_sections_order ON cv_custom_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_cv_custom_sections_enabled ON cv_custom_sections(enabled);
