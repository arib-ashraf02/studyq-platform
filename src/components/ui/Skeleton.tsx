"use client";

export function SkeletonCard() {
  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-card overflow-hidden">
      <div className="flex gap-4 sm:gap-5">
        {/* Vote skeleton */}
        <div className="flex flex-col items-center gap-1.5 pt-1 shrink-0">
          <div className="skeleton w-7 h-7 rounded-lg" />
          <div className="skeleton w-5 h-4 rounded-md" />
          <div className="skeleton w-7 h-7 rounded-lg" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          {/* Status badges */}
          <div className="flex gap-2 mb-3">
            <div className="skeleton w-20 h-5 rounded-full" />
            <div className="skeleton w-14 h-5 rounded-full" />
          </div>

          {/* Title */}
          <div className="skeleton w-[85%] h-6 rounded-lg mb-2" />

          {/* Description lines */}
          <div className="skeleton w-full h-3.5 rounded mb-1.5" />
          <div className="skeleton w-[70%] h-3.5 rounded mb-4" />

          {/* Tags + meta */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="skeleton w-16 h-5 rounded-md" />
              <div className="skeleton w-14 h-5 rounded-md" />
            </div>
            <div className="flex gap-3">
              <div className="skeleton w-10 h-3.5 rounded" />
              <div className="skeleton w-10 h-3.5 rounded" />
              <div className="skeleton w-12 h-3.5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}
