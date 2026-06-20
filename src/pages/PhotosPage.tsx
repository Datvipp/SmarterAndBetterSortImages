/**
 * Photos page - main gallery view
 */

import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { PhotoGrid, PhotoDetail } from '../components/photo';
import { ImageUpload } from '../components/upload';
import { Modal } from '../components/common/Modal';
import { usePhotos } from '../hooks';
import type { Photo } from '../types';
import {
  calculateImageHash,
  createThumbnail,
  extractFileMetadata,
  extractExifDate,
} from '../utils';
import { analyzeImageQuality } from '../services/imageAnalysisService';
import { createSimilarityGroups } from '../services/similarityService';
import { v4 as uuidv4 } from 'uuid';

export function PhotosPage() {
  const { photos, addPhoto, updatePhoto, setSimilarGroups, currentUserId } = usePhotos();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredPhotos = photos.filter((p) => !p.isDeleted && 
    (searchQuery === '' || p.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true);
    try {
      const newPhotos: Photo[] = [];
      const hashes: Record<string, string> = {};

      for (const file of files) {
        const id = uuidv4();
        const metadata = await extractFileMetadata(file);
        const hash = await calculateImageHash(file);
        const thumbnail = await createThumbnail(file);
        const takenAt = await extractExifDate(file);

        // Create blob URLs
        const originalUrl = URL.createObjectURL(file);
        const thumbnailUrl = URL.createObjectURL(thumbnail);

        const photo: Photo = {
          id,
          userId: currentUserId,
          fileName: metadata.name,
          originalUrl,
          thumbnailUrl,
          createdAt: new Date(),
          takenAt,
          width: metadata.width || 0,
          height: metadata.height || 0,
          size: metadata.size,
          mimeType: metadata.type,
          hash,
          tags: [],
          albumIds: [],
          isFavorite: false,
          isDeleted: false,
          qualityScore: 0,
          qualityLabels: [],
          analysisStatus: 'pending',
        };

        newPhotos.push(photo);
        hashes[id] = hash;
        addPhoto(photo);
      }

      // Analyze quality and create similarity groups
      for (const photo of newPhotos) {
        try {
          const analysis = await analyzeImageQuality(photo.originalUrl);
          const updatedPhoto = {
            ...photo,
            qualityScore: Math.round(analysis.overallScore),
            qualityLabels: analysis.labels,
            analysisStatus: 'completed' as const,
          };
          updatePhoto(updatedPhoto);
        } catch (error) {
          console.error('Failed to analyze photo:', error);
        }
      }

      // Create similarity groups
      const allPhotos = [...photos, ...newPhotos];
      const similarityGroups = createSimilarityGroups(
        allPhotos.map((p) => ({
          id: p.id,
          hash: p.hash || '',
          qualityScore: p.qualityScore,
        })),
        5
      );
      setSimilarGroups(similarityGroups);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (photo) {
      updatePhoto({ ...photo, isDeleted: true });
    }
    setShowDeleteModal(null);
    setSelectedPhoto(null);
  };

  const handleFavorite = (photoId: string, isFavorite: boolean) => {
    const photo = photos.find((p) => p.id === photoId);
    if (photo) {
      updatePhoto({ ...photo, isFavorite });
    }
  };

  const handleDownload = (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (photo) {
      const a = document.createElement('a');
      a.href = photo.originalUrl;
      a.download = photo.fileName;
      a.click();
    }
  };

  return (
    <MainLayout
      onSearch={setSearchQuery}
      onUpload={() => document.getElementById('upload-input')?.click()}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Thư viện ảnh
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {filteredPhotos.length} ảnh
          </p>
        </div>

        <ImageUpload onFilesSelected={handleFilesSelected} isLoading={isUploading} />

        <PhotoGrid
          photos={filteredPhotos}
          onPhotoClick={setSelectedPhoto}
        />

        {selectedPhoto && (
          <PhotoDetail
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onFavorite={handleFavorite}
            onDelete={(id) => setShowDeleteModal(id)}
            onDownload={handleDownload}
          />
        )}

        <Modal
          isOpen={!!showDeleteModal}
          title="Xóa ảnh"
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => showDeleteModal && handleDeletePhoto(showDeleteModal)}
          confirmText="Xóa"
          isDangerous
        >
          <p>Bạn có chắc muốn xóa ảnh này? Hành động này không thể hoàn tác.</p>
        </Modal>
      </div>
    </MainLayout>
  );
}
