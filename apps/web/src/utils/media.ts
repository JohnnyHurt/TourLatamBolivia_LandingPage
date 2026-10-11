/**
 * Utility to safely resolve media URLs (images, logos, avatars, photos).
 * Handles:
 * - Data URLs and Blob URLs for instant file upload previews
 * - Relative /uploads/... URLs (resolved against API host if deployed on Vercel/Render, or Vite proxy locally)
 * - Absolute localhost:4000/uploads/... URLs (converted to remote API host or local proxy)
 * - External URLs (e.g. Unsplash, CDN, S3, Supabase Storage)
 */
function getApiOrigin(): string {
  const rawApi = ((import.meta.env.VITE_API_URL as string) || '').trim();
  if (rawApi && (rawApi.startsWith('http://') || rawApi.startsWith('https://'))) {
    try {
      const parsed = new URL(rawApi);
      return parsed.origin;
    } catch {
      // ignore
    }
  }
  return '';
}

export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already a local preview or data URL, return directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // If pointing to localhost:4000/uploads or relative /uploads/
  let uploadPath = '';
  if (trimmed.includes('/uploads/')) {
    const parts = trimmed.split('/uploads/');
    uploadPath = `/uploads/${parts[1]}`;
  } else if (trimmed.startsWith('/uploads/')) {
    uploadPath = trimmed;
  }

  if (uploadPath) {
    const apiOrigin = getApiOrigin();
    if (apiOrigin) {
      return `${apiOrigin}${uploadPath}`;
    }
    return uploadPath;
  }

  return trimmed;
}
