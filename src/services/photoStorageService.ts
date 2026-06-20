/**
 * Local storage service for photos
 * Uses IndexedDB for efficient storage of photo metadata and blob URLs
 */

import type { Photo, PhotoAnalysis } from '../types';

const DB_NAME = 'DATSortImages';
const DB_VERSION = 1;
const PHOTOS_STORE = 'photos';
const ANALYSIS_STORE = 'analysis';
const THUMBNAILS_STORE = 'thumbnails';

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (e) => {
      const database = (e.target as IDBOpenDBRequest).result;

      // Create photos store
      if (!database.objectStoreNames.contains(PHOTOS_STORE)) {
        const photosStore = database.createObjectStore(PHOTOS_STORE, { keyPath: 'id' });
        photosStore.createIndex('userId', 'userId', { unique: false });
        photosStore.createIndex('createdAt', 'createdAt', { unique: false });
        photosStore.createIndex('takenAt', 'takenAt', { unique: false });
      }

      // Create analysis store
      if (!database.objectStoreNames.contains(ANALYSIS_STORE)) {
        const analysisStore = database.createObjectStore(ANALYSIS_STORE, { keyPath: 'photoId' });
        analysisStore.createIndex('overallScore', 'overallScore', { unique: false });
      }

      // Create thumbnails store
      if (!database.objectStoreNames.contains(THUMBNAILS_STORE)) {
        database.createObjectStore(THUMBNAILS_STORE, { keyPath: 'photoId' });
      }
    };
  });
}

/**
 * Save photo metadata
 */
export async function savePhoto(photo: Photo): Promise<void> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PHOTOS_STORE], 'readwrite');
    const store = transaction.objectStore(PHOTOS_STORE);
    const request = store.put(photo);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get photo by ID
 */
export async function getPhoto(photoId: string): Promise<Photo | null> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PHOTOS_STORE], 'readonly');
    const store = transaction.objectStore(PHOTOS_STORE);
    const request = store.get(photoId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

/**
 * Get all photos for user
 */
export async function getPhotosByUserId(userId: string): Promise<Photo[]> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PHOTOS_STORE], 'readonly');
    const store = transaction.objectStore(PHOTOS_STORE);
    const index = store.index('userId');
    const request = index.getAll(userId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

/**
 * Delete photo
 */
export async function deletePhoto(photoId: string): Promise<void> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PHOTOS_STORE], 'readwrite');
    const store = transaction.objectStore(PHOTOS_STORE);
    const request = store.delete(photoId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Save photo analysis
 */
export async function saveAnalysis(analysis: PhotoAnalysis): Promise<void> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([ANALYSIS_STORE], 'readwrite');
    const store = transaction.objectStore(ANALYSIS_STORE);
    const request = store.put(analysis);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get analysis for photo
 */
export async function getAnalysis(photoId: string): Promise<PhotoAnalysis | null> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([ANALYSIS_STORE], 'readonly');
    const store = transaction.objectStore(ANALYSIS_STORE);
    const request = store.get(photoId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

/**
 * Save thumbnail blob
 */
export async function saveThumbnail(photoId: string, blob: Blob): Promise<void> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([THUMBNAILS_STORE], 'readwrite');
    const store = transaction.objectStore(THUMBNAILS_STORE);
    const request = store.put({ photoId, blob });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get thumbnail blob
 */
export async function getThumbnail(photoId: string): Promise<Blob | null> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([THUMBNAILS_STORE], 'readonly');
    const store = transaction.objectStore(THUMBNAILS_STORE);
    const request = store.get(photoId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result?.blob || null);
    };
  });
}

/**
 * Clear all data (for testing/reset)
 */
export async function clearAllData(): Promise<void> {
  if (!db) await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PHOTOS_STORE, ANALYSIS_STORE, THUMBNAILS_STORE], 'readwrite');

    transaction.objectStore(PHOTOS_STORE).clear();
    transaction.objectStore(ANALYSIS_STORE).clear();
    transaction.objectStore(THUMBNAILS_STORE).clear();

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}
