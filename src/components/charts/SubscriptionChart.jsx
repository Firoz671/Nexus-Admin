import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/utils/formatters";
import { ChartTooltip } from "./ChartTooltip";

const AXIS_TICK = {
  fill: "var(--color-base-content)",
  fillOpacity: 0.55,
  fontSize: 12,
};

export function SubscriptionChart({ points = [] }) {
  return (
    <div
      className="h-[260px] w-full min-w-0"
      role="img"
      aria-label="Subscription performance chart showing new and churned subscriptions"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 720, height: 260 }}
      >
        <BarChart
          data={points}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barGap={2}
        >
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
            tickFormatter={(value) => formatNumber(value, { compact: true })}
            width={44}
          />
          <Tooltip
            content={<ChartTooltip valueFormatter={formatNumber} />}
            cursor={{ fill: "var(--color-base-200)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "var(--color-base-content)" }}
            iconType="circle"
          />

          <Bar
            dataKey="newSubscriptions"
            name="New subscriptions"
            fill="var(--color-success)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="churnedSubscriptions"
            name="Churned"
            fill="var(--color-error)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
