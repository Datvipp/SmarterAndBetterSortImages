/**
 * Header component with search bar
 */

import { useState } from 'react';
import { MagnifyingGlassIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onUpload?: () => void;
}

export function Header({ onSearch, onUpload }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow border-b border-slate-200 dark:border-slate-700">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={onUpload}
          className="ml-4 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
          <span>Tải lên</span>
        </button>
      </div>
    </header>
  );
}
