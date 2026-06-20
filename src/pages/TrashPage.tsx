/**
 * Trash page
 */

import { usePhotos } from '../hooks';
import { MainLayout } from '../components/layout/MainLayout';
import { PhotoGrid } from '../components/photo';

export function TrashPage() {
  const { photos } = usePhotos();

  const trashedPhotos = photos.filter((p: any) => p.isDeleted);
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Thùng rác
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {trashedPhotos.length} ảnh
          </p>
        </div>

        {trashedPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">🗑️</div>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Thùng rác trống
            </p>
          </div>
        ) : (
          <PhotoGrid photos={trashedPhotos} />
        )}
      </div>
    </MainLayout>
  );
}
