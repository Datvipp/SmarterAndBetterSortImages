/**
 * Main layout component
 */

import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  onUpload?: () => void;
}

export function MainLayout({ children, onSearch, onUpload }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onSearch={onSearch} onUpload={onUpload} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
