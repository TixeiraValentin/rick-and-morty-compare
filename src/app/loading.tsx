import { Skeleton } from "@/presentation/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8" aria-hidden="true">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...Array(2).keys()].map((column) => (
          <div key={column} className="flex flex-col gap-2">
            <Skeleton className="mb-2 h-6 w-40" />
            {[...Array(5).keys()].map((row) => (
              <Skeleton key={row} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
