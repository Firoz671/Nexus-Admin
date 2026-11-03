import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/formatters";

const toneClasses = Object.freeze({
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-error/10 text-error",
  neutral: "bg-base-200 text-base-content/60",
});

function formatValue(value) {
  return typeof value === "number" ? formatNumber(value) : value;
}

function SummaryCard({ item }) {
  const Icon = item.icon;
  const tone = toneClasses[item.tone] ?? toneClasses.primary;

  return (
    <Card className="min-w-0" contentClassName="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-base-content/60">
            {item.label}
          </p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-base-content">
            {formatValue(item.value)}
          </p>
          {item.hint ? (
            <p className="mt-1.5 text-xs text-base-content/45">{item.hint}</p>
          ) : null}
        </div>

        {Icon ? (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-control",
              tone,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </Card>
  );
}

function SummarySkeleton({ itemCount, gridClassName }) {
  return (
    <div
      className={cn("grid gap-4", gridClassName)}
      role="status"
      aria-label="Loading summary metrics"
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <Card key={index} className="min-w-0" contentClassName="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-3.5 w-24 animate-pulse rounded-control bg-base-300" />
              <div className="h-7 w-16 animate-pulse rounded-control bg-base-300" />
            </div>
            <div className="size-10 animate-pulse rounded-control bg-base-300" />
          </div>
        </Card>
      ))}
      <span className="sr-only">Loading summary metrics</span>
    </div>
  );
}

export function ManagementSummary({
  items = [],
  isLoading = false,
  itemCount = 4,
  gridClassName = "sm:grid-cols-2 xl:grid-cols-4",
}) {
  if (isLoading) {
    return (
      <SummarySkeleton
        itemCount={itemCount}
        gridClassName={gridClassName}
      />
    );
  }

  return (
    <div className={cn("grid gap-4", gridClassName)}>
      {items.map((item) => (
        <SummaryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
