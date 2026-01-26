import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonText() {
  return (
    <div className="flex w-full px-50 flex-col gap-3 py-5">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-7 w-full" />
    </div>
  )
}
