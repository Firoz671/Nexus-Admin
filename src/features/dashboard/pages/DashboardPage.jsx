import {
  ChartNoAxesCombined,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { KpiGrid } from "@/components/analytics/KpiGrid";
import {
  ChartCard,
  RevenueChart,
  SalesChart,
  UserGrowthChart,
} from "@/components/charts";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { PageHeader } from "@/components/shared/PageHeader";
import { useDateRange } from "@/hooks/useDateRange";
import { formatPercent } from "@/utils/formatters";
import { useAuthStore } from "@/store/authStore";
import {
  useDashboardSummary,
  useRecentActivities,
  useRecentTransactions,
  useRevenueAnalytics,
  useSalesOverview,
  useUserGrowth,
} from "../hooks/useDashboardData";
import { RecentActivity } from "../components/RecentActivity";
import { RecentTransactions } from "../components/RecentTransactions";

function ComparisonBadge({ change = 0 }) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const variant = isPositive ? "success" : isNegative ? "danger" : "neutral";

  return (
    <Badge variant={variant} size="sm">
      <Icon className="size-3" aria-hidden="true" />
      {formatPercent(change, { signed: true })}
    </Badge>
  );
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const { range, setRange } = useDateRange();

  const summaryQuery = useDashboardSummary(range);
  const revenueQuery = useRevenueAnalytics(range);
  const salesQuery = useSalesOverview(range);
  const userGrowthQuery = useUserGrowth(range);
  const transactionsQuery = useRecentTransactions(range);
  const activitiesQuery = useRecentActivities(range);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace overview"
        title="Overview"
        description={`Welcome back, ${firstName}. Track revenue, orders, and customer activity across the selected period.`}
        actions={<DateRangeFilter value={range} onChange={setRange} />}
      />

      <section aria-labelledby="dashboard-kpis-heading">
        <h2 id="dashboard-kpis-heading" className="sr-only">
          Key performance indicators
        </h2>
        <KpiGrid
          kpis={summaryQuery.data?.kpis}
          isLoading={summaryQuery.isPending}
          isError={summaryQuery.isError}
          errorMessage={summaryQuery.error?.message}
          onRetry={() => summaryQuery.refetch()}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <ChartCard
          title="Revenue analytics"
          description="Revenue compared with the previous period."
          actions={
            revenueQuery.isSuccess && revenueQuery.data?.totals ? (
              <ComparisonBadge
                change={revenueQuery.data.totals.change}
              />
            ) : null
          }
          isLoading={revenueQuery.isPending}
          isError={revenueQuery.isError}
          errorMessage={revenueQuery.error?.message}
          onRetry={() => revenueQuery.refetch()}
          isEmpty={
            revenueQuery.isSuccess && !revenueQuery.data?.points?.length
          }
          emptyTitle="No revenue data for this range"
          emptyIcon={<ChartNoAxesCombined />}
        >
          <RevenueChart points={revenueQuery.data?.points} />
        </ChartCard>

        <ChartCard
          title="Sales overview"
          description="Completed, pending, and cancelled orders."
          isLoading={salesQuery.isPending}
          isError={salesQuery.isError}
          errorMessage={salesQuery.error?.message}
          onRetry={() => salesQuery.refetch()}
          isEmpty={salesQuery.isSuccess && !salesQuery.data?.statuses?.length}
          emptyTitle="No sales data for this range"
        >
          <SalesChart
            statuses={salesQuery.data?.statuses}
            total={salesQuery.data?.total}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <ChartCard
          title="User growth"
          description="New users acquired over the selected period."
          actions={
            userGrowthQuery.isSuccess ? (
              <ComparisonBadge change={userGrowthQuery.data?.change} />
            ) : null
          }
          isLoading={userGrowthQuery.isPending}
          isError={userGrowthQuery.isError}
          errorMessage={userGrowthQuery.error?.message}
          onRetry={() => userGrowthQuery.refetch()}
          isEmpty={
            userGrowthQuery.isSuccess && !userGrowthQuery.data?.points?.length
          }
          emptyTitle="No user growth data for this range"
        >
          <UserGrowthChart points={userGrowthQuery.data?.points} />
        </ChartCard>

        <RecentActivity
          items={activitiesQuery.data?.items}
          isLoading={activitiesQuery.isPending}
          isError={activitiesQuery.isError}
          errorMessage={activitiesQuery.error?.message}
          onRetry={() => activitiesQuery.refetch()}
        />
      </div>

      <RecentTransactions
        items={transactionsQuery.data?.items}
        isLoading={transactionsQuery.isPending}
        isError={transactionsQuery.isError}
        errorMessage={transactionsQuery.error?.message}
        onRetry={() => transactionsQuery.refetch()}
      />
    </div>
  );
}
