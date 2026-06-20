/**
 * Album type definitions
 */

export interface Album {
  id: string;
  userId: string;
  name: string;
  type: 'manual' | 'auto' | 'similar' | 'best' | 'review' | 'trash' | 'favorite';
  description?: string;
  photoIds: string[];
  coverPhotoId?: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface AlbumStats {
  totalPhotos: number;
  totalSize: number;
  averageQualityScore: number;
  duplicateCount: number;
  similarCount: number;
}
