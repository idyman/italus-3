# 🚨 DATABASE SETUP REQUIRED

## Error: `cv_custom_sections` Table Not Found

You're seeing this error because required CV tables don't exist in your Supabase database yet.

---

## ✅ Complete Fix (5 minutes)

You need to run **TWO** migration files to set up all CV tables properly.

### **Step 1: Go to Supabase Dashboard**
1. Open [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar

---

### **Step 2: Run Main Schema Migration**

This creates the core CV tables (profile, work experience, education, languages, skills).

1. Click **"New Query"**
2. Copy the entire contents of `/supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** ✅

**What this creates:**
- ✅ `cv_profile` - Your basic profile info
- ✅ `cv_work_experience` - Job history
- ✅ `cv_education` - Education details
- ✅ `cv_languages` - Languages you speak
- ✅ `cv_skills` - Your skills

---

### **Step 3: Run CV Sections Migration**

This creates the section management table.

1. Click **"New Query"** (create another query)
2. Copy the entire contents of `/supabase-migration-cv-sections.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** ✅

**What this creates:**
- ✅ `cv_sections` - Manage which sections are visible and their order

---

### **Step 4: Run Custom Sections Migration**

This enables custom sections (Awards, Publications, etc.).

1. Click **"New Query"** (create another query)
2. Copy the entire contents of `/supabase-migration-cv-custom-sections.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** ✅

**What this creates:**
- ✅ `cv_custom_sections` - Add custom sections beyond the default ones

---

### **Step 5: Verify All Tables**

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `cv_profile`
   - ✅ `cv_work_experience`
   - ✅ `cv_education`
   - ✅ `cv_languages`
   - ✅ `cv_skills`
   - ✅ `cv_sections`
   - ✅ `cv_custom_sections`

---

### **Step 6: Refresh Your App**
1. Go back to your portfolio site
2. Refresh the page (F5 or Ctrl+R)
3. All errors should be gone! 🎉

---

## 📋 Migration Files Summary

### **Required Migrations (Run in order):**

1. **`/supabase-schema.sql`** - Core CV tables
2. **`/supabase-migration-cv-sections.sql`** - Section management  
3. **`/supabase-migration-cv-custom-sections.sql`** - Custom sections

---

## 🎯 Quick Copy-Paste Option

If you prefer to run everything at once, you can create ONE query with all the migrations combined:

1. Go to SQL Editor
2. Click "New Query"
3. Copy contents of `/supabase-schema.sql`
4. Add contents of `/supabase-migration-cv-sections.sql`
5. Add contents of `/supabase-migration-cv-custom-sections.sql`
6. Click "Run"

**Note:** Make sure the `update_updated_at_column()` function is created BEFORE the other migrations (it's in `supabase-schema.sql`).

---

## 📊 After Setup

Once the tables are created, you can:

1. **View CV page** - Error will be gone
2. **Go to Admin → CV** - Manage custom sections
3. **Add new sections** - Awards, Publications, etc.
4. **Edit content** - Full WYSIWYG editor
5. **Reorder sections** - Drag and drop

---

## 💡 Pro Tips

- **Backup First**: Always backup your database before running migrations
- **Test in Dev**: If you have a dev/staging Supabase project, test there first
- **Check Logs**: Supabase logs show detailed error messages if something fails
- **RLS Enabled**: The migration enables Row Level Security for data protection

---

## 🆘 Need Help?

1. **Check SQL Editor logs** - Look for red error messages
2. **Verify table exists** - Go to Table Editor → look for `cv_custom_sections`
3. **Check RLS policies** - Table Editor → cv_custom_sections → RLS tab
4. **Browser console** - Open DevTools (F12) and check for errors

---

**Once you run the migration, everything will work!** 🚀