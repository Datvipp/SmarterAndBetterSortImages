/**
 * Sidebar navigation component
 */

import { Link, useLocation } from 'react-router-dom';
import {
  PhotoIcon,
  FolderIcon,
  SparklesIcon,
  StarIcon,
  ClipboardIcon,
  TrashIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Ảnh', path: '/', icon: PhotoIcon },
    { name: 'Album', path: '/albums', icon: FolderIcon },
    { name: 'Ảnh giống nhau', path: '/similar', icon: SparklesIcon },
    { name: 'Ảnh đẹp nhất', path: '/best-shots', icon: StarIcon },
    { name: 'Xem lại', path: '/review', icon: ClipboardIcon },
    { name: 'Thùng rác', path: '/trash', icon: TrashIcon },
    { name: 'Cài đặt', path: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-white h-full border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">DAT Sort Images</h1>
        <p className="text-sm text-slate-400 mt-1">Quản lý ảnh thông minh</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">© 2024 DAT Sort Images</p>
      </div>
    </aside>
  );
}
