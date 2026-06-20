/**
 * Loading skeleton component
 */

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="aspect-square bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export function SkeletonText() {
  return <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-3">
      <div className="h-48 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded animate-pulse w-1/2" />
    </div>
  );
}
