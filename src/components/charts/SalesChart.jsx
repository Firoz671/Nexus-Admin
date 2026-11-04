import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatNumber } from "@/utils/formatters";
import { ChartTooltip } from "./ChartTooltip";

const SALES_STATUS_COLORS = Object.freeze({
  completed: "var(--color-success)",
  pending: "var(--color-warning)",
  cancelled: "var(--color-error)",
});

export function SalesChart({ statuses = [], total = 0 }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center">
      <div
        className="relative mx-auto h-[200px] w-full max-w-[220px]"
        role="img"
        aria-label="Sales status distribution chart"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 220, height: 200 }}
        >
          <PieChart>
            <Pie
              data={statuses}
              dataKey="value"
              nameKey="label"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
              stroke="var(--color-base-100)"
              strokeWidth={2}
              isAnimationActive={!prefersReducedMotion}
            >
              {statuses.map((status) => (
                <Cell
                  key={status.status}
                  fill={SALES_STATUS_COLORS[status.status]}
                />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(value, entry) =>
                    `${formatNumber(value)} (${entry?.payload?.percentage ?? 0}%)`
                  }
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-base-content">
            {formatNumber(total, { compact: total >= 10000 })}
          </span>
          <span className="text-xs text-base-content/60">Total orders</span>
        </div>
      </div>

      <ul className="space-y-3">
        {statuses.map((status) => (
          <li
            key={status.status}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-base-content/70">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: SALES_STATUS_COLORS[status.status],
                }}
                aria-hidden="true"
              />
              <span className="truncate">{status.label}</span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className="text-sm font-semibold tabular-nums text-base-content">
                {formatNumber(status.value)}
              </span>
              <span className="w-10 text-right text-xs tabular-nums text-base-content/60">
                {status.percentage}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
