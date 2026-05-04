-- Migration: Add CV upload support
-- This migration adds the cv_url column to page_settings and creates a storage bucket for files

-- 1. Add cv_url column to page_settings table
ALTER TABLE page_settings ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- 2. Create storage bucket for portfolio files (CVs, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up storage policies for the bucket
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-files');

-- Allow authenticated users to upload files
CREATE POLICY IF NOT EXISTS "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-files' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their files
CREATE POLICY IF NOT EXISTS "Authenticated users can update files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-files' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files
CREATE POLICY IF NOT EXISTS "Authenticated users can delete files"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-files' AND auth.role() = 'authenticated');

-- Note: Since this is a demo app without auth, we'll also allow public uploads
-- In production, you should remove this policy and use proper authentication
CREATE POLICY IF NOT EXISTS "Public upload for demo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-files');
