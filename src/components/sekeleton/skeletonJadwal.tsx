import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function SkeletonJadwal() {
  return (
    <div className="flex w-full p-5 flex-col justify-center items-center gap-7">
      <div className="flex gap-3">
        <Skeleton className="h-100 w-100 flex flex-col text-center justify-center items-center rounded-2xl bg-white/0">
          <p className="text-3xl font-bold">Loading</p>
          <Loader2 className="animate-spin" size={50} />
        </Skeleton>
      </div>
    </div>
  )
} 