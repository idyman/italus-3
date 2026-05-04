# 📚 Case Study Database Setup Guide

## ⚠️ Important: Database Migration Required

The case study feature requires a new `case_study` column in your Supabase database.

## 🔧 Quick Setup (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration SQL
1. Click **New Query**
2. Copy and paste this SQL:

```sql
-- Add case_study column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN projects.case_study IS 'Stores detailed case study information';
```

3. Click **Run** (or press Cmd/Ctrl + Enter)
4. You should see "Success. No rows returned"

### Step 3: Verify Setup
1. Go to **Table Editor** in the left sidebar
2. Click on the **projects** table
3. Scroll right - you should see the new `case_study` column

## ✅ Done!

Your database is now ready to store case studies!

## 🎯 How to Use

1. Go to `/admin` → Projects
2. Edit or create a project
3. Scroll down to **Case Study Manager**
4. Toggle "Enable Case Study" to ON
5. Fill in your case study data (with live preview!)
6. Click **Save Changes**
7. View the project on the front-end to see the case study

## 🐛 Troubleshooting

### If you get an error when saving a project:

**Error**: "column 'case_study' does not exist"
**Solution**: Make sure you ran the migration SQL above in Supabase

### If the case study doesn't appear on the front-end:

1. **Check the browser console** - Open DevTools (F12) and look for errors
2. **Verify the data was saved** - Go to Supabase Dashboard → Table Editor → projects → Check if `case_study` column has data
3. **Hard refresh** - Press Cmd/Ctrl + Shift + R to clear cache

### If you see "Database Migration Required" alert:

This means the `case_study` column hasn't been added yet. Follow Steps 1-2 above.

## 📋 Case Study Data Structure

The case study stores the following fields:
- One Line Summary
- Client & Timeframe
- Context & Challenge
- Objectives (list)
- Strategy (title + description)
- What We Did (categories with items)
- Deliverables
- Role & Responsibilities
- Results (intro + metrics + details)
- What Made It Work (list)
- Learnings (list)
- What to Show (highlights)
- Source Attribution

All fields are optional - fill in only what you need!

## 🎨 Features

✅ Live preview while editing
✅ Smooth scroll animations
✅ Editorial typography
✅ Sticky floating save button
✅ Auto-save on form stability
✅ Vimeo & YouTube video support in Motion section

---

**Need Help?** Check the browser console for detailed error messages.
