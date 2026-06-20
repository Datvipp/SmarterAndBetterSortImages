/**
 * Review page for photos needing review
 */

import { usePhotos } from '../hooks';
import { MainLayout } from '../components/layout/MainLayout';
import { PhotoGrid } from '../components/photo';

export function ReviewPage() {
  const { photos } = usePhotos();

  const reviewPhotos = photos.filter(
    (p: any) =>
      !p.isDeleted &&
      (p.qualityScore < 50 || p.qualityLabels.includes('Blurry'))
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Cần xem lại
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {reviewPhotos.length} ảnh cần xem lại
          </p>
        </div>

        {reviewPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">👁️</div>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Không có ảnh cần xem lại
            </p>
          </div>
        ) : (
          <PhotoGrid photos={reviewPhotos} />
        )}
      </div>
    </MainLayout>
  );
}
