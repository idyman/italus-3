# Custom Sections & Hero Background - Complete Guide

## 🎉 What's New

You can now fully customize your portfolio homepage with:

1. **Custom Hero Background Image** - Upload any image URL for your hero section
2. **Dynamic Custom Sections** - Add unlimited custom content sections
3. **Updated Work Section Title** - Now defaults to "Selected Work"
4. **Removed "Write" Section** - Cleaner, more focused design

---

## 📋 Database Migration Required

**⚠️ IMPORTANT: Run this SQL in your Supabase Dashboard first!**

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Migration
Copy and paste this SQL code:

```sql
-- Add hero background image column
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS hero_background_image TEXT;

-- Add custom sections column (JSONB array)
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;
```

### Step 3: Click "Run" button

✅ **Migration complete!** Your database is now ready.

---

## 🎨 How to Use

### 1. Hero Background Image

**Admin Panel:**
1. Go to `/admin` → **Settings** tab
2. Scroll to "Hero Section"
3. Find "Hero Background Image URL"
4. Paste any image URL (e.g., from Unsplash, Imgur, or your own CDN)
5. Preview appears below the input
6. **Saves automatically!**

**Example URLs:**
- Unsplash: `https://images.unsplash.com/photo-1234567890...`
- Your own: `https://yourdomain.com/images/hero-bg.jpg`

**Leave empty** to use the default background.

---

### 2. Custom Sections

**Admin Panel:**
1. Go to `/admin` → **Settings** tab
2. Scroll to "Custom Sections"
3. Click **"Add Section"** button
4. Fill in:
   - **Title**: Section heading (e.g., "About Me", "Services", "Philosophy")
   - **Description**: Section content (supports multi-line text)
5. **Saves automatically!**

**Reorder Sections:**
- Sections appear in the order you create them
- First section created = First on page
- Delete unwanted sections with the trash icon

**Section Examples:**

```
Title: "About Me"
Description: "I'm a decision leader with 15+ years of experience helping organizations make better strategic choices through design thinking and systems analysis."

Title: "Services"
Description: "Strategic consulting\nDecision frameworks\nOrganizational design\nWorkshop facilitation"

Title: "Philosophy"  
Description: "I believe great decisions come from deep understanding, not quick answers. My approach combines analytical rigor with human-centered design."
```

---

### 3. Work Section Title

**Admin Panel:**
1. Go to `/admin` → **Settings** tab
2. Find "Work Section Title"  
3. Change from "Selected Work" to anything you want:
   - "Projects"
   - "Case Studies"
   - "Portfolio"
   - "My Work"
4. **Saves automatically!**

---

## 🎯 What Was Removed

### "Write" Section - REMOVED ✅
- The entire "Write Section Title" field
- The entire "Write Section Description" field
- No more hardcoded write content on homepage

**Why?** 
Cleaner design focused on your core work and custom content you control.

---

## 📱 How It Looks

### Homepage Layout (Top to Bottom):

1. **Hero Section** ← Your custom background image!
   - Large title
   - Quote
   - Action buttons (CV, LinkedIn, Say Hi)

2. **Quote Section**
   - "A human being should be able to..." (from settings)

3. **Work Section** ← Custom title you set!
   - Your projects in grid layout

4. **Custom Sections** ← Any number you create!
   - Section 1: Custom Title + Description
   - Section 2: Custom Title + Description
   - Section 3: Custom Title + Description
   - ...and so on

5. **Footer**
   - Location text

---

## ✨ Features

### Auto-Save
All changes save automatically as you type. No "Save" button needed!

### Responsive
All custom sections look great on:
- Desktop 💻
- Tablet 📱
- Mobile 📱

### Animations
Custom sections fade in smoothly as you scroll

### Alternating Backgrounds
Custom sections automatically alternate between:
- Your background color
- Your section background color

### Clean Delete
Remove any custom section instantly with the trash icon

---

## 🐛 Troubleshooting

### "Custom Sections not showing up?"
1. ✅ Did you run the SQL migration?
2. ✅ Did you click "Add Section" button?
3. ✅ Did you fill in both Title and Description?
4. ✅ Check browser console for errors

### "Hero background not changing?"
1. ✅ Is the URL valid?
2. ✅ Is the image publicly accessible?
3. ✅ Try opening the URL in a new tab - does it load?
4. ✅ Hard refresh your page (Cmd+Shift+R or Ctrl+Shift+F5)

### "Getting database errors?"
Run this SQL to check if columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'page_settings' 
  AND column_name IN ('hero_background_image', 'custom_sections');
```

Should return 2 rows. If not, re-run the migration.

---

## 🔄 Migration File Location

The SQL migration is saved at:
```
/supabase-migration-custom-sections.sql
```

---

## 💡 Pro Tips

### Hero Background Images
- **Best size**: 1920x1080px or larger
- **Format**: JPG or PNG
- **Keep file size under 500KB** for fast loading
- **Use high contrast** so white text is readable
- **Test on mobile** - make sure it looks good

### Custom Sections
- **Keep titles short**: 1-4 words ideal
- **Descriptions can be long**: Use paragraphs!
- **Add blank lines** for spacing (press Enter twice)
- **Use it for**:
  - About / Bio
  - Services offered
  - Philosophy / Approach
  - Process / Method
  - Testimonials
  - Call to action

### Order Matters
Custom sections appear in creation order:
- First created → Top of page
- Last created → Bottom of page

Want to reorder? Delete and recreate in desired order.

---

## 📊 Data Structure

### Database Schema

```sql
page_settings table:
  - hero_background_image (TEXT, nullable)
  - custom_sections (JSONB, defaults to [])
  - work_section_title (TEXT)
  - hero_title (TEXT)
  - hero_quote (TEXT)
  - footer_location (TEXT)
  - ...other color fields
```

### Custom Sections JSON

```json
[
  {
    "id": "1673891234567",
    "title": "About Me",
    "description": "I'm a decision leader...",
    "order": 0
  },
  {
    "id": "1673891234999",
    "title": "Services",
    "description": "Strategic consulting\nWorkshops\nCoaching",
    "order": 1
  }
]
```

---

## 🚀 Next Steps

1. ✅ Run the database migration
2. ✅ Add a hero background image
3. ✅ Create 2-3 custom sections
4. ✅ Update work section title
5. ✅ View your beautiful new homepage!

---

## 📝 Notes

- All changes are stored in Supabase
- Works across all devices
- No code changes needed after setup
- Fully customizable through admin panel
- TypeScript type-safe

---

**Need help?** Check the browser console for detailed error messages.

**Questions?** All the code is in:
- `/src/app/App.tsx` - Type definitions
- `/src/app/components/AdminDashboard.tsx` - Admin UI
- `/src/app/components/PortfolioPage.tsx` - Public display
- `/src/hooks/useSupabaseData.ts` - Database sync
