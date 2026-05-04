# Firebase Security Rules — Firestore + Storage

This project uses two Firebase services and each has its own rules tab:

- **Firestore** → stores projects & page settings (`projects`, `page_settings` collections)
- **Cloud Storage** → stores uploaded files (`projects/`, `hero/`, `cv/` folders)

Both need rules configured or the admin panel will fall back to localStorage.

---

## 1. Firestore rules

Console path: Firebase Console → Firestore Database → **Rules** tab.

### Option A — Open (dev/testing only, NOT for production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Option B — Public read, authenticated write (recommended)

Requires a Firebase Auth user signed in before writes. Pair this with enabling Email/Password sign-in in Firebase Auth and swapping the admin login to use `signInWithEmailAndPassword`.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /page_settings/{settingsId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Deny everything else by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Option C — Admin-only (most secure)

Lock writes to a specific admin email. Replace `itamardesign@gmail.com` if you use a different admin account.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email == 'itamardesign@gmail.com';
    }

    match /projects/{projectId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /page_settings/{settingsId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 2. Cloud Storage rules

Console path: Firebase Console → Storage → **Rules** tab.

The admin uploads to exactly three folders:

| Folder      | What goes there                      | Max size | MIME type         |
| ----------- | ------------------------------------ | -------- | ----------------- |
| `projects/` | Project images (gallery, thumbnails) | 10 MB    | `image/*`         |
| `hero/`     | Hero background image                | 10 MB    | `image/*`         |
| `cv/`       | CV / résumé                          | 20 MB    | `application/pdf` |

### Option A — Open (dev/testing only)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Option B — Public read, authenticated write (recommended)

Public read is required because the portfolio site loads images and the CV from these URLs in the browser. Writes require a signed-in Firebase Auth user.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Project images — up to 10 MB, images only
    match /projects/{file=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Hero background — up to 10 MB, images only
    match /hero/{file=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // CV PDF — up to 20 MB, PDF only
    match /cv/{file=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 20 * 1024 * 1024
                   && request.resource.contentType == 'application/pdf';
    }

    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Option C — Admin-only (most secure)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email == 'itamardesign@gmail.com';
    }

    match /projects/{file=**} {
      allow read: if true;
      allow write: if isAdmin()
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /hero/{file=**} {
      allow read: if true;
      allow write: if isAdmin()
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /cv/{file=**} {
      allow read: if true;
      allow write: if isAdmin()
                   && request.resource.size < 20 * 1024 * 1024
                   && request.resource.contentType == 'application/pdf';
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Enabling auth for Options B & C

The current admin login in `src/app/App.tsx` uses a hard-coded demo password and does **not** sign into Firebase Auth. To actually use Options B or C:

1. In Firebase Console → Authentication → **Sign-in method**, enable **Email/Password**.
2. In Users, add `itamardesign@gmail.com` (or your preferred admin email) with a password.
3. Replace the demo login flow with `signInWithEmailAndPassword(auth, email, password)` from `firebase/auth` — the `auth` instance is already exported from `src/lib/firebase.ts`.

Until auth is wired up, use **Option A (Open)** on both Firestore and Storage to unblock testing.

---

## Fallback behavior

The app already gracefully handles rule failures: all writes fall back to `localStorage`, so the admin UI never crashes. But:

- ✅ With rules set correctly — changes sync to Firebase, persist across devices, uploaded files are publicly reachable.
- ⚠️ Without rules set — edits survive only in the current browser's localStorage, and uploads fail with a toast error.

## Verifying

1. After publishing rules, wait ~30 seconds for propagation.
2. In the admin, upload an image or CV.
3. Expect a success toast and a `firebasestorage.googleapis.com` URL in the resulting field.
4. If you see "permission denied" → rules not yet published / user not authenticated.
