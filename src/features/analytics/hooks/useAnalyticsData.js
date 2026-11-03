import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview } from "@/services/api/analytics.api";
import { queryKeys } from "@/services/api/queryKeys";

const ANALYTICS_STALE_TIME = 5 * 60 * 1000;

export function useAnalyticsOverview(range) {
  return useQuery({
    queryKey: queryKeys.analytics.overview(range),
    queryFn: () => getAnalyticsOverview(range),
    staleTime: ANALYTICS_STALE_TIME,
  });
}
