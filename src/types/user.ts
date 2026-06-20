/**
 * User type definitions
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  storageQuota: number; // bytes
  storageUsed: number; // bytes
}

export interface LocalUser {
  id: string;
  displayName: string;
  createdAt: Date;
}
