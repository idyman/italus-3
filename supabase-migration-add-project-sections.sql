-- Add new columns to projects table for additional sections
-- Run this in your Supabase SQL Editor

-- Add logos column (JSONB array of ProjectImage objects)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS logos JSONB DEFAULT '[]'::jsonb;

-- Add typography column (JSONB array of TypographyItem objects)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS typography JSONB DEFAULT '[]'::jsonb;

-- Add motion column (JSONB array of MotionItem objects)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS motion JSONB DEFAULT '[]'::jsonb;

-- Add mockups column (JSONB array of MockupItem objects)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS mockups JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN projects.logos IS 'Array of logo images with url and description';
COMMENT ON COLUMN projects.typography IS 'Array of typography samples with fontFamily, sampleText, and optional fontUrl';
COMMENT ON COLUMN projects.motion IS 'Array of motion items (videos/gifs) with url, description, and type';
COMMENT ON COLUMN projects.mockups IS 'Array of mockup items with phone screen images, id, imageUrl, and optional title';