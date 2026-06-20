/**
 * Photo grid component - displays photos in a masonry-like layout
 */

import { useState } from 'react';
import type { Photo } from '../../types';
import { formatFileSize } from '../../utils';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  isSelectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function PhotoGrid({
  photos,
  onPhotoClick,
  isSelectable = false,
  onSelectionChange,
}: PhotoGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectPhoto = (photoId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-xl text-slate-600 dark:text-slate-400">Chưa có ảnh</p>
        <p className="text-slate-500 dark:text-slate-500">Tải lên ảnh đầu tiên để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`relative group cursor-pointer rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 aspect-square hover:shadow-lg transition ${
            selectedIds.has(photo.id) ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onPhotoClick?.(photo)}
        >
          {/* Photo */}
          <img
            src={photo.thumbnailUrl}
            alt={photo.fileName}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-end justify-between p-2">
            <div className="opacity-0 group-hover:opacity-100 transition">
              <p className="text-white text-xs truncate">{photo.fileName}</p>
              <p className="text-slate-300 text-xs">{formatFileSize(photo.size)}</p>
            </div>

            {/* Quality score badge */}
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
              {photo.qualityScore}
            </div>
          </div>

          {/* Selection checkbox */}
          {isSelectable && (
            <div
              className="absolute top-2 left-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPhoto(photo.id);
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(photo.id)}
                readOnly
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          )}

          {/* Favorite indicator */}
          {photo.isFavorite && (
            <div className="absolute top-2 right-2 text-yellow-400">⭐</div>
          )}
        </div>
      ))}
    </div>
  );
}
