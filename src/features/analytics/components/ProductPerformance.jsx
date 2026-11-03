import { Package, Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatNumber } from "@/utils/formatters";

function ProductPerformanceSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading product performance"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton variant="circle" className="size-9 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-40" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      ))}
      <span className="sr-only">Loading product performance</span>
    </div>
  );
}

export function ProductPerformance({
  data,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) {
  const items = data?.items ?? [];

  return (
    <Card
      header={
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-heading-3 font-semibold text-base-content">
              Product performance
            </h3>
            <p className="mt-1 text-sm text-base-content/60">
              Top products by revenue for the selected range.
            </p>
          </div>
          {data?.totalRevenue ? (
            <span className="rounded-full bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/65">
              {formatCurrency(data.totalRevenue, { compact: true })} total
            </span>
          ) : null}
        </div>
      }
    >
      {isLoading ? (
        <ProductPerformanceSkeleton />
      ) : isError ? (
        <ErrorState
          title="Unable to load product performance"
          description={errorMessage}
          onRetry={onRetry}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Package />}
          title="No product data for this range"
          description="Product performance will appear once sales are recorded."
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        <ul className="divide-y divide-base-300/70">
          {items.map((product, index) => (
            <li
              key={product.id}
              className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))_minmax(0,1.1fr)] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3 sm:col-span-2 lg:col-span-1">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                  {index === 0 ? (
                    <Trophy className="size-4" aria-hidden="true" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-base-content">
                    {product.name}
                  </p>
                  <p className="text-xs text-base-content/55">
                    {product.category}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-base-content/40">
                  Units
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-base-content">
                  {formatNumber(product.unitsSold)}
                </p>
              </div>

              <div>
                <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-base-content/40">
                  Revenue
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-base-content">
                  {formatCurrency(product.revenue)}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-base-content/40">
                    Share
                  </p>
                  <p className="text-xs font-semibold tabular-nums text-base-content/65">
                    {product.share}%
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${product.name} revenue share`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={product.share}
                  className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-base-200"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, Math.max(0, product.share))}%`,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
