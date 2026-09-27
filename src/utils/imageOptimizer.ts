/**
 * Image Compression and Optimization Utility
 * Prevents localStorage QuotaExceededError by resizing high-res photos
 * down to clean, crisp web-optimized dimensions with compact byte sizes (~80-150 KB).
 */

export interface OptimizedImageResult {
  dataUrl: string;
  blob: Blob;
  sizeKb: number;
  width: number;
  height: number;
  originalName: string;
}

export function optimizeImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not a valid image format.'));
      return;
    }

    // SVGs can be read directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          blob: file,
          sizeKb: Math.round(file.size / 1024),
          width: 800,
          height: 800,
          originalName: file.name,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale proportionally if either dimension exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const fallbackData = e.target?.result as string;
          resolve({
            dataUrl: fallbackData,
            blob: file,
            sizeKb: Math.round(file.size / 1024),
            width,
            height,
            originalName: file.name,
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-optimized JPEG data URL
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        canvas.toBlob(
          (blob) => {
            resolve({
              dataUrl,
              blob: blob || file,
              sizeKb: approxKb,
              width,
              height,
              originalName: file.name,
            });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to parse image data.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}
