/**
 * Image hashing utilities for detecting similar/duplicate photos
 * Using perceptual hashing (pHash) approach for image similarity
 */

/**
 * Calculate a simple perceptual hash of an image
 * Uses average hash (aHash) - fast and simple
 */
export async function calculateImageHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const hash = generateAverageHash(img);
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate average hash (aHash) for an image
 * Fast perceptual hash suitable for browser use
 */
function generateAverageHash(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0, 8, 8);
  const imageData = ctx.getImageData(0, 0, 8, 8);
  const data = imageData.data;

  // Calculate average grayscale value
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    sum += gray;
  }
  const avg = sum / 64;

  // Generate hash: 1 if pixel > avg, 0 otherwise
  let hash = '';
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    hash += gray > avg ? '1' : '0';
  }

  return hash;
}

/**
 * Calculate Hamming distance between two hashes
 * Lower distance = more similar images
 */
export function calculateHashDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 64; // Max distance for 8x8 hash

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
}

/**
 * Determine if two images are similar based on hash distance
 * threshold: 0-64, lower = stricter similarity
 */
export function areImagesSimilar(hash1: string, hash2: string, threshold = 5): boolean {
  return calculateHashDistance(hash1, hash2) <= threshold;
}

/**
 * Group images by similarity
 */
export function groupImagesByHash(
  images: Array<{ id: string; hash: string }>,
  threshold = 5
): Array<string[]> {
  const groups: Array<string[]> = [];
  const visited = new Set<string>();

  for (const image of images) {
    if (visited.has(image.id)) continue;

    const group = [image.id];
    visited.add(image.id);

    for (const other of images) {
      if (visited.has(other.id)) continue;
      if (areImagesSimilar(image.hash, other.hash, threshold)) {
        group.push(other.id);
        visited.add(other.id);
      }
    }

    if (group.length > 0) {
      groups.push(group);
    }
  }

  return groups;
}
