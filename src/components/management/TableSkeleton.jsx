import { Skeleton } from "@/components/ui/Skeleton";

export function TableSkeleton({
  rows = 6,
  label = "Loading table data",
}) {
  return (
    <div
      className="space-y-3 p-4 sm:p-5"
      role="status"
      aria-label={label}
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-control py-1.5"
        >
          <Skeleton variant="circle" className="size-9 shrink-0" />
          <Skeleton variant="text" className="h-4 w-32" />
          <Skeleton variant="text" className="hidden h-4 flex-1 sm:block" />
          <Skeleton variant="text" className="h-4 w-16 shrink-0" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
