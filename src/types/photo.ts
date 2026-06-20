/**
 * Photo type definitions for DATSORTIMAGES
 */

export interface Photo {
  id: string;
  userId: string;
  fileName: string;
  originalUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  takenAt: Date | null;
  width: number;
  height: number;
  size: number; // bytes
  mimeType: string;
  hash?: string; // perceptual hash
  tags: string[];
  albumIds: string[];
  isFavorite: boolean;
  isDeleted: boolean;
  qualityScore: number; // 0-100
  qualityLabels: string[];
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed';
  similarGroupId?: string;
}

export interface PhotoAnalysis {
  photoId: string;
  sharpnessScore: number; // 0-100
  brightnessScore: number; // 0-100
  contrastScore: number; // 0-100
  noiseScore: number; // 0-100, lower is better
  compositionScore: number; // 0-100
  overallScore: number; // 0-100
  labels: string[]; // selfie, food, landscape, etc.
  reasons: string[];
  analyzedAt: Date;
}

export interface SimilarGroup {
  id: string;
  photoIds: string[];
  representativePhotoId: string;
  bestPhotoId?: string;
  similarityScore: number; // 0-100
  reason: string; // 'duplicate', 'similar', 'burst'
}

export interface PhotoFilter {
  searchText?: string;
  albumId?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  qualityLabels?: string[];
  isFavorite?: boolean;
  isDeleted?: boolean;
  similarityGroup?: string;
}
