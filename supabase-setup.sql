-- Portfolio Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/yzfgllhdlxxhyxafsthd/sql)

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_text TEXT,
  tags TEXT[] NOT NULL,
  link TEXT,
  grid_size TEXT DEFAULT 'medium',
  image_fit TEXT DEFAULT 'cover',
  images JSONB DEFAULT '[]'::jsonb,
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create talks table
CREATE TABLE IF NOT EXISTS talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  icon TEXT NOT NULL,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_settings table
CREATE TABLE IF NOT EXISTS page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'ITALUS',
  hero_title_font_size TEXT NOT NULL DEFAULT '204px',
  hero_quote TEXT NOT NULL,
  work_section_title TEXT NOT NULL DEFAULT 'Work',
  write_section_title TEXT NOT NULL DEFAULT 'Write',
  write_section_description TEXT NOT NULL,
  speak_section_title TEXT NOT NULL DEFAULT 'Speak',
  speak_section_description TEXT NOT NULL,
  footer_location TEXT NOT NULL DEFAULT 'Made in Israel, USA, Italy, Portugal & Germany',
  background_color TEXT NOT NULL DEFAULT '#ffffff',
  text_color TEXT NOT NULL DEFAULT '#000000',
  accent_color TEXT NOT NULL DEFAULT '#000000',
  section_background_color TEXT NOT NULL DEFAULT '#f9fafb',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON articles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON talks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON page_settings FOR SELECT USING (true);

-- Create policies for insert/update/delete (you can make these more restrictive later with auth)
CREATE POLICY "Enable insert for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON projects FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON articles FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON articles FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON talks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON talks FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON talks FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON page_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON page_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON page_settings FOR DELETE USING (true);

-- Insert default page settings (only if table is empty)
INSERT INTO page_settings (
  hero_title,
  hero_title_font_size,
  hero_quote,
  work_section_title,
  write_section_title,
  write_section_description,
  speak_section_title,
  speak_section_description,
  footer_location,
  background_color,
  text_color,
  accent_color,
  section_background_color
)
SELECT
  'ITALUS',
  '204px',
  'A human being should be able to change a diaper, plan an invasion, butcher a hog, conn a ship, design a building, write a sonnet, balance accounts, build a wall, set a bone, comfort the dying, take orders, give orders, cooperate, act alone, solve equations, analyze a new problem, pitch manure, program a computer, cook a tasty meal, fight efficiently, die gallantly. Specialization is for insects.',
  'Work',
  'Write',
  'I write about design, technology, and the creative process.',
  'Speak',
  'I occasionally speak about design, UX, and product development.',
  'Made in Israel, USA, Italy, Portugal & Germany',
  '#ffffff',
  '#000000',
  '#000000',
  '#f9fafb'
WHERE NOT EXISTS (SELECT 1 FROM page_settings LIMIT 1);