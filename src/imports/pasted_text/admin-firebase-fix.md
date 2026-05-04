## COMPLETE FIX: Make the entire Italus portfolio admin work with Firebase

### THE PROBLEM
The site was migrated from Supabase to Firebase. The public portfolio page works. But the Admin Dashboard has these issues:
1. "Bucket not found" errors on all image uploads (Firebase Storage not available — no Blaze plan)
2. Some admin components may still reference Supabase
3. Not all Firestore collections are set up for admin features

### WHAT I NEED YOU TO DO

Fix EVERY admin component so the entire admin dashboard works perfectly with Firebase Firestore. No file uploads — URL-only for all images. Here is the complete specification:

---

### A. FIREBASE CONFIG
Already set up in `src/lib/firebase.ts`:
- Project ID: `italus-c3a03`
- All credentials are correct and working

### B. FIRESTORE COLLECTIONS & THEIR SCHEMAS

The admin must read/write to these Firestore collections:

**Collection: `projects`** (already exists with data)
```
{
  id: auto-generated,
  title: string,
  description: string,
  detailed_text: string,
  tags: array of strings,
  link: string,
  grid_size: string ("normal" | "large" | "small"),
  image_fit: string ("cover" | "contain"),
  images: array of objects [{url: string, alt: string}],
  colors: array of strings,
  featured: boolean,
  sort_order: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

**Collection: `hero_images`**
```
{
  id: auto-generated,
  image_url: string,
  alt_text: string,
  active: boolean,
  sort_order: number,
  created_at: timestamp
}
```

**Collection: `logos`**
```
{
  id: auto-generated,
  project_id: string (reference to project),
  image_url: string,
  variant: string ("primary" | "secondary" | "icon"),
  sort_order: number,
  created_at: timestamp
}
```

**Collection: `mockups`**
```
{
  id: auto-generated,
  project_id: string (reference to project),
  image_url: string,
  device_type: string ("desktop" | "mobile" | "tablet"),
  alt_text: string,
  sort_order: number,
  created_at: timestamp
}
```

**Collection: `typography`**
```
{
  id: auto-generated,
  project_id: string (reference to project),
  font_name: string,
  font_style: string,
  usage_description: string,
  specimen_image_url: string,
  sort_order: number,
  created_at: timestamp
}
```

**Collection: `motion`**
```
{
  id: auto-generated,
  project_id: string (reference to project),
  video_url: string,
  thumbnail_url: string,
  title: string,
  description: string,
  sort_order: number,
  created_at: timestamp
}
```

**Collection: `case_studies`**
```
{
  id: auto-generated,
  project_id: string (reference to project),
  title: string,
  content: string,
  challenge: string,
  solution: string,
  outcome: string,
  images: array of objects [{url: string, alt: string}],
  sort_order: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

**Collection: `cv_sections`**
```
{
  id: auto-generated,
  section_type: string ("experience" | "education" | "skills" | "awards" | "custom"),
  title: string,
  company: string,
  role: string,
  start_date: string,
  end_date: string,
  location: string,
  description: string,
  skills: array of strings,
  sort_order: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

**Collection: `page_settings`**
```
{
  id: "home" | "portfolio" | "cv",
  hero_title: string,
  hero_subtitle: string,
  quote_text: string,
  quote_author: string,
  footer_text: string,
  updated_at: timestamp
}
```

---

### C. REQUIRED CHANGES TO EACH FILE

#### `src/hooks/useFirebaseData.ts`
Make sure this file exports hooks/functions for ALL collections above:
- `useProjects()` — CRUD for projects
- `useHeroImages()` — CRUD for hero_images
- `useLogos(projectId)` — CRUD for logos filtered by project
- `useMockups(projectId)` — CRUD for mockups filtered by project
- `useTypography(projectId)` — CRUD for typography filtered by project
- `useMotion(projectId)` — CRUD for motion filtered by project
- `useCaseStudies(projectId)` — CRUD for case_studies filtered by project
- `useCVSections()` — CRUD for cv_sections
- `usePageSettings(pageId)` — read/write for page_settings
- Each hook should return: `{ data, loading, error, add, update, remove }`
- All write operations should include `updated_at: new Date()` automatically

#### `src/app/components/AdminDashboard.tsx`
- Import and use ONLY Firebase hooks from `useFirebaseData.ts`
- Remove ANY remaining Supabase imports
- Remove ALL file upload / "Choose File" buttons
- For project images: use URL text input fields ONLY
- Show a text input for image URL with a preview when URL is entered
- CRUD operations: create, read, update, delete projects
- Show success/error toast messages for all operations

#### `src/app/components/HeroImageManager.tsx`
- Use `useHeroImages()` hook
- Remove file upload — URL input only
- Allow adding, reordering, toggling active/inactive, and deleting hero images
- Show image preview when URL is entered

#### `src/app/components/ProjectImageManager.tsx`
- Use project's `images` array field in Firestore
- Remove file upload — URL input only
- Allow adding up to 10 image URLs per project
- Show thumbnails of current images
- Allow reordering and deleting images

#### `src/app/components/LogoManager.tsx`
- Use `useLogos(projectId)` hook
- Remove file upload — URL input only
- Allow adding logo variants (primary, secondary, icon)
- Show logo previews

#### `src/app/components/MockupManager.tsx`
- Use `useMockups(projectId)` hook
- Remove file upload — URL input only
- Allow selecting device type (desktop, mobile, tablet)
- Show mockup previews

#### `src/app/components/MotionManager.tsx`
- Use `useMotion(projectId)` hook
- Allow adding video URLs (YouTube, Vimeo, or direct MP4 links)
- Thumbnail URL input
- Show video embeds or thumbnail previews

#### `src/app/components/TypographyManager.tsx`
- Use `useTypography(projectId)` hook
- Fields: font name, style, usage description, specimen image URL
- Show specimen image preview

#### `src/app/components/admin/CaseStudyManager.tsx`
- Use `useCaseStudies(projectId)` hook
- Rich text fields for challenge, solution, outcome
- Image URLs for case study images (no file upload)

#### `src/app/components/admin/CVAdmin.tsx`
- Use `useCVSections()` hook
- CRUD for CV sections (experience, education, skills, awards)
- Allow reordering sections

#### `src/app/components/admin/CVUploader.tsx`
- Remove this component entirely OR convert it to a simple form
- No file uploads

#### `src/app/components/admin/CVDataImporter.tsx`
- If it imports from Supabase, switch to Firebase
- Or remove if not needed

#### `src/app/components/LoginPage.tsx`
- Use Firebase Auth for login
- Email/password authentication
- Protect admin routes — only authenticated users can access /admin

#### `src/app/components/PortfolioPage.tsx`
- Should already work with Firebase — verify it uses `useProjects()` hook
- Display all projects from Firestore
- Sort by sort_order or created_at

#### `src/app/components/ProjectDetailPage.tsx`
- Load single project from Firestore by ID or slug
- Display project images, case studies, mockups, logos, typography, motion
- All data from their respective Firestore collections

#### `src/app/App.tsx`
- Remove ANY Supabase imports
- Use Firebase Auth for protected routes
- Lazy load admin components
- Make sure routing works: /, /project/:id, /cv, /admin, /login

---

### D. CRITICAL RULES

1. **ZERO file uploads anywhere** — every image/media is added via URL text input
2. **ZERO Supabase references** — no imports from supabase.ts or useSupabaseData.ts
3. **Every admin form must show image previews** when a URL is pasted
4. **Every save/delete action must show feedback** (success or error message)
5. **All data persists in Firestore** — no localStorage, no hardcoded demo data as primary source
6. **Demo/fallback data is OK** but only when Firestore is empty (graceful fallback)
7. **Admin must be password-protected** via Firebase Auth

---

### E. CLEANUP

Delete or ignore these files (they're Supabase leftovers and not needed):
- `src/lib/supabase.ts` (delete if exists)
- `src/hooks/useSupabaseData.ts` (delete if exists)
- All `supabase-migration-*.sql` files (ignore — not used)
- `SUPABASE_SETUP.md` (ignore — not used)
- `supabase-schema.sql` (ignore — not used)
- `supabase-setup.sql` (ignore — not used)

---

### F. TESTING CHECKLIST

After making changes, verify:
- [ ] Portfolio page loads projects from Firestore
- [ ] Admin login works with Firebase Auth
- [ ] Can create a new project from admin (saved to Firestore)
- [ ] Can edit an existing project
- [ ] Can delete a project
- [ ] Can add images via URL (with preview)
- [ ] Can manage hero images via URL
- [ ] Can manage logos, mockups, typography, motion via URL
- [ ] Can manage case studies
- [ ] Can manage CV sections
- [ ] No console errors about Supabase or bucket not found
- [ ] No console errors about missing imports
- [ ] Project detail page loads all related data