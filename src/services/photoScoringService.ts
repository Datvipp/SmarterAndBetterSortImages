/**
 * Photo scoring and recommendation service
 * Determines best photo in a group and provides recommendations
 */

import type { Photo } from '../types';

export interface PhotoScore {
  photoId: string;
  score: number;
  recommendation: 'keep' | 'consider' | 'delete' | 'review';
  reasons: string[];
}

/**
 * Score a single photo
 */
export function scorePhoto(photo: Photo): PhotoScore {
  const reasons: string[] = [];
  let score = photo.qualityScore;

  // Adjust score based on labels
  if (photo.qualityLabels.includes('Blurry')) {
    score -= 20;
    reasons.push('Ảnh mờ');
  }
  if (photo.qualityLabels.includes('Too Dark')) {
    score -= 15;
    reasons.push('Ảnh quá tối');
  }
  if (photo.qualityLabels.includes('Overexposed')) {
    score -= 15;
    reasons.push('Ảnh quá sáng');
  }
  if (photo.qualityLabels.includes('Noisy')) {
    score -= 10;
    reasons.push('Ảnh có nhiễu');
  }

  // Boost score if favorite
  if (photo.isFavorite) {
    score += 10;
    reasons.push('Đã yêu thích');
  }

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine recommendation
  let recommendation: 'keep' | 'consider' | 'delete' | 'review';
  if (score >= 75) {
    recommendation = 'keep';
    reasons.push('Chất lượng cao, nên giữ');
  } else if (score >= 50) {
    recommendation = 'consider';
    reasons.push('Chất lượng trung bình, có thể giữ');
  } else if (score >= 25) {
    recommendation = 'review';
    reasons.push('Chất lượng thấp, cần xem lại trước khi quyết định');
  } else {
    recommendation = 'delete';
    reasons.push('Chất lượng rất thấp, nên xóa');
  }

  return {
    photoId: photo.id,
    score,
    recommendation,
    reasons,
  };
}

/**
 * Recommend best photo from a group
 */
export function findBestPhotoInGroup(photos: Photo[]): Photo | null {
  if (photos.length === 0) return null;
  if (photos.length === 1) return photos[0];

  // Score all photos
  const scores = photos.map((photo) => ({
    photo,
    score: scorePhoto(photo),
  }));

  // Sort by score
  scores.sort((a, b) => b.score.score - a.score.score);

  return scores[0].photo;
}

/**
 * Recommend photos to delete from a group
 */
export function recommendPhotosToDelete(photos: Photo[]): Photo[] {
  const scores = photos.map((photo) => ({
    photo,
    score: scorePhoto(photo),
  }));

  return scores
    .filter((item) => item.score.recommendation === 'delete')
    .map((item) => item.photo);
}

/**
 * Recommend photos for review
 */
export function recommendPhotosForReview(photos: Photo[]): Photo[] {
  const scores = photos.map((photo) => ({
    photo,
    score: scorePhoto(photo),
  }));

  return scores
    .filter((item) => item.score.recommendation === 'review')
    .map((item) => item.photo);
}
