import { Gauge } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { KpiCard, KpiCardSkeleton } from "./KpiCard";

export function KpiGrid({
  kpis = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        role="status"
        aria-label="Loading key metrics"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
        <span className="sr-only">Loading key metrics</span>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load key metrics"
        description={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (!kpis.length) {
    return (
      <EmptyState
        icon={<Gauge />}
        title="No metrics available"
        description="There is no metric data for the selected date range."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
