# Quick Start: Upload Your CV

## Step 1: Setup Supabase (One-Time Only)

### A. Add Database Column

1. Go to: https://supabase.com/dashboard/project/yzfgllhdlxxhyxafsthd
2. Click **SQL Editor** in the left sidebar
3. Run this SQL:
   ```sql
   ALTER TABLE page_settings ADD COLUMN IF NOT EXISTS cv_url TEXT;
   ```
4. Click **Run**

### B. Create Storage Bucket

**Option 1: Automatic** (Recommended)
- Just try uploading a CV - the app will create the bucket automatically!

**Option 2: Manual** (If automatic doesn't work)
1. Go to: https://supabase.com/dashboard/project/yzfgllhdlxxhyxafsthd
2. Click **Storage** in the left sidebar
3. Click **"New bucket"**
4. Name: `portfolio-files`
5. Enable **"Public bucket"** toggle
6. Click **"Create bucket"**

Done! ✅

## Step 2: Upload Your CV

### Using the Admin Dashboard (No need to go to Supabase!)

1. **Login**
   - Click "admin" in the top right of your portfolio
   - Username: `admin`
   - Password: `admin123`

2. **Go to Settings**
   - Click the "Settings" tab

3. **Upload Your CV**
   - Scroll down to the "CV Settings" section
   - You'll see a gray dashed box that says "📄 Upload CV (PDF)"
   - Click "Choose File"
   - Select your CV PDF (must be under 10MB)
   - Wait for "Uploading..." to finish
   - Done! ✅

## That's It!

Your CV is now:
- ✅ Uploaded to Supabase Storage automatically
- ✅ Visible on your portfolio via the "My CV" button
- ✅ Downloadable by visitors

## No Need to Use Supabase Dashboard for Uploading

You **do NOT** need to manually upload files to Supabase Storage. The admin dashboard handles everything for you:

- File upload ✅
- Storage management ✅
- URL generation ✅
- Database update ✅

The only time you need to access Supabase is to run the initial database migration (Step 1 above).

## Alternative: Manual URL Method

If you already have your CV hosted somewhere (Google Drive, Dropbox, personal website):

1. Make sure the file is publicly accessible
2. Copy the direct URL to the PDF
3. Paste it in the "Paste CV URL Manually" field
4. Done!

## Preview & Remove

Once uploaded, you can:
- **Preview** your CV by clicking the "Preview CV" button
- **Remove** your CV by clicking the "Remove CV" button
- **Replace** your CV by uploading a new file (the old one is replaced automatically)
