/**
 * Photo image analysis service
 * Analyzes image quality based on sharpness, brightness, contrast, etc.
 */

import type { PhotoAnalysis } from '../types';

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/**
 * Analyze image quality and generate quality score
 */
export async function analyzeImageQuality(imageUrl: string): Promise<PhotoAnalysis> {
  const imageData = await getImageData(imageUrl);
  
  const sharpnessScore = calculateSharpnessScore(imageData);
  const brightnessScore = calculateBrightnessScore(imageData);
  const contrastScore = calculateContrastScore(imageData);
  const noiseScore = calculateNoiseScore(imageData);
  const compositionScore = calculateCompositionScore(imageData);

  // Calculate weighted overall score
  const overallScore = Math.round(
    (sharpnessScore * 0.35 +
      brightnessScore * 0.20 +
      contrastScore * 0.15 +
      compositionScore * 0.20 +
      (100 - noiseScore) * 0.10) *
      100
  ) / 100;

  const labels = generateLabels(
    sharpnessScore,
    brightnessScore,
    contrastScore,
    noiseScore,
    overallScore
  );

  const reasons = generateReasons(
    sharpnessScore,
    brightnessScore,
    contrastScore,
    noiseScore,
    overallScore
  );

  return {
    photoId: imageUrl,
    sharpnessScore,
    brightnessScore,
    contrastScore,
    noiseScore,
    compositionScore,
    overallScore,
    labels,
    reasons,
    analyzedAt: new Date(),
  };
}

/**
 * Get image data from URL
 */
async function getImageData(imageUrl: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        data: imageData.data,
        width: canvas.width,
        height: canvas.height,
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Calculate sharpness score using Laplacian edge detection
 */
function calculateSharpnessScore(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const grayscale = new Uint8ClampedArray(width * height);

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  // Calculate Laplacian variance
  let variance = 0;
  let mean = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const laplacian =
        -grayscale[idx - width - 1] -
        grayscale[idx - width] -
        grayscale[idx - width + 1] -
        grayscale[idx - 1] +
        8 * grayscale[idx] -
        grayscale[idx + 1] -
        grayscale[idx + width - 1] -
        grayscale[idx + width] -
        grayscale[idx + width + 1];

      mean += laplacian;
      variance += laplacian * laplacian;
    }
  }

  mean /= (width - 2) * (height - 2);
  variance /= (width - 2) * (height - 2);
  variance -= mean * mean;

  // Normalize to 0-100 scale
  // Higher variance = sharper image
  const sharpness = Math.sqrt(Math.max(0, variance));
  return Math.min(100, (sharpness / 50) * 100); // Normalize assuming max variance ~50
}

/**
 * Calculate brightness score
 */
function calculateBrightnessScore(imageData: ImageData): number {
  const { data } = imageData;
  let totalBrightness = 0;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    totalBrightness += gray;
  }

  const avgBrightness = totalBrightness / (data.length / 4);

  // Ideal brightness around 128 (50% gray)
  // Score decreases as we move away from ideal
  const deviation = Math.abs(avgBrightness - 128);
  return Math.max(0, 100 - deviation);
}

/**
 * Calculate contrast score
 */
function calculateContrastScore(imageData: ImageData): number {
  const { data } = imageData;
  const grayscale = new Uint8ClampedArray(data.length / 4);

  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  // Calculate standard deviation of brightness
  let mean = 0;
  for (let i = 0; i < grayscale.length; i++) {
    mean += grayscale[i];
  }
  mean /= grayscale.length;

  let variance = 0;
  for (let i = 0; i < grayscale.length; i++) {
    variance += (grayscale[i] - mean) * (grayscale[i] - mean);
  }
  variance /= grayscale.length;

  const stdDev = Math.sqrt(variance);

  // Normalize standard deviation to 0-100 scale
  // Higher standard deviation = higher contrast
  return Math.min(100, (stdDev / 1.27) * 100); // Normalize assuming max stdDev ~127.5
}

/**
 * Estimate noise in image
 */
function calculateNoiseScore(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const grayscale = new Uint8ClampedArray(width * height);

  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  // Calculate local variance as noise indicator
  let totalVariance = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const neighbors = [
        grayscale[idx - width - 1],
        grayscale[idx - width],
        grayscale[idx - width + 1],
        grayscale[idx - 1],
        grayscale[idx],
        grayscale[idx + 1],
        grayscale[idx + width - 1],
        grayscale[idx + width],
        grayscale[idx + width + 1],
      ];

      const mean = neighbors.reduce((a, b) => a + b) / 9;
      const variance = neighbors.reduce((sum, val) => sum + (val - mean) * (val - mean), 0) / 9;
      totalVariance += variance;
      count++;
    }
  }

  const avgVariance = totalVariance / count;

  // Normalize to 0-100 scale (higher noise = higher score)
  return Math.min(100, (avgVariance / 10) * 100);
}

/**
 * Calculate composition score (simplified)
 * Based on image distribution
 */
function calculateCompositionScore(_imageData: ImageData): number {
  // Simplified: return a middle score
  // In a real implementation, would check rule of thirds, subject positioning, etc.
  return 75;
}

/**
 * Generate quality labels based on scores
 */
function generateLabels(
  sharpness: number,
  brightness: number,
  _contrast: number,
  noise: number,
  overall: number
): string[] {
  const labels: string[] = [];

  if (overall >= 80) labels.push('Best Shot');
  else if (overall >= 60) labels.push('Good');
  else if (overall >= 40) labels.push('Average');
  else labels.push('Poor');

  if (sharpness < 40) labels.push('Blurry');
  if (brightness < 30) labels.push('Too Dark');
  if (brightness > 90) labels.push('Overexposed');
  if (noise > 70) labels.push('Noisy');

  return labels;
}

/**
 * Generate reasons for the quality score
 */
function generateReasons(
  sharpness: number,
  brightness: number,
  contrast: number,
  noise: number,
  overall: number
): string[] {
  const reasons: string[] = [];

  if (sharpness > 70) reasons.push('Ảnh rất sắc nét');
  else if (sharpness < 40) reasons.push('Ảnh hơi mờ, có thể không sắc nét hoàn toàn');

  if (brightness >= 40 && brightness <= 80) reasons.push('Độ sáng cân bằng tốt');
  else if (brightness < 30) reasons.push('Ảnh quá tối, cần tăng độ sáng');
  else if (brightness > 90) reasons.push('Ảnh quá sáng, mất chi tiết vùng sáng');

  if (contrast > 60) reasons.push('Độ tương phản cao, chi tiết rõ ràng');
  else if (contrast < 40) reasons.push('Độ tương phản thấp, ảnh hơi nhạt');

  if (noise > 70) reasons.push('Ảnh có nhiều nhiễu, chất lượng giảm');

  if (overall >= 80) reasons.push('Ảnh chất lượng cao, đáng giữ lại');
  else if (overall < 40) reasons.push('Ảnh có vấn đề, cân nhắc xóa hoặc thay thế');

  return reasons;
}
