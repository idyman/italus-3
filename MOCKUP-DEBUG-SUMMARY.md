# Mockup Feature - Complete Debug Setup

## ✅ What I've Done

### 1. Added Debug Logging (5 locations)
- **Admin Form** - Shows mockup count when adding/editing
- **Admin Submit** - Logs mockups before and after processing
- **Database Transform** - Shows mockups when loading from DB
- **Project Detail Page** - Shows mockups when rendering

### 2. Added Visual Indicators
- ✅ Green checkmark next to "Mockups (Optional)" showing count
- Example: "✓ 2 mockups added"

### 3. Created Documentation
- `/MOCKUP-TROUBLESHOOTING.md` - Comprehensive guide
- `/MOCKUP-FIX-CHECKLIST.md` - Step-by-step checklist
- `/MOCKUP-DEBUG-SUMMARY.md` - This file

---

## 🔍 How to Debug

### Open Browser Console (F12) and look for these emojis:

1. **🔄** - Mockups updated in form (when you add one)
2. **🟦** - Form data before submit (when you click save)
3. **🟩** - Data being sent to database
4. **🔵** - Raw data from database
5. **🟢** - Transformed project data
6. **🔍** - Project detail page data

---

## 📋 Quick Diagnostic

Run through this checklist:

### Step 1: Add a Mockup
1. Go to Admin → Projects → Edit a project
2. Scroll to "Mockups (Optional)"
3. Upload or paste image URL
4. Click "Add Mockup"
5. **Check console for:** `🔄 Mockups updated in form:`
6. **Look for:** Green checkmark "✓ 1 mockup added"

### Step 2: Save the Project
1. Click "Update Project"
2. **Check console for:**
   - `🟦 SUBMIT: Form data` → mockupsCount should be > 0
   - `🟩 SUBMIT: Project data` → mockupsCount should match

### Step 3: View the Project
1. Go back to homepage
2. Click on the project
3. **Check console for:** `🔍 Project Detail - Mockups data`
4. **mockupsLength should be > 0**

### Step 4: Check the Page
- Scroll down on project detail page
- **Should see:** "Mockups" section with phone frames
- **If not:** Check console messages

---

## 🎯 What the Logs Tell You

### If you see:
```
🔄 Mockups updated in form: [{...}]
✓ 1 mockup added  <-- Visual indicator
🟦 mockupsCount: 1
🟩 mockupsCount: 1
🔵 mockupsLength: 1
🟢 mockupsCount: 1
🔍 mockupsLength: 1
```

**= EVERYTHING IS WORKING! Mockups should display.**

---

### If mockupsCount is 0 at 🟦:
**Problem:** Mockups aren't being added to form
**Check:** Is the mockup showing in the admin list?

### If mockupsCount is 0 at 🔵:
**Problem:** Data didn't save to database
**Check:** 
1. Does `mockups` column exist in database?
2. Run `/supabase-migration-add-mockups.sql`
3. Reload schema cache

### If mockupsLength is 0 at 🔍:
**Problem:** Data isn't reaching the detail page
**Check:** Refresh the page, clear cache

---

## 🚨 Most Common Issue

**The `mockups` database column doesn't exist!**

### Solution:
1. Go to Supabase Dashboard
2. SQL Editor
3. Run this:
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mockups JSONB DEFAULT '[]'::jsonb;
```
4. Reload schema cache (API → Schema Cache → Reload)
5. Re-save your project
6. Check again

---

## 💡 Test Image

Use this URL to test if mockups work:
```
https://images.unsplash.com/photo-1511707171634-5f897ff02aa9
```

If this displays, your setup works! Your original images might have CORS issues.

---

## 📞 Next Steps

1. **Open browser console (F12)**
2. **Add a mockup to a project**
3. **Save the project**
4. **View the project detail page**
5. **Copy ALL console messages that start with 🔄, 🟦, 🟩, 🔵, 🟢, or 🔍**
6. **Share them - they'll tell us exactly what's happening!**

The debug system is now fully active. Every step of the mockup data flow is logged!
