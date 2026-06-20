/**
 * Album card component
 */

import type { Album } from '../../types';
import { FolderIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface AlbumCardProps {
  album: Album;
  photoCount: number;
  coverPhotoUrl?: string;
  onClick?: () => void;
}

export function AlbumCard({ album, photoCount, coverPhotoUrl, onClick }: AlbumCardProps) {
  const typeLabel = {
    manual: 'Album tùy chỉnh',
    auto: 'Album tự động',
    similar: 'Ảnh giống nhau',
    best: 'Ảnh đẹp nhất',
    review: 'Cần xem lại',
    trash: 'Thùng rác',
    favorite: 'Yêu thích',
  }[album.type];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
    >
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
        {coverPhotoUrl ? (
          <img src={coverPhotoUrl} alt={album.name} className="w-full h-full object-cover" />
        ) : (
          <FolderIcon className="w-16 h-16 text-slate-400" />
        )}
        {/* Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {photoCount}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white truncate">{album.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{typeLabel}</p>
        <div className="mt-2 flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
          <PhotoIcon className="w-4 h-4" />
          <span>{photoCount} ảnh</span>
        </div>
      </div>
    </div>
  );
}
