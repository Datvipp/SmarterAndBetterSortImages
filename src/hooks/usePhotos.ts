import { useContext } from 'react';
import { PhotoContext, type PhotoContextType } from '../context/PhotoContext';

export function usePhotos(): PhotoContextType {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within PhotoProvider');
  }
  return context;
}
