/**
 * Context for managing photos and app state
 */

import React, { createContext, useCallback, useReducer } from 'react';
import type { Photo, Album, SimilarGroup } from '../types';

export interface PhotoContextType {
  photos: Photo[];
  albums: Album[];
  similarGroups: SimilarGroup[];
  currentUserId: string;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (photo: Photo) => void;
  deletePhoto: (photoId: string) => void;
  addAlbum: (album: Album) => void;
  updateAlbum: (album: Album) => void;
  deleteAlbum: (albumId: string) => void;
  setSimilarGroups: (groups: SimilarGroup[]) => void;
  setPhotos: (photos: Photo[]) => void;
  setAlbums: (albums: Album[]) => void;
}

interface PhotoState {
  photos: Photo[];
  albums: Album[];
  similarGroups: SimilarGroup[];
  currentUserId: string;
}

type PhotoAction =
  | { type: 'ADD_PHOTO'; photo: Photo }
  | { type: 'UPDATE_PHOTO'; photo: Photo }
  | { type: 'DELETE_PHOTO'; photoId: string }
  | { type: 'SET_PHOTOS'; photos: Photo[] }
  | { type: 'ADD_ALBUM'; album: Album }
  | { type: 'UPDATE_ALBUM'; album: Album }
  | { type: 'DELETE_ALBUM'; albumId: string }
  | { type: 'SET_ALBUMS'; albums: Album[] }
  | { type: 'SET_SIMILAR_GROUPS'; groups: SimilarGroup[] }
  | { type: 'SET_USER_ID'; userId: string };

const photoReducer = (state: PhotoState, action: PhotoAction): PhotoState => {
  switch (action.type) {
    case 'ADD_PHOTO':
      return {
        ...state,
        photos: [...state.photos, action.photo],
      };
    case 'UPDATE_PHOTO':
      return {
        ...state,
        photos: state.photos.map((p) => (p.id === action.photo.id ? action.photo : p)),
      };
    case 'DELETE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter((p) => p.id !== action.photoId),
      };
    case 'SET_PHOTOS':
      return {
        ...state,
        photos: action.photos,
      };
    case 'ADD_ALBUM':
      return {
        ...state,
        albums: [...state.albums, action.album],
      };
    case 'UPDATE_ALBUM':
      return {
        ...state,
        albums: state.albums.map((a) => (a.id === action.album.id ? action.album : a)),
      };
    case 'DELETE_ALBUM':
      return {
        ...state,
        albums: state.albums.filter((a) => a.id !== action.albumId),
      };
    case 'SET_ALBUMS':
      return {
        ...state,
        albums: action.albums,
      };
    case 'SET_SIMILAR_GROUPS':
      return {
        ...state,
        similarGroups: action.groups,
      };
    case 'SET_USER_ID':
      return {
        ...state,
        currentUserId: action.userId,
      };
    default:
      return state;
  }
};

export const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export interface PhotoProviderProps {
  children: React.ReactNode;
}

export function PhotoProvider({ children }: PhotoProviderProps) {
  const [state, dispatch] = useReducer(photoReducer, {
    photos: [],
    albums: [],
    similarGroups: [],
    currentUserId: localStorage.getItem('userId') || `user-${Date.now()}`,
  });

  // Persist user ID
  React.useEffect(() => {
    localStorage.setItem('userId', state.currentUserId);
  }, [state.currentUserId]);

  const addPhoto = useCallback((photo: Photo) => {
    dispatch({ type: 'ADD_PHOTO', photo });
  }, []);

  const updatePhoto = useCallback((photo: Photo) => {
    dispatch({ type: 'UPDATE_PHOTO', photo });
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    dispatch({ type: 'DELETE_PHOTO', photoId });
  }, []);

  const setPhotos = useCallback((photos: Photo[]) => {
    dispatch({ type: 'SET_PHOTOS', photos });
  }, []);

  const addAlbum = useCallback((album: Album) => {
    dispatch({ type: 'ADD_ALBUM', album });
  }, []);

  const updateAlbum = useCallback((album: Album) => {
    dispatch({ type: 'UPDATE_ALBUM', album });
  }, []);

  const deleteAlbum = useCallback((albumId: string) => {
    dispatch({ type: 'DELETE_ALBUM', albumId });
  }, []);

  const setAlbums = useCallback((albums: Album[]) => {
    dispatch({ type: 'SET_ALBUMS', albums });
  }, []);

  const setSimilarGroups = useCallback((groups: SimilarGroup[]) => {
    dispatch({ type: 'SET_SIMILAR_GROUPS', groups });
  }, []);

  const value: PhotoContextType = {
    photos: state.photos,
    albums: state.albums,
    similarGroups: state.similarGroups,
    currentUserId: state.currentUserId,
    addPhoto,
    updatePhoto,
    deletePhoto,
    setPhotos,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    setAlbums,
    setSimilarGroups,
  };

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
}
