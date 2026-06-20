/**
 * Album management service
 */

import type { Album } from '../types';

/**
 * Create a new album
 */
export function createAlbum(
  userId: string,
  name: string,
  type: Album['type'] = 'manual'
): Album {
  return {
    id: `album-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    name,
    type,
    photoIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
  };
}

/**
 * Add photos to album
 */
export function addPhotosToAlbum(album: Album, photoIds: string[]): Album {
  const newPhotoIds = Array.from(new Set([...album.photoIds, ...photoIds]));
  return {
    ...album,
    photoIds: newPhotoIds,
    updatedAt: new Date(),
  };
}

/**
 * Remove photos from album
 */
export function removePhotosFromAlbum(album: Album, photoIds: string[]): Album {
  const photoIdSet = new Set(photoIds);
  return {
    ...album,
    photoIds: album.photoIds.filter((id) => !photoIdSet.has(id)),
    updatedAt: new Date(),
  };
}

/**
 * Set album cover photo
 */
export function setAlbumCover(album: Album, photoId: string): Album {
  return {
    ...album,
    coverPhotoId: photoId,
    updatedAt: new Date(),
  };
}

/**
 * Archive album
 */
export function archiveAlbum(album: Album): Album {
  return {
    ...album,
    isArchived: true,
    updatedAt: new Date(),
  };
}

/**
 * Unarchive album
 */
export function unarchiveAlbum(album: Album): Album {
  return {
    ...album,
    isArchived: false,
    updatedAt: new Date(),
  };
}

/**
 * Create automatic album from photos
 */
export function createAutoAlbum(
  userId: string,
  photoIds: string[],
  name: string,
  type: 'similar' | 'best' | 'review' = 'similar'
): Album {
  return {
    id: `album-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    name,
    type,
    photoIds,
    coverPhotoId: photoIds[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
  };
}
