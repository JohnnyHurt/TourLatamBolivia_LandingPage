/**
 * Client-side Image Optimization and Compression Utility.
 * 
 * Compresses oversized images (e.g. 5MB-15MB camera/smartphone photos) down to 
 * lightweight WebP/JPEG images (~40KB-120KB) preserving high visual fidelity.
 * 
 * Produces both:
 * 1. A compressed File object for standard FormData uploads
 * 2. A persistent Data URL (base64) for instant, restart-proof rendering
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

export async function compressImage(
  inputFile: File,
  options: CompressionOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.85,
    mimeType = 'image/webp',
  } = options;

  // 1. If SVG, do not rasterize; read directly as Data URL
  if (inputFile.type === 'image/svg+xml' || inputFile.name.endsWith('.svg')) {
    const dataUrl = await readFileAsDataUrl(inputFile);
    return {
      file: inputFile,
      dataUrl,
      width: maxWidth,
      height: maxHeight,
      size: inputFile.size,
    };
  }

  // 2. Load into Image element
  return new Promise((resolve, reject) => {
    const blobUrl = URL.createObjectURL(inputFile);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);

      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      // Calculate constrained dimensions
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      // Draw onto offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to raw data url if canvas not supported
        readFileAsDataUrl(inputFile)
          .then((dataUrl) =>
            resolve({
              file: inputFile,
              dataUrl,
              width: targetWidth,
              height: targetHeight,
              size: inputFile.size,
            })
          )
          .catch(reject);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Preferred format: webp, fallback to jpeg if toBlob/toDataURL doesn't support webp
      let outputMime = mimeType;
      let dataUrl = canvas.toDataURL(outputMime, quality);

      if (!dataUrl.startsWith(`data:${outputMime}`)) {
        outputMime = 'image/jpeg';
        dataUrl = canvas.toDataURL(outputMime, quality);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback
            resolve({
              file: inputFile,
              dataUrl,
              width: targetWidth,
              height: targetHeight,
              size: inputFile.size,
            });
            return;
          }

          const baseName = inputFile.name.replace(/\.[^/.]+$/, '');
          const ext = outputMime === 'image/webp' ? '.webp' : '.jpg';
          const compressedFile = new File([blob], `${baseName}${ext}`, {
            type: outputMime,
            lastModified: Date.now(),
          });

          resolve({
            file: compressedFile,
            dataUrl,
            width: targetWidth,
            height: targetHeight,
            size: compressedFile.size,
          });
        },
        outputMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      // Fallback
      readFileAsDataUrl(inputFile)
        .then((dataUrl) =>
          resolve({
            file: inputFile,
            dataUrl,
            width: 0,
            height: 0,
            size: inputFile.size,
          })
        )
        .catch(reject);
    };

    img.src = blobUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
