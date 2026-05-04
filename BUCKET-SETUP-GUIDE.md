# Storage Bucket Setup Guide

If you see the error "Bucket not found", you need to create a storage bucket in Supabase. The app will try to create it automatically, but if that doesn't work, follow these manual steps:

## Manual Bucket Creation (Simple!)

### Step 1: Go to Supabase Storage

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/yzfgllhdlxxhyxafsthd
2. Click **Storage** in the left sidebar
3. Click the **"New bucket"** button

### Step 2: Create the Bucket

Fill in these details:

- **Name**: `portfolio-files`
- **Public bucket**: ✅ **Enable this** (toggle ON)
- **File size limit**: 50 MB (optional, but recommended)

Click **"Create bucket"**

### Step 3: Verify

You should now see a bucket named "portfolio-files" in your Storage list.

### Step 4: Test Upload

1. Go back to your portfolio admin dashboard
2. Try uploading your CV again
3. It should work now! ✅

## What This Bucket Does

The `portfolio-files` bucket stores:
- Your CV PDFs uploaded from the admin dashboard
- Files are stored in the `cvs/` folder inside the bucket
- Files are publicly accessible (so visitors can view/download your CV)

## Alternative: Let the App Create It

The app now tries to create the bucket automatically when you upload a CV. Just try uploading again and it should work!

## Troubleshooting

### "Bucket not found" error persists

If you still get the error after creating the bucket:
1. Make sure the bucket name is exactly: `portfolio-files` (no spaces, no capital letters)
2. Make sure "Public bucket" is enabled
3. Refresh your admin dashboard page
4. Try uploading again

### Can't create bucket

If you don't have permission to create buckets:
1. You might be using a restricted Supabase account
2. Contact your Supabase project admin
3. Or use the "Paste CV URL Manually" option instead (upload to Google Drive, Dropbox, etc.)

## No Database Migration Needed!

Good news: Storage buckets don't require SQL migrations. Just create the bucket through the UI and you're done!

(You still need to run the SQL migration to add the `cv_url` column to the database, but that's separate from the storage bucket)
