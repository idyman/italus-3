-- Migration: Add hero background image and custom sections to page_settings table
-- Run this in your Supabase SQL Editor

-- Add hero background image column
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS hero_background_image TEXT;

-- Add custom sections column (JSONB array)
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN page_settings.hero_background_image IS 'URL for hero section background image';
COMMENT ON COLUMN page_settings.custom_sections IS 'Array of custom sections with id, title, description, and order';

-- Example of custom_sections structure:
-- [
--   {
--     "id": "1",
--     "title": "About Me",
--     "description": "Learn more about my background and experience.",
--     "order": 1
--   },
--   {
--     "id": "2",
--     "title": "Services",
--     "description": "What I can help you with.",
--     "order": 2
--   }
-- ]
