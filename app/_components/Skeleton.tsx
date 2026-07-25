export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}

export function SkeletonVenueCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonBookingCard() {
  return (
    <div className="flex animate-pulse items-center rounded-2xl border border-gray-200 bg-white p-5">
      <Skeleton className="h-14 w-14 rounded-xl" />
      <div className="ml-4 flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}
