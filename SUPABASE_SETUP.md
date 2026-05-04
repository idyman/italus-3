# Supabase Setup Guide for CV Admin

This guide will help you set up Supabase to manage your CV data through the admin panel.

## Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in to your account
2. Select your project (or create a new one)
3. Go to **Project Settings** (gear icon in the sidebar)
4. Click on **API** in the settings menu
5. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 2: Create Environment File

1. In your project root, create a file named `.env`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Replace `your_supabase_project_url_here` and `your_supabase_anon_key_here` with the values you copied

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Create Database Tables

1. In your Supabase project, go to the **SQL Editor** (database icon in the sidebar)
2. Click **New query**
3. Copy the entire contents of the `supabase-schema.sql` file in your project root
4. Paste it into the SQL editor
5. Click **Run** to execute the SQL

This will create the following tables:
- `cv_profile` - Your personal information and summary
- `cv_work_experience` - Work history entries
- `cv_education` - Education entries
- `cv_languages` - Languages you speak
- `cv_skills` - Skill categories

## Step 4: Verify Tables Were Created

1. Go to **Table Editor** in the Supabase sidebar
2. You should see all 5 new tables listed
3. You can click on each table to see its structure

## Step 5: Test the Connection

1. Restart your development server (if it's running)
2. Log in to your admin panel
3. Click on the **CV** tab
4. Try adding a profile entry or work experience
5. If everything is set up correctly, you should be able to create, edit, and delete CV entries

## Step 6: Populate Your CV Data

Now you can start adding your actual CV information:

### Profile Tab
- Add your name, contact info, positioning summary, and core strengths

### Work Experience Tab
- Add your work history with companies, roles, dates, and responsibilities

### Education Tab  
- Add your educational background

### Languages Tab
- Add languages you speak with proficiency levels

### Skills Tab
- Add skill categories (e.g., "Software", "Design Tools") with individual skills

## Troubleshooting

### "Bucket not found" error
If you see this error when uploading your CV PDF:
1. Go to **Storage** in Supabase sidebar
2. Click **Create a new bucket**
3. Name it `portfolio-files`
4. Make it **public**
5. Try uploading again

### Tables not showing up
- Make sure you ran the SQL schema successfully
- Check the SQL editor for any error messages
- Verify you're looking at the correct project

### Connection errors
- Double-check your `.env` file has the correct URL and key
- Make sure there are no extra spaces or quotes
- Restart your development server after creating the `.env` file

### Data not saving
- Check browser console for errors
- Verify Row Level Security policies were created correctly
- Make sure you're logged into the admin panel

## Security Notes

- The current setup allows public read access to CV data (so visitors can see your CV)
- Write access requires authentication (only you can edit through admin panel)
- For production, consider implementing proper authentication with Supabase Auth
- Never commit your `.env` file to version control

## Next Steps

Once everything is working:
1. Update the CV page to fetch data from Supabase instead of using hardcoded values
2. Implement proper authentication using Supabase Auth
3. Add image upload for profile photos if needed
4. Consider adding more sections (certifications, awards, etc.)
