/**
 * Settings page
 */

import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { usePhotos } from '../hooks';
import { clearAllData } from '../services/photoStorageService';

export function SettingsPage() {
  const { currentUserId } = usePhotos();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleClearAllData = async () => {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
      try {
        await clearAllData();
        alert('Đã xóa tất cả dữ liệu');
        window.location.reload();
      } catch (error) {
        alert('Lỗi khi xóa dữ liệu');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Cài đặt
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
          {/* Account section */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Tài khoản
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  ID người dùng
                </label>
                <p className="text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded">
                  {currentUserId}
                </p>
              </div>
            </div>
          </div>

          {/* Display section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Giao diện
            </h2>
            <div className="flex items-center justify-between">
              <label className="text-slate-700 dark:text-slate-300">
                Chế độ tối
              </label>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => {
                  setIsDarkMode(e.target.checked);
                  if (e.target.checked) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }}
                className="w-5 h-5"
              />
            </div>
          </div>

          {/* Storage section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Lưu trữ
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Dữ liệu hiện được lưu cục bộ trên trình duyệt của bạn. Không gian lưu trữ có thể giới hạn.
            </p>
          </div>

          {/* Danger zone */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h2 className="text-lg font-bold text-red-600 mb-4">
              Vùng nguy hiểm
            </h2>
            <button
              onClick={handleClearAllData}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Xóa tất cả dữ liệu
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Xóa tất cả ảnh, album và cài đặt. Không thể hoàn tác.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
