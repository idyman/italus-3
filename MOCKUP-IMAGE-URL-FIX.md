# Mockup Image URL Issue - "Host is not valid or supported"

## The Problem

Based on the screenshot, you're getting:
- "Host is not valid or supported" errors
- "Host validation failed" errors

This typically means the image URLs are being rejected by something (browser, Supabase, or security policy).

---

## Quick Fix Options

### Option 1: Use Supabase Storage (RECOMMENDED)

Instead of external image URLs, upload images directly to Supabase Storage:

1. In Admin → Edit Project → Mockups section
2. Click the **blue "Upload from Computer"** button
3. Select your mockup image
4. Wait for "Image uploaded!" message
5. The URL will auto-populate
6. Click "Add Mockup"
7. Save the project

**This ensures images are hosted on your own Supabase instance!**

---

### Option 2: Use Direct Image Links

If using external URLs, make sure they are **direct image links**, not pages:

✅ **GOOD:**
```
https://i.imgur.com/abc123.png
https://images.unsplash.com/photo-xxxxx
https://your-cdn.com/image.jpg
```

❌ **BAD:**
```
https://imgur.com/abc123  (gallery page, not image)
https://example.com/page-with-image  (webpage, not image)
```

---

### Option 3: Test with Known-Good URL

Delete all mockups and test with this URL:
```
https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400
```

If this works → Your original URLs were the problem
If this fails → There's a deeper configuration issue

---

## Debug the Current URLs

1. Open console (F12)
2. Look for messages starting with 🖼️
3. Copy the `imageUrl` values
4. Paste them in a new browser tab
5. See if they load

If they don't load in a new tab, they won't work in the app!

---

## Check What URLs You're Using

Expand the console objects:
1. Find: `🔍 Project Detail - Mockups data:`
2. Click the **▶** arrow next to `mockupsData: Array(X)`
3. Click the **▶** arrow next to each object
4. Look at the `imageUrl` value
5. Check if it looks like a valid direct image link

---

## Common URL Problems

### Problem: Imgur Gallery Links
```
https://imgur.com/abc123  ← Gallery page
```
**Fix:** Use direct link:
```
https://i.imgur.com/abc123.png
```

### Problem: Google Drive/Dropbox Links
These often require authentication and won't work.

**Fix:** Upload to Supabase Storage instead.

### Problem: CORS Blocked
Some image hosts block cross-origin requests.

**Fix:** Upload to Supabase Storage.

---

## Recommended Solution

**Use Supabase Storage for all mockup images:**

1. This avoids CORS issues
2. You control the images
3. Faster loading
4. No broken links
5. No external dependencies

The upload button is already built-in (blue section in mockup manager)!

---

## Next Steps

1. ✅ Refresh your project detail page
2. ✅ Open console
3. ✅ Look for 🖼️ messages showing which mockups are trying to render
4. ✅ Look for ❌ messages showing which images failed
5. ✅ Look for ✅ messages showing which images worked

The new logging will tell you exactly which URLs are failing!

Then either:
- Fix the URLs to be direct image links
- OR upload images to Supabase Storage instead
