/**
 * Photo similarity detection service
 * Groups similar/duplicate photos together
 */

import type { SimilarGroup } from '../types';
import { calculateHashDistance, groupImagesByHash } from '../utils/imageHash';

/**
 * Find similar photos and create groups
 */
export function createSimilarityGroups(
  photos: Array<{
    id: string;
    hash: string;
    qualityScore: number;
  }>,
  threshold = 5 // Hamming distance threshold
): SimilarGroup[] {
  const groups = groupImagesByHash(
    photos.map((p) => ({ id: p.id, hash: p.hash })),
    threshold
  );

  return groups
    .filter((group) => group.length > 1) // Only groups with multiple photos
    .map((photoIds) => {
      // Find best photo in group (highest quality score)
      const photosInGroup = photoIds.map((id) => photos.find((p) => p.id === id)!);
      const bestPhoto = photosInGroup.reduce((best, current) =>
        current.qualityScore > best.qualityScore ? current : best
      );

      // Calculate average hash distance in group
      const avgDistance = calculateAverageHashDistance(
        photoIds,
        photos.reduce((acc, p) => ({ ...acc, [p.id]: p.hash }), {} as Record<string, string>)
      );

      const reason =
        avgDistance <= 2
          ? 'duplicate'
          : avgDistance <= 5
            ? 'similar'
            : 'related';

      return {
        id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        photoIds,
        representativePhotoId: photoIds[0],
        bestPhotoId: bestPhoto.id,
        similarityScore: Math.max(0, 100 - avgDistance * 10),
        reason,
      };
    });
}

/**
 * Calculate average hash distance in a group
 */
function calculateAverageHashDistance(
  photoIds: string[],
  hashMap: Record<string, string>
): number {
  if (photoIds.length <= 1) return 0;

  let totalDistance = 0;
  let count = 0;

  for (let i = 0; i < photoIds.length; i++) {
    for (let j = i + 1; j < photoIds.length; j++) {
      const distance = calculateHashDistance(hashMap[photoIds[i]], hashMap[photoIds[j]]);
      totalDistance += distance;
      count++;
    }
  }

  return count > 0 ? totalDistance / count : 0;
}

/**
 * Get all photos related to a specific group
 */
export function getGroupedPhotos(
  groups: SimilarGroup[],
  photoId: string
): SimilarGroup | null {
  return groups.find((group) => group.photoIds.includes(photoId)) || null;
}

/**
 * Merge two similarity groups
 */
export function mergeSimilarityGroups(group1: SimilarGroup, group2: SimilarGroup): SimilarGroup {
  const allPhotoIds = Array.from(new Set([...group1.photoIds, ...group2.photoIds]));
  const combinedScore = (group1.similarityScore + group2.similarityScore) / 2;

  return {
    id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    photoIds: allPhotoIds,
    representativePhotoId: group1.representativePhotoId,
    bestPhotoId: group1.bestPhotoId || group2.bestPhotoId,
    similarityScore: combinedScore,
    reason: 'merged',
  };
}

/**
 * Remove photo from similarity group
 */
export function removePhotoFromGroup(group: SimilarGroup, photoId: string): SimilarGroup | null {
  const newPhotoIds = group.photoIds.filter((id) => id !== photoId);

  if (newPhotoIds.length <= 1) {
    return null; // Group becomes invalid with less than 2 photos
  }

  return {
    ...group,
    photoIds: newPhotoIds,
  };
}
