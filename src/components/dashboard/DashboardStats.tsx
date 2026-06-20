/**
 * Dashboard statistics component
 */

import type { Photo, Album } from '../../types';
import { formatFileSize } from '../../utils';

interface DashboardStatsProps {
  photos: Photo[];
  albums: Album[];
  similarGroups: number;
}

export function DashboardStats({
  photos,
  albums,
  similarGroups,
}: DashboardStatsProps) {
  const totalSize = photos.reduce((sum, p) => sum + p.size, 0);
  const bestPhotosCount = photos.filter((p) => p.qualityScore >= 75).length;
  const blurryCount = photos.filter((p) => p.qualityLabels.includes('Blurry')).length;
  const duplicateCount = photos.filter((p) => p.qualityLabels.includes('Duplicate')).length;

  const stats = [
    { label: 'Tổng ảnh', value: photos.length, icon: '📷' },
    { label: 'Dung lượng', value: formatFileSize(totalSize), icon: '💾' },
    { label: 'Album', value: albums.length, icon: '📁' },
    { label: 'Ảnh đẹp nhất', value: bestPhotosCount, icon: '⭐' },
    { label: 'Ảnh mờ', value: blurryCount, icon: '👁️' },
    { label: 'Ảnh trùng', value: duplicateCount, icon: '🔁' },
    { label: 'Nhóm giống nhau', value: similarGroups, icon: '🎯' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
