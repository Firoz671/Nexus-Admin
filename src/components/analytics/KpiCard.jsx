import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  Minus,
  Repeat2,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/utils/formatters";

const KPI_ICONS = Object.freeze({
  revenue: BadgeDollarSign,
  orders: ShoppingBag,
  activeUsers: Users,
  subscriptions: Repeat2,
});

function formatKpiValue(kpi) {
  return kpi.format === "currency"
    ? formatCurrency(kpi.value)
    : formatNumber(kpi.value);
}

export function KpiCard({ kpi }) {
  const Icon = KPI_ICONS[kpi.id] ?? ShoppingBag;
  const change = Number(kpi.change) || 0;
  const isPositive = change > 0;
  const isNegative = change < 0;
  const TrendIcon = isPositive
    ? ArrowUpRight
    : isNegative
      ? ArrowDownRight
      : Minus;
  const trendClassName = isPositive
    ? "text-success"
    : isNegative
      ? "text-error"
      : "text-base-content/50";
  const changeDescription = `${
    isPositive ? "Increased" : isNegative ? "Decreased" : "Unchanged"
  } by ${Math.abs(change).toFixed(1)} percent ${kpi.comparisonLabel ?? ""}`;

  return (
    <Card className="min-w-0 overflow-hidden" contentClassName="p-5 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-base-content/60">
            {kpi.label}
          </p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-base-content sm:text-[1.75rem]">
            {formatKpiValue(kpi)}
          </p>
        </div>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center gap-0.5 font-semibold tabular-nums",
            trendClassName,
          )}
        >
          <TrendIcon className="size-3.5" />
          {formatPercent(change, { signed: true })}
        </span>
        <span className="text-base-content/50" aria-hidden="true">
          {kpi.comparisonLabel}
        </span>
        <span className="sr-only">{changeDescription}</span>
      </div>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card className="min-w-0" contentClassName="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-3.5 w-24 animate-pulse rounded-control bg-base-300" />
          <div className="h-7 w-32 animate-pulse rounded-control bg-base-300" />
        </div>
        <div className="size-10 animate-pulse rounded-control bg-base-300" />
      </div>
      <div className="mt-4 h-3 w-36 animate-pulse rounded-control bg-base-300" />
    </Card>
  );
}
