import {
  Activity,
  CreditCard,
  Package,
  Repeat2,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/utils/cn";
import { formatDateTime, formatRelativeDate } from "@/utils/formatters";

const ACTIVITY_CONFIG = Object.freeze({
  user_registered: {
    icon: UserPlus,
    className: "border-primary/15 bg-primary/10 text-primary",
  },
  order_completed: {
    icon: ShoppingBag,
    className: "border-success/15 bg-success/10 text-success",
  },
  payment_received: {
    icon: CreditCard,
    className: "border-success/15 bg-success/10 text-success",
  },
  subscription_created: {
    icon: Repeat2,
    className: "border-info/15 bg-info/10 text-info",
  },
  product_updated: {
    icon: Package,
    className: "border-warning/15 bg-warning/10 text-warning",
  },
});

function ActivitySkeleton() {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-label="Loading recent activity"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton variant="circle" className="size-9 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-3 w-full" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading recent activity</span>
    </div>
  );
}

export function RecentActivity({
  items = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) {
  const hasItems = items.length > 0;

  return (
    <Card
      title="Recent activity"
      description="Workspace events from the selected period."
    >
      {isLoading ? (
        <ActivitySkeleton />
      ) : isError ? (
        <ErrorState
          title="Unable to load recent activity"
          description={errorMessage}
          onRetry={onRetry}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : !hasItems ? (
        <EmptyState
          icon={<Activity />}
          title="No activity in this range"
          description="Workspace events will appear here when they occur."
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        <ol className="space-y-5">
          {items.map((item, index) => {
            const config = ACTIVITY_CONFIG[item.type] ?? {
              icon: Activity,
              className: "border-base-300 bg-base-200 text-base-content/60",
            };
            const Icon = config.icon;

            return (
              <li key={item.id} className="relative flex gap-3">
                {index < items.length - 1 ? (
                  <span
                    className="absolute left-[1.0625rem] top-10 h-[calc(100%+0.25rem)] w-px bg-base-300"
                    aria-hidden="true"
                  />
                ) : null}

                <span
                  className={cn(
                    "z-10 flex size-9 shrink-0 items-center justify-center rounded-full border",
                    config.className,
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>

                <div className="min-w-0 pb-1">
                  <p className="text-sm font-medium text-base-content">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-base-content/60">
                    {item.description}
                  </p>
                  <p
                    className="mt-1 text-[0.6875rem] font-medium uppercase tracking-wide text-base-content/60"
                    title={formatDateTime(item.timestamp)}
                  >
                    {formatRelativeDate(item.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
