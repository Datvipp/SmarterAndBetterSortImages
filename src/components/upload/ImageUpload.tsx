/**
 * Image upload component with drag and drop support
 */

import { useState, useRef } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { isValidImageFile } from '../../utils';

interface UploadProps {
  onFilesSelected?: (files: File[]) => void;
  isLoading?: boolean;
}

export function ImageUpload({ onFilesSelected, isLoading = false }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(isValidImageFile);
    onFilesSelected?.(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(isValidImageFile);
    onFilesSelected?.(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-slate-800'
          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={isLoading}
      />

      <ArrowUpTrayIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
      <p className="text-xl font-bold text-slate-900 dark:text-white">
        {isDragging ? 'Thả ảnh ở đây' : 'Kéo thả ảnh hoặc bấm để chọn'}
      </p>
      <p className="text-slate-500 dark:text-slate-400 mt-2">
        Hỗ trợ: JPG, PNG, WEBP
      </p>

      {isLoading && (
        <div className="mt-4">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Đang xử lý ảnh...
          </p>
        </div>
      )}
    </div>
  );
}
