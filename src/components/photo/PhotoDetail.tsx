/**
 * Photo detail modal/view component
 */

import type { Photo, PhotoAnalysis } from '../../types';
import { formatFileSize, formatImageDimensions, formatDateTime } from '../../utils';
import { XMarkIcon, StarIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface PhotoDetailProps {
  photo: Photo;
  analysis?: PhotoAnalysis;
  onClose?: () => void;
  onFavorite?: (photoId: string, isFavorite: boolean) => void;
  onDelete?: (photoId: string) => void;
  onDownload?: (photoId: string) => void;
}

export function PhotoDetail({
  photo,
  analysis,
  onClose,
  onFavorite,
  onDelete,
  onDownload,
}: PhotoDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-lg font-bold truncate">{photo.fileName}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Image */}
        <div className="flex justify-center bg-slate-100 dark:bg-slate-900 p-4">
          <img
            src={photo.originalUrl}
            alt={photo.fileName}
            className="max-w-full max-h-96 object-contain rounded"
          />
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          {/* Basic info */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Thông tin cơ bản</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600 dark:text-slate-400">Tên file:</dt>
                <dd className="font-medium">{photo.fileName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 dark:text-slate-400">Dung lượng:</dt>
                <dd className="font-medium">{formatFileSize(photo.size)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 dark:text-slate-400">Kích thước:</dt>
                <dd className="font-medium">{formatImageDimensions(photo.width, photo.height)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 dark:text-slate-400">Tải lên:</dt>
                <dd className="font-medium">{formatDateTime(photo.createdAt)}</dd>
              </div>
              {photo.takenAt && (
                <div className="flex justify-between">
                  <dt className="text-slate-600 dark:text-slate-400">Chụp:</dt>
                  <dd className="font-medium">{formatDateTime(photo.takenAt)}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quality analysis */}
          {analysis && (
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Phân tích chất lượng</h3>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Điểm chất lượng:</span>
                  <span className="font-bold text-lg text-blue-600">{analysis.overallScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Độ sắc nét:</span>
                  <span>{analysis.sharpnessScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Độ sáng:</span>
                  <span>{analysis.brightnessScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Độ tương phản:</span>
                  <span>{analysis.contrastScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Nhiễu:</span>
                  <span>{analysis.noiseScore}/100</span>
                </div>

                {/* Labels */}
                {analysis.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.labels.map((label) => (
                      <span
                        key={label}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reasons */}
                {analysis.reasons.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Lý do:</p>
                    <ul className="text-xs space-y-1">
                      {analysis.reasons.map((reason, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300 flex items-center">
                          <span className="mr-2">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {photo.tags.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Nhãn</h3>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex space-x-2">
          <button
            onClick={() => onFavorite?.(photo.id, !photo.isFavorite)}
            className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
          >
            <StarIcon className={`w-5 h-5 ${photo.isFavorite ? 'fill-current' : ''}`} />
            <span>{photo.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}</span>
          </button>
          <button
            onClick={() => onDownload?.(photo.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Tải xuống</span>
          </button>
          <button
            onClick={() => onDelete?.(photo.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
