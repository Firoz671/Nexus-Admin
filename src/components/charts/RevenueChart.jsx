import { useId } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/utils/formatters";
import { ChartTooltip } from "./ChartTooltip";

const AXIS_TICK = {
  fill: "var(--color-base-content)",
  fillOpacity: 0.55,
  fontSize: 12,
};

export function RevenueChart({ points = [] }) {
  const rawId = useId();
  const gradientId = `revenue-fill-${rawId.replace(/:/g, "")}`;

  return (
    <div
      className="h-[280px] w-full min-w-0"
      role="img"
      aria-label="Revenue trend chart comparing the current and previous periods"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 720, height: 280 }}
      >
        <ComposedChart
          data={points}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-primary)"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-base-300)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            minTickGap={24}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            tickFormatter={formatCompactCurrency}
            width={60}
          />
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={(value) =>
                  formatCurrency(value, { precise: true })
                }
              />
            }
            cursor={{ stroke: "var(--color-base-300)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "var(--color-base-content)" }}
            iconType="circle"
          />

          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="previousRevenue"
            name="Previous period"
            stroke="var(--color-secondary)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 3.5, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
