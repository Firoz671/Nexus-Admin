import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummary,
  getRecentActivities,
  getRecentTransactions,
  getRevenueAnalytics,
  getSalesOverview,
  getUserGrowth,
} from "@/services/api/dashboard.api";
import { queryKeys } from "@/services/api/queryKeys";

const ANALYTICS_STALE_TIME = 5 * 60 * 1000;
const ACTIVITY_STALE_TIME = 2 * 60 * 1000;

export function useDashboardSummary(range) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(range),
    queryFn: () => getDashboardSummary(range),
    staleTime: ANALYTICS_STALE_TIME,
  });
}

export function useRevenueAnalytics(range) {
  return useQuery({
    queryKey: queryKeys.dashboard.revenue(range),
    queryFn: () => getRevenueAnalytics(range),
    staleTime: ANALYTICS_STALE_TIME,
  });
}

export function useSalesOverview(range) {
  return useQuery({
    queryKey: queryKeys.dashboard.sales(range),
    queryFn: () => getSalesOverview(range),
    staleTime: ANALYTICS_STALE_TIME,
  });
}

export function useUserGrowth(range) {
  return useQuery({
    queryKey: queryKeys.dashboard.userGrowth(range),
    queryFn: () => getUserGrowth(range),
    staleTime: ANALYTICS_STALE_TIME,
  });
}

export function useRecentTransactions(range) {
  return useQuery({
    queryKey: queryKeys.dashboard.transactions(range),
    queryFn: () => getRecentTransactions(range),
    staleTime: ACTIVITY_STALE_TIME,
  });
}

export function useRecentActivities(range) {
  return useQuery({
    queryKey: queryKeys.dashboard.activities(range),
    queryFn: () => getRecentActivities(range),
    staleTime: ACTIVITY_STALE_TIME,
  });
}
