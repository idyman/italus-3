# Admin Dashboard User Guide

## Quick Start

### Accessing Admin
1. Go to your portfolio site
2. Click "Admin" in the navigation
3. You'll be automatically logged in (password bypass enabled)

---

## Managing Projects

### Adding a New Project

1. Go to **Admin Dashboard → Projects Tab**
2. Click **"Add New Project"**
3. Fill in the project details:
   - **Title** - Project name
   - **Description** - Short summary (shows on cards)
   - **Detailed Text** - Full project description
   - **Tags** - Comma-separated (e.g., "Branding, Web Design")
   - **Link** - External URL (optional)
   - **Grid Size** - Small, Medium, or Large card
   - **Image Fit** - Cover or Contain

4. **Add Project Images:**
   - Upload images to Imgur, Cloudinary, or imgbb
   - Paste the direct image URL
   - Preview will show automatically
   - Add up to 10 images per project

5. Click **"Save Project"**

### Editing a Project
1. Find the project in the list
2. Click the **Edit** button (pencil icon)
3. Make your changes
4. Click **"Save Changes"**

### Deleting a Project
1. Find the project in the list
2. Click the **Delete** button (trash icon)
3. Confirm deletion

---

## Page Settings

### Hero Section
- **Hero Title** - Main title (default: "Italus.")
- **Hero Quote** - Optional tagline below title
- **Hero Background Image** - Paste image URL
  - Recommended size: 1920x1080px or larger
  - Use Unsplash for free high-quality images

### Colors & Styling
- **Background Color** - Main page background
- **Text Color** - Primary text color
- **Accent Color** - Links and highlights
- **Section Background** - Alternating section backgrounds

### Footer
- **Location** - City/Country to display in footer

### CV/Resume
- Upload your CV to Google Drive or Dropbox
- Make it publicly accessible
- Paste the share link in the CV Uploader
- Visitors can download from your portfolio

---

## Adding Images - Step by Step

### Option 1: Using Imgur (Recommended)

1. **Go to** https://imgur.com
2. **Click** "New post" (no account needed)
3. **Upload** your image
4. **Right-click** the uploaded image
5. **Select** "Copy image address"
6. **Paste** into admin field

The URL should look like:
```
https://i.imgur.com/ABC123.jpg
```

### Option 2: Using Cloudinary

1. **Create account** at cloudinary.com
2. **Upload** image to Media Library
3. **Copy** the public URL
4. **Paste** into admin field

### Option 3: Using Google Drive

1. **Upload** to Google Drive
2. **Right-click** → Share → "Anyone with link"
3. **Copy** share link
4. **Paste** into admin field

⚠️ **Important:** Make sure the link is public and accessible

---

## Custom Sections

Add unique content sections to your portfolio:

1. Go to **Admin Dashboard → Custom Sections**
2. Click **"Add Custom Section"**
3. Enter:
   - **Title** - Section heading
   - **Content** - Section text (supports line breaks)
4. Sections appear on homepage between projects and footer

---

## Case Studies

Add detailed project case studies:

1. Go to **Admin Dashboard → Case Studies**
2. Select a project from the dropdown
3. Fill in case study details:
   - **Challenge** - Problem statement
   - **Solution** - Your approach
   - **Results** - Outcomes and metrics
   - **Testimonial** - Client quote (optional)
4. Click **"Save Case Study"**

---

## Tips & Best Practices

### Images
- ✅ Use high-quality images (1920x1080px minimum)
- ✅ Compress images before uploading to hosting
- ✅ Use consistent image aspect ratios
- ✅ Test image URLs before pasting (open in new tab)
- ❌ Don't use images from sites that require login

### Project Descriptions
- ✅ Keep card descriptions short (2-3 sentences)
- ✅ Use detailed text for full project story
- ✅ Add specific outcomes and metrics
- ✅ Include role and responsibilities

### Tags
- ✅ Use consistent tag names
- ✅ 3-5 tags per project is ideal
- ✅ Capitalize consistently (e.g., "Web Design" not "web design")

### Organization
- ✅ Add projects in chronological order (newest first)
- ✅ Use case studies for your best work
- ✅ Update CV link when you have new version
- ✅ Review portfolio regularly to remove outdated work

---

## Troubleshooting

### Image Won't Load
- ✅ Check URL is a direct image link (ends in .jpg, .png, etc.)
- ✅ Open URL in new tab to verify it works
- ✅ Make sure image is publicly accessible
- ✅ Try re-uploading to different hosting service

### Changes Not Saving
- ✅ Check browser console for errors (F12)
- ✅ Make sure you clicked "Save" button
- ✅ Try refreshing the page
- ✅ Check localStorage in DevTools

### CV Not Showing
- ✅ Verify CV link is public
- ✅ Test link in incognito window
- ✅ Make sure link doesn't require login
- ✅ Use direct file link, not preview link

### Project Not Appearing
- ✅ Make sure you saved the project
- ✅ Refresh the portfolio page
- ✅ Check that project has at least one image
- ✅ Verify project title is filled in

---

## Features Currently Unavailable

### Temporarily Disabled:
- ❌ **Branding Project Automation** - Being migrated to Firebase
- ❌ **Full CV Builder** - Use CV URL uploader instead
- ❌ **CV Data Import** - Coming in future update

### Workarounds:
- For CV: Upload PDF externally and paste link
- For Projects: Add manually in Projects tab

---

## Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save current form (in most browsers)
- **Esc** - Close modal/dialog
- **Enter** - Submit image URL input

---

## Data & Privacy

### Where Your Data Is Stored:
1. **Primary:** Firebase Firestore (cloud database)
2. **Backup:** Browser localStorage (local storage)

### Data Backup:
- Your data is automatically backed up to localStorage
- Even if Firebase is down, your data is safe
- Export/import features coming soon

### Privacy:
- Only you can access the admin dashboard
- All data is stored in your Firebase project
- No third-party data collection
- Images hosted on services you choose

---

## Getting Help

### Common Issues:
1. **"Feature Temporarily Unavailable"** - Feature being migrated, use alternative method
2. **"Bucket not found"** - Feature has been removed, use URL input instead
3. **Firebase errors** - Data automatically saves to localStorage as backup

### Support:
- Check browser console for detailed errors
- Review this guide for solutions
- All operations are logged for debugging

---

## Admin Best Practices

### Daily Workflow:
1. Log in to admin dashboard
2. Review existing projects
3. Add new work with quality images
4. Update case studies with metrics
5. Keep CV link current
6. Test portfolio from visitor perspective

### Monthly Maintenance:
- Remove outdated projects
- Update hero image for freshness
- Refresh CV with new skills
- Check all image links still work
- Review and update project descriptions

### Before Launching:
- ✅ Add at least 6-8 quality projects
- ✅ Write compelling case studies
- ✅ Upload current CV
- ✅ Set hero image and quote
- ✅ Add custom sections (About, Services, etc.)
- ✅ Test on mobile and desktop
- ✅ Verify all images load correctly
- ✅ Share with friends for feedback

---

**Need more help?** Check the browser console (F12) for detailed error messages and debug information.
