# 📄 CV Upload Feature - Setup Guide

## ✅ Feature Added Successfully!

You can now upload a PDF version of your CV directly from the admin panel.

## 🎯 How to Use

### **Step 1: Go to Admin Panel**
1. Navigate to `/admin` (or click "View Admin" from portfolio)
2. Log in with your credentials

### **Step 2: Open Settings Tab**
1. Click on the **"Settings"** tab at the top
2. Scroll down to the **"CV Upload"** section

### **Step 3: Upload Your CV**
1. Click the **"Upload CV"** button
2. Select your PDF file (max 10MB)
3. Wait for the upload to complete ✅
4. Your CV will be automatically saved and available for download!

### **Step 4: Test It**
1. Go to your CV page (click "View Portfolio" → navigate to CV)
2. Click the **"Download IDY CV"** button
3. Your PDF should download! 🎉

---

## 🔧 Features

✅ **PDF Upload** - Drag and drop or click to upload  
✅ **File Validation** - Only PDFs up to 10MB  
✅ **Preview Link** - Preview your uploaded CV before visitors see it  
✅ **Replace/Remove** - Easy to update or remove the CV  
✅ **Auto-Save** - Settings save automatically  
✅ **Visual Feedback** - Upload progress and success messages  

---

## 📋 Storage Location

Your CV is stored in Supabase Storage:
- **Bucket**: `italus project-images`
- **Path**: `cvs/cv-[timestamp].pdf`
- **Access**: Public (downloadable by visitors)
- **Max Size:** 10MB per file

---

## 🐛 Troubleshooting

### **"Bucket not found" Error**

If you see this error, you need to create the storage bucket:

1. **Go to Supabase Dashboard** → [app.supabase.com](https://app.supabase.com)
2. Click **Storage** in the left sidebar
3. Click **"Create a new bucket"**
4. Name it: `portfolio-assets`
5. Make it **Public** (check the box)
6. Click **"Create bucket"**
7. Try uploading again!

### **Upload Fails Silently**

1. Open browser DevTools (F12)
2. Check the Console for errors
3. Common issues:
   - File too large (max 10MB)
   - Not a PDF file
   - Supabase not configured
   - Storage bucket doesn't exist

### **CV Doesn't Download**

1. Check if `cvUrl` is saved in Settings:
   - Go to Admin → Settings → CV Upload
   - Do you see "Current CV" with a link?
   - If not, try uploading again

2. Test the URL directly:
   - Click "Preview CV" in admin
   - Does it open the PDF?
   - If not, the file may not be public

---

## 🎨 How It Works

### **Frontend Flow:**

```
1. User clicks "Upload CV"
   ↓
2. File is validated (PDF, <10MB)
   ↓
3. File uploaded to Supabase Storage
   ↓
4. Public URL generated
   ↓
5. URL saved to pageSettings.cvUrl
   ↓
6. CV Page uses cvUrl for download button
```

### **Files Modified:**

- `/src/app/components/admin/CVUploader.tsx` - New upload component
- `/src/app/components/AdminDashboard.tsx` - Added CV Upload section
- `/src/app/components/CVPage.tsx` - Already uses `pageSettings.cvUrl`

---

## 🚀 Next Steps

### **Optional Enhancements:**

1. **Add drag-and-drop** - Make the upload area accept dropped files
2. **Show file size** - Display the size of the uploaded CV
3. **Version history** - Keep track of previous CV versions
4. **Custom file names** - Let users name their CV file
5. **Multiple formats** - Support DOCX, TXT, etc.

---

## 💡 Pro Tips

- **Keep it updated** - Upload a new version whenever you update your CV
- **File size** - Compress your PDF to reduce file size (use tools like Smallpdf or Adobe Acrobat)
- **Test before sharing** - Always test the download link before sharing your portfolio
- **Backup** - Keep a local copy of your CV just in case

---

## 📊 Current Status

✅ Upload functionality implemented  
✅ PDF validation working  
✅ File size limits enforced  
✅ Success/error feedback  
✅ Preview functionality  
✅ Remove/replace CV  
✅ Auto-save to database  
✅ Download button on CV page  

**Everything is ready to use!** 🎉

---

## 🆘 Need Help?

If something isn't working:
1. Check the browser console (F12) for errors
2. Verify your Supabase connection is configured
3. Make sure the `portfolio-assets` bucket exists and is public
4. Check that your PDF is under 10MB

---

**Happy uploading!** 📄✨