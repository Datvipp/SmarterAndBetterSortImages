/**
 * File utilities for handling image uploads and metadata extraction
 */

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  width?: number;
  height?: number;
  takenAt?: Date;
}

/**
 * Validate if file is a supported image format
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
  return validTypes.includes(file.type) || /\.(jpg|jpeg|png|webp|heic)$/i.test(file.name);
}

/**
 * Extract basic file metadata
 */
export async function extractFileMetadata(file: File): Promise<FileMetadata> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Read EXIF date from image (simplified - browser limitation)
 * Returns file's last modified date as fallback
 */
export async function extractExifDate(file: File): Promise<Date> {
  // Browser cannot directly read EXIF without external library
  // Return file modified date as fallback
  return new Date(file.lastModified);
}

/**
 * Create a thumbnail from image file
 */
export async function createThumbnail(
  file: File,
  maxWidth = 200,
  maxHeight = 200,
  quality = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Calculate scaling
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create thumbnail blob'));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format image dimensions
 */
export function formatImageDimensions(width?: number, height?: number): string {
  if (!width || !height) return 'Unknown';
  return `${width}×${height}`;
}
