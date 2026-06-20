/**
 * Similar photos page
 */

import { usePhotos } from '../hooks';
import { MainLayout } from '../components/layout/MainLayout';
import { PhotoGrid } from '../components/photo';

export function SimilarPhotosPage() {
  const { photos, similarGroups } = usePhotos();

  if (similarGroups.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Ảnh giống nhau
          </h1>
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Không tìm thấy ảnh giống nhau
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Ảnh giống nhau
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {similarGroups.length} nhóm ảnh giống nhau
          </p>
        </div>

        {similarGroups.map((group: any, index: number) => {
          const groupPhotos = photos.filter((p: any) => group.photoIds.includes(p.id));
          return (
            <div key={group.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Nhóm {index + 1}: {group.reason === 'duplicate' ? 'Trùng lặp' : 'Giống nhau'}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {groupPhotos.length} ảnh - Độ tương tự: {group.similarityScore}%
                  </p>
                </div>
                {group.bestPhotoId && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded text-sm">
                    ⭐ Ảnh đẹp nhất được đề xuất
                  </span>
                )}
              </div>
              <PhotoGrid photos={groupPhotos} />
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}
