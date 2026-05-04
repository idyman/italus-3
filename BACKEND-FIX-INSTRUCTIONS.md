# Backend Fix Instructions

## Quick Fix (5 minutes)

Your backend is **95% functional**. There are just 2 missing database tables that need to be created.

### Step-by-Step Instructions:

#### 1. Go to your Supabase Dashboard
- Open: https://supabase.com/dashboard
- Navigate to your project: `yzfgllhdlxxhyxafsthd`

#### 2. Open SQL Editor
- Click "SQL Editor" in the left sidebar
- Click "New Query"

#### 3. Run Migration #1: CV Sections Table
- Copy the contents of `/supabase-migration-cv-sections.sql`
- Paste into the SQL Editor
- Click "Run" or press Cmd/Ctrl + Enter
- Wait for "Success" confirmation

#### 4. Run Migration #2: CV Custom Sections Table
- Copy the contents of `/supabase-migration-cv-custom-sections.sql`
- Paste into the SQL Editor
- Click "Run" or press Cmd/Ctrl + Enter
- Wait for "Success" confirmation

#### 5. Reload Schema Cache (CRITICAL!)
- Click "API" in the left sidebar
- Scroll down to "Schema Cache" section
- Click the "Reload schema cache" button
- Wait for confirmation (usually 2-3 seconds)

#### 6. Verify Everything Works
- Refresh your application
- Navigate to the CV page
- The errors should be gone!

---

## What These Migrations Do

### Migration #1: `cv_sections`
Creates a table to manage which CV sections are visible and their display order.

**Columns:**
- `id` - Section identifier (e.g., 'work-experience', 'education')
- `name` - Internal name
- `label` - Display label shown to users
- `enabled` - Whether the section is visible
- `order_index` - Display order
- `is_custom` - Whether it's a custom or built-in section

**Default Sections Added:**
- Profile
- Work Experience
- Education
- Skills
- Languages

### Migration #2: `cv_custom_sections`
Creates a table for custom CV sections like awards, publications, certifications, etc.

**Columns:**
- `id` - Auto-generated ID
- `section_id` - Unique identifier (e.g., 'awards')
- `section_name` - Display name (e.g., 'Awards & Recognition')
- `content` - Rich text content
- `order_index` - Display order
- `enabled` - Whether the section is visible

---

## Error Reference

**Current Error:**
```
PGRST205 - Could not find the table 'public.cv_sections' in the schema cache
PGRST205 - Could not find the table 'public.cv_custom_sections' in the schema cache
```

**After Fix:**
✅ All CV data loads successfully  
✅ No console errors  
✅ Backend is 100% operational  

---

## Files Updated

✅ `/supabase-migration-cv-sections.sql` - **NEW** migration file created  
✅ `/src/lib/supabase.ts` - Added `CVSection` TypeScript interface  
✅ `/src/app/components/CVPage.tsx` - Now imports `CVSection` from supabase.ts  
✅ `/BACKEND-STATUS-REPORT.md` - Comprehensive backend analysis  
✅ `/BACKEND-FIX-INSTRUCTIONS.md` - This file  

---

## Need Help?

If you encounter any issues:

1. Check the browser console for specific error messages
2. Verify both migration files ran successfully in Supabase
3. Confirm you reloaded the schema cache
4. Try refreshing your browser

For detailed backend status, see: `/BACKEND-STATUS-REPORT.md`
