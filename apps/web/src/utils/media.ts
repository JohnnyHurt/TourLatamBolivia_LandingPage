/**
 * Utility to safely resolve media URLs (images, logos, avatars, photos).
 * Handles:
 * - Data URLs and Blob URLs for instant file upload previews
 * - Relative /uploads/... URLs (resolved through current origin or Vite proxy)
 * - Absolute localhost:4000/uploads/... URLs (converted to relative /uploads/... so they proxy smoothly)
 * - External URLs (e.g. Unsplash, CDN, S3)
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already a local preview or data URL, return directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // If pointing to localhost:4000/uploads, convert to relative /uploads
  if (trimmed.includes('localhost:4000/uploads/')) {
    const file = trimmed.split('localhost:4000/uploads/')[1];
    return `/uploads/${file}`;
  }

  // If pointing to another host with /uploads/, but accessing via frontend
  if (trimmed.startsWith('http://') && trimmed.includes('/uploads/')) {
    const parts = trimmed.split('/uploads/');
    if (parts.length > 1) {
      return `/uploads/${parts[1]}`;
    }
  }

  return trimmed;
}
