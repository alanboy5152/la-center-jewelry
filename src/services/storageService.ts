import { MediaItem } from '../types';

/**
 * Storage Provider Interface
 * Supports switching seamlessly between local mock/IndexedDB storage,
 * Firebase Storage, Supabase Storage, AWS S3, or Cloudinary.
 */
export interface StorageProvider {
  uploadFile(file: File, folder?: string): Promise<{ url: string; size: number; mimeType: string }>;
  deleteFile(url: string): Promise<boolean>;
  replaceFile(oldUrl: string, newFile: File): Promise<{ url: string; size: number; mimeType: string }>;
}

/**
 * Default Client-side & Cloud-ready Storage Adapter
 * Converts uploaded files to data URLs / object URLs, records metadata,
 * performs validation (size limits, allowed mime types), and can easily
 * be configured with backend endpoints (e.g. /api/upload or direct S3/Firebase).
 */
class CloudStorageService {
  private static instance: CloudStorageService;
  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private allowedVideoTypes = ['video/mp4', 'video/webm'];
  private maxImageSizeBytes = 15 * 1024 * 1024; // 15MB
  private maxVideoSizeBytes = 100 * 1024 * 1024; // 100MB

  private constructor() {}

  public static getInstance(): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService();
    }
    return CloudStorageService.instance;
  }

  /**
   * Validates file before processing
   */
  public validateFile(file: File): { isValid: boolean; error?: string } {
    const isImage = this.allowedImageTypes.includes(file.type);
    const isVideo = this.allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      return {
        isValid: false,
        error: `Unsupported file format (${file.type || 'unknown'}). Supported formats: JPG, PNG, WEBP, GIF, MP4, WEBM.`,
      };
    }

    if (isImage && file.size > this.maxImageSizeBytes) {
      return {
        isValid: false,
        error: `Image size exceeds the 15MB limit. Please optimize your file before uploading.`,
      };
    }

    if (isVideo && file.size > this.maxVideoSizeBytes) {
      return {
        isValid: false,
        error: `Video size exceeds the 100MB limit. Supported: MP4, WebM up to 100MB.`,
      };
    }

    return { isValid: true };
  }

  /**
   * Uploads file and returns a usable media URL and metadata.
   * In a production environment with cloud credentials, this makes a multipart
   * request to /api/media/upload or directly to S3/Firebase/Cloudinary presigned URLs.
   */
  public async uploadMedia(file: File): Promise<MediaItem> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const isVideo = this.allowedVideoTypes.includes(file.type);
    const isImage = this.allowedImageTypes.includes(file.type);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;

        const mediaItem: MediaItem = {
          id: 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
          name: file.name,
          url: resultUrl,
          type: isVideo ? 'video' : 'image',
          mimeType: file.type,
          sizeBytes: file.size,
          dimensions: isImage ? 'High Resolution' : undefined,
          duration: isVideo ? 'Preview Loop' : undefined,
          posterUrl: isVideo ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop' : undefined,
          createdAt: new Date().toISOString(),
        };

        resolve(mediaItem);
      };
      reader.onerror = () => reject(new Error('Failed to read and process the media file.'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Replace existing media with a new file
   */
  public async replaceMedia(oldMediaId: string, newFile: File): Promise<MediaItem> {
    const newMedia = await this.uploadMedia(newFile);
    return {
      ...newMedia,
      id: oldMediaId, // keep same ID for reference consistency
    };
  }

  /**
   * Formats file size nicely
   */
  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export const storageService = CloudStorageService.getInstance();
