import { DEFAULT_DATE_RANGE_PRESET } from "@/utils/dateRange";

function dateRangeKey(range) {
  return [
    range?.preset ?? DEFAULT_DATE_RANGE_PRESET,
    range?.start ?? "",
    range?.end ?? "",
  ];
}

export const queryKeys = Object.freeze({
  auth: Object.freeze({
    all: Object.freeze(["auth"]),
    me: Object.freeze(["auth", "me"]),
  }),
  dashboard: Object.freeze({
    all: Object.freeze(["dashboard"]),
    summary: (range) => ["dashboard", "summary", ...dateRangeKey(range)],
    revenue: (range) => ["dashboard", "revenue", ...dateRangeKey(range)],
    sales: (range) => ["dashboard", "sales", ...dateRangeKey(range)],
    userGrowth: (range) => ["dashboard", "user-growth", ...dateRangeKey(range)],
    transactions: (range) => [
      "dashboard",
      "transactions",
      ...dateRangeKey(range),
    ],
    activities: (range) => ["dashboard", "activities", ...dateRangeKey(range)],
  }),
  analytics: Object.freeze({
    all: Object.freeze(["analytics"]),
    overview: (range) => ["analytics", "overview", ...dateRangeKey(range)],
  }),
  users: Object.freeze({
    all: Object.freeze(["users"]),
    list: (filters) => ["users", "list", filters],
    detail: (id) => ["users", "detail", id],
  }),
  products: Object.freeze({
    all: Object.freeze(["products"]),
    list: (filters) => ["products", "list", filters],
    detail: (id) => ["products", "detail", id],
  }),
  orders: Object.freeze({
    all: Object.freeze(["orders"]),
    list: (filters) => ["orders", "list", filters],
    detail: (id) => ["orders", "detail", id],
  }),
});
