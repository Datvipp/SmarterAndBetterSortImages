/**
 * Search service for photos
 */

import type { Photo, PhotoFilter } from '../types';

/**
 * Search photos based on filters
 */
export function searchPhotos(photos: Photo[], filter: PhotoFilter): Photo[] {
  let results = [...photos];

  // Filter deleted photos by default
  if (filter.isDeleted === undefined) {
    results = results.filter((p) => !p.isDeleted);
  } else if (filter.isDeleted === true) {
    results = results.filter((p) => p.isDeleted);
  } else {
    results = results.filter((p) => !p.isDeleted);
  }

  // Search text
  if (filter.searchText) {
    const text = filter.searchText.toLowerCase();
    results = results.filter((p) =>
      p.fileName.toLowerCase().includes(text) ||
      p.tags.some((tag) => tag.toLowerCase().includes(text))
    );
  }

  // Filter by album
  if (filter.albumId) {
    results = results.filter((p) => p.albumIds.includes(filter.albumId!));
  }

  // Filter by date range
  if (filter.startDate) {
    results = results.filter((p) => new Date(p.createdAt) >= filter.startDate!);
  }
  if (filter.endDate) {
    results = results.filter((p) => new Date(p.createdAt) <= filter.endDate!);
  }

  // Filter by tags
  if (filter.tags && filter.tags.length > 0) {
    results = results.filter((p) =>
      filter.tags!.every((tag) => p.tags.includes(tag))
    );
  }

  // Filter by quality labels
  if (filter.qualityLabels && filter.qualityLabels.length > 0) {
    results = results.filter((p) =>
      filter.qualityLabels!.some((label) => p.qualityLabels.includes(label))
    );
  }

  // Filter by favorite
  if (filter.isFavorite !== undefined) {
    results = results.filter((p) => p.isFavorite === filter.isFavorite);
  }

  // Filter by similarity group
  if (filter.similarityGroup) {
    results = results.filter((p) => p.similarGroupId === filter.similarityGroup);
  }

  return results;
}

/**
 * Sort photos by various criteria
 */
export function sortPhotos(
  photos: Photo[],
  sortBy: 'date' | 'quality' | 'name' | 'size' = 'date',
  order: 'asc' | 'desc' = 'desc'
): Photo[] {
  const sorted = [...photos];

  const compareFn = (a: Photo, b: Photo): number => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.takenAt || a.createdAt).getTime() -
          new Date(b.takenAt || b.createdAt).getTime();
        break;
      case 'quality':
        comparison = a.qualityScore - b.qualityScore;
        break;
      case 'name':
        comparison = a.fileName.localeCompare(b.fileName);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  };

  sorted.sort(compareFn);
  return sorted;
}

/**
 * Group photos by date
 */
export function groupPhotosByDate(photos: Photo[]): Map<string, Photo[]> {
  const grouped = new Map<string, Photo[]>();

  for (const photo of photos) {
    const date = new Date(photo.takenAt || photo.createdAt);
    const dateKey = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(photo);
  }

  return grouped;
}

/**
 * Group photos by month
 */
export function groupPhotosByMonth(photos: Photo[]): Map<string, Photo[]> {
  const grouped = new Map<string, Photo[]>();

  for (const photo of photos) {
    const date = new Date(photo.takenAt || photo.createdAt);
    const monthKey = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
    });

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(photo);
  }

  return grouped;
}
