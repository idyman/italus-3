# 🚀 Quick Start Guide - Custom Page Management

## ⚡ Get Started in 3 Steps

### Step 1️⃣: Run Database Migration

Open your Supabase Dashboard → SQL Editor and run:

```sql
ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS hero_background_image TEXT;

ALTER TABLE page_settings 
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;
```

✅ **Done!** Your database is ready.

---

### Step 2️⃣: Go to Admin Settings

1. Navigate to `/admin` in your app
2. Click the **Settings** tab
3. You'll see three new sections:
   - **Hero Background Image** (in Hero Section)
   - **Work Section Title** (in Section Settings)
   - **Custom Sections** (new section below)

---

### Step 3️⃣: Customize Your Page

#### Add Hero Background
```
Hero Background Image URL: https://images.unsplash.com/photo-xyz...
```
- Paste any image URL
- Preview appears automatically
- Leave blank for default background

#### Update Work Title
```
Work Section Title: Selected Work
```
- Change to anything you want
- Updates homepage instantly

#### Add Custom Sections
```
Click "Add Section" →
  Title: About Me
  Description: Your bio and background...

Click "Add Section" →
  Title: Services
  Description: What you offer...
```
- Add unlimited sections
- Appears on homepage below projects
- Delete anytime with trash icon

---

## 🎯 What You Get

### Homepage Layout:
1. **Hero** - Custom background + title + buttons
2. **Quote** - Your custom quote
3. **Selected Work** - Your projects grid
4. **Custom Sections** - Any sections you create
5. **Footer** - Custom location text

### Features:
- ✅ Auto-save (no save button)
- ✅ Live preview for images
- ✅ Responsive on all devices
- ✅ Smooth animations
- ✅ Alternating backgrounds

---

## 💡 Pro Tips

**Hero Backgrounds:**
- Use 1920x1080px or larger
- Keep under 500KB for speed
- High contrast for white text

**Custom Sections:**
- Short titles (1-4 words)
- Long descriptions work great
- Use Enter for line breaks
- Great for: About, Services, Philosophy, Process

**Ordering:**
- Sections appear in creation order
- First created = Top of page
- Want to reorder? Delete & recreate

---

## 🔍 What Changed

### ✅ Added:
- Hero background image upload
- Custom sections manager
- Work section title editor

### ❌ Removed:
- "Write" section (cleaner design)
- All hardcoded content

### 🔄 Updated:
- Work section defaults to "Selected Work"
- All content now editable from admin
- Hero title uses settings
- Quote uses settings
- Footer uses settings

---

## 🐛 Troubleshooting

**Not seeing custom sections on homepage?**
→ Did you run the database migration?

**Hero background not updating?**
→ Try hard refresh (Cmd+Shift+R)

**Getting errors?**
→ Check browser console for details

---

## 📋 Migration File

Full migration SQL is in:
```
/supabase-migration-custom-sections.sql
```

Detailed documentation in:
```
/CUSTOM-SECTIONS-README.md
```

---

## ✨ You're All Set!

Your portfolio is now fully customizable through the admin panel. No code changes needed for future updates!

**Next:** Start adding your custom sections and watch your page come to life 🎨
