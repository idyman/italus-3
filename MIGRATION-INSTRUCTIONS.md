# Database Migration Instructions

## ⚠️ Error: Missing `custom_sections` column

You're seeing this error because the database needs to be updated with the latest schema changes.

## 🔧 Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar (looks like </> icon)
4. Click **New Query** button

### Step 2: Copy & Paste This SQL

Copy the entire SQL code below and paste it into the SQL Editor:

```sql
-- Migration: Add hero background image and custom sections to page_settings table

-- Add hero background image column
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS hero_background_image TEXT;

-- Add custom sections column (JSONB array)
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN page_settings.hero_background_image IS 'URL for hero section background image';
COMMENT ON COLUMN page_settings.custom_sections IS 'Array of custom sections with id, title, description, and order';
```

### Step 3: Run the SQL

1. Click the **Run** button (or press Ctrl+Enter / Cmd+Enter)
2. Wait for the green "Success" message
3. Close the SQL Editor

### Step 4: Refresh Your App

1. Go back to your portfolio admin page
2. **Refresh the page** (F5 or Cmd+R)
3. The error should be gone! ✅

---

## What This Migration Does

- ✅ Adds `hero_background_image` column to store the hero section background image URL
- ✅ Adds `custom_sections` column to store an array of custom sections (JSON format)
- ✅ Sets default values so existing data continues to work
- ✅ Safe to run multiple times (uses `IF NOT EXISTS`)

## Need Help?

If you see any errors:
1. Make sure you're connected to the correct Supabase project
2. Check that the `page_settings` table exists
3. Verify you have the necessary permissions

---

**💡 Tip:** This migration file is also available at `/supabase-migration-custom-sections.sql`