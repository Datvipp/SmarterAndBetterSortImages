/**
 * Best shots page
 */

import { usePhotos } from '../hooks';
import { MainLayout } from '../components/layout/MainLayout';
import { PhotoGrid } from '../components/photo';

export function BestShotsPage() {
  const { photos } = usePhotos();

  const bestPhotos = photos.filter(
    (p: any) => !p.isDeleted && p.qualityScore >= 75
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Ảnh đẹp nhất
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {bestPhotos.length} ảnh
          </p>
        </div>

        {bestPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Chưa có ảnh đẹp nhất
            </p>
          </div>
        ) : (
          <PhotoGrid photos={bestPhotos} />
        )}
      </div>
    </MainLayout>
  );
}
