/**
 * Albums page
 */

import { usePhotos } from '../hooks';
import { MainLayout } from '../components/layout/MainLayout';
import { AlbumCard } from '../components/album';

export function AlbumsPage() {
  const { albums, photos } = usePhotos();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Album
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {albums.length} album
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album: any) => {
            const photoCount = album.photoIds.length;
            const coverPhoto = photos.find((p: any) => p.id === album.coverPhotoId);
            return (
              <AlbumCard
                key={album.id}
                album={album}
                photoCount={photoCount}
                coverPhotoUrl={coverPhoto?.thumbnailUrl}
              />
            );
          })}
        </div>

        {albums.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl text-slate-600 dark:text-slate-400">Chưa có album</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
