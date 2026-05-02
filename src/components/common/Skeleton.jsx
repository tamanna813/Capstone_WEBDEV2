export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-dark-700 animate-pulse">
      <div className="w-full aspect-[2/3] shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 shimmer rounded w-3/4" />
        <div className="h-3 shimmer rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 shimmer rounded-full w-16" />
          <div className="h-5 shimmer rounded-full w-12" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-dark-700 animate-pulse">
      <div className="w-16 h-24 shimmer rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 shimmer rounded w-2/3" />
        <div className="h-3 shimmer rounded w-1/3" />
        <div className="h-3 shimmer rounded w-full" />
        <div className="h-3 shimmer rounded w-4/5" />
      </div>
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className="w-full h-[500px] shimmer rounded-3xl animate-pulse" />
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 shimmer rounded"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  )
}
