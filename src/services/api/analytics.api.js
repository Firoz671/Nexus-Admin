import { ENDPOINTS } from "./endpoints";
import { getDateRangeResource } from "./resource";

export function getAnalyticsOverview(range) {
  return getDateRangeResource(
    ENDPOINTS.analytics.overview,
    range,
    "Unable to load analytics.",
  );
}
