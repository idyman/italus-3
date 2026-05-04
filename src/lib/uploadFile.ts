import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// Sanitize a filename so Storage paths stay URL-safe.
function sanitize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface UploadOptions {
  folder: string;           // e.g. 'projects', 'hero', 'cv'
  maxSizeBytes?: number;    // reject before upload
  allowedMimePrefix?: string; // e.g. 'image/' or 'application/pdf'
}

export async function uploadFile(file: File, options: UploadOptions): Promise<string> {
  const { folder, maxSizeBytes, allowedMimePrefix } = options;

  if (allowedMimePrefix && !file.type.startsWith(allowedMimePrefix)) {
    throw new Error(`Unsupported file type: ${file.type || 'unknown'}`);
  }
  if (maxSizeBytes && file.size > maxSizeBytes) {
    const mb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    throw new Error(`File is too large (max ${mb} MB)`);
  }

  const path = `${folder}/${Date.now()}-${sanitize(file.name) || 'file'}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file, { contentType: file.type || undefined });
  return getDownloadURL(fileRef);
}
