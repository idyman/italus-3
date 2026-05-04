# Mockup Troubleshooting Guide

## Debug Logging Added

I've added comprehensive debug logging to help identify why mockups aren't displaying:

### What to Check in Browser Console

1. **When viewing a project detail page**, look for these console messages:

```
🔍 Project Detail - Mockups data:
  - hasMockups: true/false
  - mockupsLength: number
  - mockupsData: [array of mockup objects]
  - fullProject: {entire project object}
```

2. **When loading projects from database**, look for:

```
🔵 TRANSFORM: Raw DB row:
  - mockups: [array from database]
  - mockupsLength: number

🟢 TRANSFORM: Transformed project:
  - mockupsCount: number
  - firstMockup: {mockup object or undefined}
```

---

## Common Issues & Solutions

### Issue 1: Mockups Column Doesn't Exist in Database

**Symptoms:**
- Error in console about missing `mockups` column
- mockupsLength shows 0 even after adding mockups

**Solution:**
Run the migration file `/supabase-migration-add-mockups.sql` in your Supabase Dashboard:

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mockups JSONB DEFAULT '[]'::jsonb;
```

Then reload schema cache in Supabase API settings.

---

### Issue 2: Mockups Not Saving to Database

**Symptoms:**
- You add mockups in admin panel
- They show in the preview
- But they don't appear when you reload

**Solution:**
1. Check if `transformProjectToDb()` is including mockups
2. Verify the mockups array has the correct structure:
   ```typescript
   {
     id: "timestamp-string",
     imageUrl: "https://...",
     title: "optional title"
   }
   ```

---

### Issue 3: Images Not Loading in Mockup Frames

**Symptoms:**
- Mockup section appears
- But images are broken/blank

**Solution:**
1. Verify image URLs are direct links (not Imgur gallery pages)
2. Check CORS settings on image host
3. Try uploading images to Supabase Storage instead
4. Check browser console for 403/404 errors

---

### Issue 4: Mockup Section Not Appearing

**Symptoms:**
- No "Mockups" section on project detail page
- Console shows `mockupsLength: 0`

**Possible Causes:**
a) **Database doesn't have mockups data**
   - Check in Supabase Table Editor
   - Look at the `mockups` column for your project

b) **Mockups array is empty**
   - Go to Admin → Edit Project
   - Scroll to Mockups section
   - Add at least one mockup
   - Save project

c) **Data transform issue**
   - Check console for transform errors
   - Verify `row.mockups` is being read correctly

---

## Step-by-Step Debugging

### Step 1: Check Database
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "projects" table
4. Find your project row
5. Look at the `mockups` column
6. Should show: `[{"id":"...","imageUrl":"...","title":"..."}]`

### Step 2: Check Admin Panel
1. Log in to admin
2. Click "Edit" on a project
3. Scroll to "Mockups" section
4. Verify mockups are showing in the list
5. If not, add a test mockup

### Step 3: Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to the project detail page
4. Look for the debug messages above
5. Share the output to identify the issue

### Step 4: Test Image URLs
1. Copy a mockup image URL from admin
2. Paste it in a new browser tab
3. Verify the image loads
4. If not, the URL is invalid

---

## Quick Test

Add this test mockup in the admin panel:

**Image URL:**
```
https://images.unsplash.com/photo-1511707171634-5f897ff02aa9
```

**Title:**
```
Test Phone Screen
```

If this works, the feature is working and the issue is with your image URLs.

---

## Data Structure Reference

### Correct Mockup Structure in Database:
```json
[
  {
    "id": "1736790123456",
    "imageUrl": "https://i.imgur.com/example.png",
    "title": "Home Screen"
  },
  {
    "id": "1736790123457",
    "imageUrl": "https://i.imgur.com/another.png",
    "title": "Settings"
  }
]
```

### Project Object in Code:
```typescript
{
  id: "project-id",
  title: "Project Name",
  // ... other fields ...
  mockups: [
    {
      id: "timestamp",
      imageUrl: "https://...",
      title: "optional"
    }
  ]
}
```

---

## Still Not Working?

If mockups still aren't showing after checking everything above:

1. **Open browser console** and copy all the debug messages starting with 🔍 or 🔵
2. **Take a screenshot** of the admin panel Mockups section
3. **Check the database** directly in Supabase Table Editor
4. **Share the console output** - it will tell us exactly what's wrong

The debug logging will reveal:
- ✅ If mockups are in the database
- ✅ If they're being loaded correctly
- ✅ If they're being passed to the component
- ✅ Where the data flow breaks

---

## Expected Console Output (Working Example)

```
🔵 TRANSFORM: Raw DB row:
  mockups: [{id: "123", imageUrl: "https://...", title: "Test"}]
  mockupsLength: 1

🟢 TRANSFORM: Transformed project:
  mockupsCount: 1
  firstMockup: {id: "123", imageUrl: "https://...", title: "Test"}

🔍 Project Detail - Mockups data:
  hasMockups: true
  mockupsLength: 1
  mockupsData: [{id: "123", imageUrl: "https://...", title: "Test"}]
```

If you see this, mockups **should** be displaying!
