# CLAUDE.md — Italus 3

Read this first when starting a Claude Code session in this repo. The user's
global instructions still apply on top of this file.

## Architecture

```
                         git push (main)               auto-deploy
  Mac (this repo)  ─────────────────────▶  GitHub  ─────────────▶  Netlify
                                                                       │
                                                                       │ static site
                                                                       ▼
                                                                   public web

  React app  ──── Firebase Web SDK ────▶  Firebase project: italus-c3a03
                                          ├─ Firestore   (projects, page settings, CV data)
                                          ├─ Storage     (uploaded images: projects/, logos/, mockups/)
                                          └─ Auth        (admin sign-in, single user)
```

- **Code pipeline:** Mac → GitHub `main` → Netlify auto-deploy.
- **Data + media:** Firebase project `italus-c3a03` (Firestore + Storage + Auth).
- **Local dev:** `npm run dev` → `http://localhost:5173`.
- **Production build:** `npm run build` (Vite). **Currently broken** — see "Known issues" below.
- The Firebase web `apiKey` in `src/lib/firebase.ts` is intentionally public; security comes from Firestore + Storage rules + Auth, not from hiding the key.

## Stack

- **Framework:** Vite + React 18 + TypeScript (no `tsconfig.json`, no `tsc` step — esbuild type-erasure only).
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite` plugin).
- **UI primitives:** Radix UI + a shadcn-style local `components/ui/` set.
- **Animation:** Motion (formerly Framer Motion).
- **Icons:** lucide-react.
- **Firebase:** modular SDK v9+ (`firebase/app`, `firebase/firestore`, `firebase/storage`, `firebase/auth`).
- **Toasts:** `sonner`.

## Repo layout

```
src/
├── main.tsx                       # entry; mounts <App/>
├── lib/
│   ├── firebase.ts                # initializes app + exports db, storage, auth
│   └── uploadFile.ts              # uploadFile(), deleteFileByUrl() helpers
├── hooks/
│   └── useFirebaseData.ts         # useProjects, usePageSettings, useCVData
├── app/
│   ├── App.tsx                    # router shell, lazy-loads pages, defines types
│   └── components/
│       ├── PortfolioPage.tsx      # public landing
│       ├── ProjectDetailPage.tsx  # public project view (lazy)
│       ├── CVPage.tsx             # public CV (lazy)
│       ├── LoginPage.tsx          # admin login (lazy)
│       ├── AdminDashboard.tsx     # admin shell + projects + page settings tabs (lazy)
│       ├── ProjectImageManager.tsx, LogoManager.tsx,
│       ├── TypographyManager.tsx, MotionManager.tsx, HeroImageManager.tsx
│       └── admin/
│           ├── FirebaseImageUploader.tsx  # reusable file-upload-or-paste-URL component
│           ├── MockupManager.tsx, CaseStudyManager.tsx, CVUploader.tsx
│           └── (BrandingProjectAutomation, CVAdmin, CVDataImporter — currently unused)
└── styles/
    └── index.css                  # Tailwind entry
```

## Image upload conventions

All admin image inputs go through `FirebaseImageUploader` (`src/app/components/admin/FirebaseImageUploader.tsx`):

- Drop or click-to-browse uploads to Firebase Storage via `uploadFile()`.
- The download URL is written into the form state (`onChange(url)`).
- A collapsible "Use URL instead" / "Edit URL manually" fallback lets you paste an external URL (Imgur, Cloudinary, etc.).
- The Remove button calls `deleteFileByUrl(url)` — it deletes the file from Firebase Storage if the URL points at our bucket, no-op otherwise. Row-level remove handlers in `ProjectImageManager`, `LogoManager`, and `MockupManager` do the same.

Storage folder convention: `projects/`, `logos/`, `mockups/`, plus `hero/` and `cv/` for page settings.

## Known issues (see step-6 health-check report for context)

- **`npm run build` fails** — `vite.config.ts` declares `minify: 'terser'` but `terser` isn't in `package.json`. Fix: `npm install --save-dev terser`, OR switch to `minify: 'esbuild'` (loses `drop_console` config).
- **Git remote is a placeholder** (`https://github.com/YOUR-USERNAME/italus-3.git`). `git push` fails until set with `git remote set-url origin <real-url>`.
- **No TypeScript checking step.** `tsc --noEmit` and a `tsconfig.json` would be a worthwhile addition.
- **`@supabase/supabase-js`** is in dependencies and `vite.config.ts` `manualChunks` but has zero imports — vestigial from a pre-Firebase era. Safe to drop.
- **Three unfinished admin components** (`BrandingProjectAutomation`, `CVAdmin`, `CVDataImporter`) sit in `src/app/components/admin/` with zero importers — likely abandoned tab features.

## Workflow

- Itamar uses a `save` alias (`git add . && git commit -m "Update" && git push`) for quick commits.
- When Itamar confirms a feature works on localhost, **commit and push immediately** with a Conventional Commits message (`feat:`, `fix:`, `chore:`, etc.) — don't wait to be asked. Use `git add <specific-paths>` rather than `git add .` for cleaner history.
- Don't bundle unrelated changes into one commit; keep each commit individually revertable.
- Test on `localhost:5173` between changes. Don't push broken code.
