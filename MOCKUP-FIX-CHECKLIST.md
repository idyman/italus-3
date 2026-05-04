# Mockup Display Fix - Step-by-Step Checklist

## Problem
Mock up images upload successfully but don't appear on the project detail page.

## Diagnostic Steps

### Step 1: Check Browser Console (MOST IMPORTANT)
1. Open the project detail page where mockups should appear
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Look for these messages:

```
🔍 Project Detail - Mockups data:
  mockupsCount: X  <-- SHOULD BE > 0 if mockups exist
  mockupsData: [array]  <-- SHOULD show your mockup objects
```

**If mockupsCount is 0:** The data isn't in the database → Go to Step 2
**If mockupsCount > 0:** The data is there but not displaying → Go to Step 4

---

### Step 2: Check if Mockups are Being Saved
1. Go to Admin → Edit a project with mockups
2. Submit/Save the project
3. Look in browser console for:

```
🟦 SUBMIT: Form data before processing:
  mockupsCount: X  <-- SHOULD match number of mockups you added

🟩 SUBMIT: Project data being sent:
  mockupsCount: X  <-- SHOULD still be the same
```

**If mockupsCount is 0 here:** Mockups aren't being added in the form → Check Step 3
**If mockupsCount > 0 here:** Data is being sent but not saved → Go to Step 4

---

### Step 3: Check Database Column Exists
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "projects" table
4. Look for a column named `mockups`

**If column DOESN'T exist:**
Run this SQL in Supabase SQL Editor:
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mockups JSONB DEFAULT '[]'::jsonb;
```

**Then reload schema cache:**
1. Go to API settings in Supabase
2. Scroll to "Schema Cache"
3. Click "Reload schema cache"

---

### Step 4: Check Database Data Directly
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "projects" table
4. Find your project row
5. Click to expand the `mockups` column

**Should look like:**
```json
[
  {
    "id": "1736790123456",
    "imageUrl": "https://...",
    "title": "Screen Title"
  }
]
```

**If it's empty `[]`:**
The save isn't working → Check console for database errors

---

### Step 5: Quick Fix - Re-save the Project
Sometimes the data just needs to be re-saved:

1. Go to Admin Dashboard
2. Click "Edit" on the project with mockups
3. Verify mockups are showing in the list
4. Click "Update Project" (even if you didn't change anything)
5. Go back to the project detail page
6. Check if mockups now appear

---

### Step 6: Test with Simple Image
Try adding a mockup with this known-good image URL:

```
https://images.unsplash.com/photo-1511707171634-5f897ff02aa9
```

Title: `Test`

If this works, your original image URLs might be the issue (CORS, imgur links, etc.)

---

## Common Issues & Solutions

### Issue: "mockupsCount: 0" in console
**Solution:** Mockups aren't being saved. Check database column exists (Step 3)

### Issue: Images upload but mockup list stays empty
**Solution:** Check MockupManager component state. The onChange might not be firing.

### Issue: Mockups save but don't display
**Solution:** Check ProjectDetailPage console logs. Data might not be reaching the component.

### Issue: "relation public.mockups does not exist"
**Solution:** This means you're trying to query a `mockups` table instead of the `mockups` column. The migration should add a COLUMN, not a TABLE.

---

## Emergency Debug Script

Run this in browser console on the admin page while editing a project:

```javascript
// Check if mockups are in the form state
console.log('Form mockups:', document.querySelectorAll('[class*="mockup"]').length);

// Check project data structure
const projectEditButton = document.querySelector('button[class*="Edit"]');
console.log('Projects available:', window);
```

---

## Expected Console Output (When Working)

```
🟦 SUBMIT: Form data before processing:
  mockupsCount: 2
  mockups: [{...}, {...}]

🟩 SUBMIT: Project data being sent:
  mockupsCount: 2
  mockups: [{...}, {...}]

🔵 TRANSFORM: Raw DB row:
  mockups: [{...}, {...}]
  mockupsLength: 2

🟢 TRANSFORM: Transformed project:
  mockupsCount: 2
  firstMockup: {id: "...", imageUrl: "...", title: "..."}

🔍 Project Detail - Mockups data:
  hasMockups: true
  mockupsLength: 2
  mockupsData: [{...}, {...}]
```

**If you see all of these → Mockups SHOULD be displaying!**

---

## Still Not Working?

Share the FULL console output showing:
1. The submit messages (🟦 and 🟩)
2. The transform messages (🔵 and 🟢)
3. The detail page messages (🔍)
4. Any error messages in red

This will tell us exactly where the data flow is breaking!
