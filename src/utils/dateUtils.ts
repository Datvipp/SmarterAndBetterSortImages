/**
 * Date utilities for organizing photos by timeline
 */

export function formatDate(date: Date | null): string {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleDateString('vi-VN');
}

export function formatDateTime(date: Date | null): string {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleString('vi-VN');
}

export function getDateGroup(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getDayGroup(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}m trước`;
  const years = Math.floor(months / 12);
  return `${years}y trước`;
}
