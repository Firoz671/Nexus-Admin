import { ENDPOINTS } from "./endpoints";
import { getDateRangeResource } from "./resource";

export function getDashboardSummary(range) {
  return getDateRangeResource(
    ENDPOINTS.dashboard.summary,
    range,
    "Unable to load the dashboard summary.",
  );
}

export function getRevenueAnalytics(range) {
  return getDateRangeResource(
    ENDPOINTS.dashboard.revenue,
    range,
    "Unable to load revenue analytics.",
  );
}

export function getSalesOverview(range) {
  return getDateRangeResource(
    ENDPOINTS.dashboard.sales,
    range,
    "Unable to load the sales overview.",
  );
}

export function getUserGrowth(range) {
  return getDateRangeResource(
    ENDPOINTS.dashboard.userGrowth,
    range,
    "Unable to load user growth.",
  );
}

export function getRecentTransactions(range) {
  return getDateRangeResource(
    ENDPOINTS.dashboard.transactions,
    range,
    "Unable to load recent transactions.",
  );
}

export function getRecentActivities(range) {
  return getDateRangeResource(
    ENDPOINTS.dashboard.activities,
    range,
    "Unable to load recent activity.",
  );
}
