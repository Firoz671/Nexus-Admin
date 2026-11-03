import { ChartNoAxesCombined } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

export function ChartCard({
  title,
  description,
  actions,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  isEmpty = false,
  emptyTitle = "No data for this range",
  emptyDescription = "Try selecting a different date range.",
  emptyIcon,
  skeletonHeight = "h-[280px]",
  className,
  contentClassName,
  children,
}) {
  return (
    <Card
      className={cn("min-w-0", className)}
      contentClassName={cn("min-w-0", contentClassName)}
      header={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-heading-3 font-semibold text-base-content">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-sm text-base-content/60">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      }
    >
      {isLoading ? (
        <div
          className="space-y-3"
          role="status"
          aria-label={`Loading ${title}`}
        >
          <Skeleton className={cn("w-full", skeletonHeight)} />
          <div className="flex flex-wrap gap-2">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-3 w-16" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
          <span className="sr-only">Loading {title}</span>
        </div>
      ) : isError ? (
        <ErrorState
          title={`Unable to load ${title.toLowerCase()}`}
          description={errorMessage}
          onRetry={onRetry}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : isEmpty ? (
        <EmptyState
          icon={emptyIcon ?? <ChartNoAxesCombined />}
          title={emptyTitle}
          description={emptyDescription}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        children
      )}
    </Card>
  );
}
