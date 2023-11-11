import { Skeleton } from '../ui/skeleton'

export function SkeletonField() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-9 w-full" />
    </div>
  )
}
