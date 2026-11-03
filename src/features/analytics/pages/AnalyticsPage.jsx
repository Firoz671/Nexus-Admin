import {
  ChartNoAxesCombined,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { KpiGrid } from "@/components/analytics/KpiGrid";
import {
  ChartCard,
  RevenueChart,
  SalesChart,
  SubscriptionChart,
  UserGrowthChart,
} from "@/components/charts";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { PageHeader } from "@/components/shared/PageHeader";
import { useDateRange } from "@/hooks/useDateRange";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { ProductPerformance } from "../components/ProductPerformance";
import { useAnalyticsOverview } from "../hooks/useAnalyticsData";

function SubscriptionMetric({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-control border border-base-300 bg-base-200/60 p-3">
      <div className="flex items-center gap-2 text-base-content/55">
        <Icon
          className={`size-3.5 ${accent ?? ""}`}
          aria-hidden="true"
        />
        <p className="text-[0.6875rem] font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-lg font-semibold tabular-nums text-base-content">
        {value}
      </p>
    </div>
  );
}

export function AnalyticsPage() {
  const { range, setRange } = useDateRange();
  const overviewQuery = useAnalyticsOverview(range);
  const data = overviewQuery.data;
  const isLoading = overviewQuery.isPending;
  const isError = overviewQuery.isError;
  const errorMessage = overviewQuery.error?.message;
  const retry = () => overviewQuery.refetch();
  const subscription = data?.subscriptionPerformance;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Performance analytics"
        title="Analytics"
        description="Revenue, sales, acquisition, and subscription performance for the selected period."
        actions={<DateRangeFilter value={range} onChange={setRange} />}
      />

      <section aria-labelledby="analytics-summary-heading">
        <h2 id="analytics-summary-heading" className="sr-only">
          Summary metrics
        </h2>
        <KpiGrid
          kpis={data?.summary?.kpis}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={retry}
        />
      </section>

      <ChartCard
        title="Revenue trend"
        description="Revenue compared with the previous period."
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={retry}
        isEmpty={overviewQuery.isSuccess && !data?.revenueTrend?.points?.length}
        emptyTitle="No revenue data for this range"
        emptyIcon={<ChartNoAxesCombined />}
      >
        <RevenueChart points={data?.revenueTrend?.points} />
      </ChartCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Sales performance"
          description="Order status distribution for the selected period."
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={retry}
          isEmpty={
            overviewQuery.isSuccess &&
            !data?.salesPerformance?.statuses?.length
          }
          emptyTitle="No sales data for this range"
        >
          <SalesChart
            statuses={data?.salesPerformance?.statuses}
            total={data?.salesPerformance?.total}
          />
        </ChartCard>

        <ChartCard
          title="User acquisition"
          description="New users acquired over the selected period."
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={retry}
          isEmpty={
            overviewQuery.isSuccess &&
            !data?.userAcquisition?.points?.length
          }
          emptyTitle="No acquisition data for this range"
        >
          <UserGrowthChart points={data?.userAcquisition?.points} />
        </ChartCard>
      </div>

      <ChartCard
        title="Subscription performance"
        description="New and churned subscriptions for the selected period."
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={retry}
        isEmpty={
          overviewQuery.isSuccess && !subscription?.points?.length
        }
        emptyTitle="No subscription data for this range"
      >
        <div className="mb-5 grid gap-2 sm:grid-cols-3">
          <SubscriptionMetric
            icon={Users}
            label="Active subscriptions"
            value={formatNumber(subscription?.activeSubscriptions)}
            accent="text-primary"
          />
          <SubscriptionMetric
            icon={UserPlus}
            label="New"
            value={formatNumber(subscription?.newSubscriptions)}
            accent="text-success"
          />
          <SubscriptionMetric
            icon={UserMinus}
            label="Churn rate"
            value={formatPercent(subscription?.churnRate)}
            accent="text-error"
          />
        </div>
        <SubscriptionChart points={subscription?.points} />
      </ChartCard>

      <ProductPerformance
        data={data?.productPerformance}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={retry}
      />
    </div>
  );
}
