import {
  addDays,
  differenceInCalendarDays,
  differenceInMinutes,
  endOfDay,
  format,
  getDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMinutes,
} from "date-fns";
import {
  DATE_FORMAT,
  getPreviousDateRange,
  getRangeDayCount,
  parseDateKey,
} from "@/utils/dateRange";

const REVENUE_EPOCH = new Date(2024, 0, 1);

const CUSTOMERS = Object.freeze([
  "Maya Chen",
  "Liam Bennett",
  "Sofia Alvarez",
  "Noah Williams",
  "Priya Shah",
  "Ethan Brooks",
  "Amara Okafor",
  "Lucas Meyer",
  "Hana Kim",
  "Oliver Grant",
  "Zara Ahmed",
  "Mateo Rossi",
]);

const PAYMENT_METHODS = Object.freeze([
  "Visa •••• 4242",
  "Mastercard •••• 8810",
  "PayPal",
  "Bank transfer",
  "Amex •••• 3005",
]);

const TRANSACTION_STATUS_SEQUENCE = Object.freeze([
  "completed",
  "completed",
  "pending",
  "completed",
  "failed",
  "completed",
  "refunded",
  "pending",
]);

const ACTIVITY_TEMPLATES = Object.freeze([
  {
    type: "user_registered",
    title: "New user registered",
    buildDescription: (name) => `${name} joined the workspace.`,
  },
  {
    type: "order_completed",
    title: "Order completed",
    buildDescription: (name) => `Order for ${name} was marked as completed.`,
  },
  {
    type: "payment_received",
    title: "Payment received",
    buildDescription: (name) => `Payment from ${name} was confirmed.`,
  },
  {
    type: "subscription_created",
    title: "Subscription created",
    buildDescription: (name) => `${name} started a Pro subscription.`,
  },
  {
    type: "product_updated",
    title: "Product updated",
    buildDescription: (name) => `${name} updated the Analytics Suite details.`,
  },
  {
    type: "user_registered",
    title: "New user registered",
    buildDescription: (name) => `${name} accepted a workspace invitation.`,
  },
]);

const PRODUCT_CATALOG = Object.freeze([
  {
    id: "product-analytics-suite",
    name: "Nexus Analytics Suite",
    category: "Analytics",
    baseUnits: 420,
    baseRevenue: 31500,
  },
  {
    id: "product-command-center",
    name: "Command Center Pro",
    category: "Operations",
    baseUnits: 318,
    baseRevenue: 24800,
  },
  {
    id: "product-workflow-automations",
    name: "Workflow Automations",
    category: "Automation",
    baseUnits: 286,
    baseRevenue: 19200,
  },
  {
    id: "product-audit-log",
    name: "Audit Log Add-on",
    category: "Security",
    baseUnits: 204,
    baseRevenue: 12800,
  },
  {
    id: "product-priority-support",
    name: "Priority Support",
    category: "Services",
    baseUnits: 164,
    baseRevenue: 9600,
  },
]);

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function roundPercentage(value) {
  return Math.round(value * 10) / 10;
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomFor(key) {
  return createSeededRandom(hashString(key))();
}

function eachDate(range) {
  const start = parseDateKey(range?.start);

  if (!start) {
    return [];
  }

  return Array.from({ length: getRangeDayCount(range) }, (_, index) =>
    format(addDays(start, index), DATE_FORMAT),
  );
}

function getEpochDay(dateIso) {
  return differenceInCalendarDays(parseISO(dateIso), REVENUE_EPOCH);
}

function getBucketMeta(dateIso, granularity) {
  const date = parseISO(dateIso);

  if (granularity === "month") {
    const bucketDate = startOfMonth(date);

    return {
      key: format(bucketDate, DATE_FORMAT),
      label: format(bucketDate, "MMM yyyy"),
      tooltipLabel: format(bucketDate, "MMMM yyyy"),
    };
  }

  if (granularity === "week") {
    const bucketDate = startOfWeek(date, { weekStartsOn: 1 });

    return {
      key: format(bucketDate, DATE_FORMAT),
      label: format(bucketDate, "MMM d"),
      tooltipLabel: `Week of ${format(bucketDate, "MMM d, yyyy")}`,
    };
  }

  return {
    key: dateIso,
    label: format(date, "MMM d"),
    tooltipLabel: format(date, "MMM d, yyyy"),
  };
}

function pickGranularity(days) {
  if (days <= 31) {
    return "day";
  }

  if (days <= 120) {
    return "week";
  }

  return "month";
}

function revenueForDate(dateIso) {
  const date = parseISO(dateIso);
  const dayOfWeek = getDay(date);
  const weekendFactor = dayOfWeek === 0 ? 0.78 : dayOfWeek === 6 ? 0.86 : 1;
  const trendFactor = 1 + Math.max(0, getEpochDay(dateIso)) * 0.00035;
  const noise = 0.78 + randomFor(`${dateIso}:revenue`) * 0.5;

  return roundCurrency(4100 * weekendFactor * trendFactor * noise);
}

function ordersForDate(dateIso) {
  const date = parseISO(dateIso);
  const dayOfWeek = getDay(date);
  const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.82 : 1;
  const trendFactor = 1 + Math.max(0, getEpochDay(dateIso)) * 0.0002;
  const noise = 0.8 + randomFor(`${dateIso}:orders`) * 0.45;
  const total = Math.max(20, Math.round(74 * weekendFactor * trendFactor * noise));
  const pending = Math.round(
    total * (0.08 + randomFor(`${dateIso}:pending`) * 0.08),
  );
  const cancelled = Math.round(
    total * (0.03 + randomFor(`${dateIso}:cancelled`) * 0.04),
  );

  return {
    total,
    completed: Math.max(0, total - pending - cancelled),
    pending,
    cancelled,
  };
}

function newUsersForDate(dateIso) {
  const date = parseISO(dateIso);
  const dayOfWeek = getDay(date);
  const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
  const trendFactor = 1 + Math.max(0, getEpochDay(dateIso)) * 0.00025;
  const noise = 0.7 + randomFor(`${dateIso}:users`) * 0.7;

  return Math.max(3, Math.round(26 * weekendFactor * trendFactor * noise));
}

function activeUsersOn(dateIso) {
  const epoch = Math.max(0, getEpochDay(dateIso));
  const noise = 0.95 + randomFor(`${dateIso}:active-users`) * 0.1;

  return Math.round((1720 + epoch * 0.9) * noise);
}

function subscriptionsOn(dateIso) {
  const epoch = Math.max(0, getEpochDay(dateIso));
  const noise = 0.97 + randomFor(`${dateIso}:subscriptions`) * 0.06;

  return Math.round((980 + epoch * 0.42) * noise);
}

function newSubscriptionsForDate(dateIso) {
  const epoch = Math.max(0, getEpochDay(dateIso));
  const trendFactor = 1 + epoch * 0.00015;
  const noise = 0.72 + randomFor(`${dateIso}:new-subscriptions`) * 0.65;

  return Math.max(1, Math.round(8 * trendFactor * noise));
}

function churnedSubscriptionsForDate(dateIso) {
  const noise = 0.65 + randomFor(`${dateIso}:churned-subscriptions`) * 0.9;

  return Math.max(0, Math.round(3 * noise));
}

function aggregateRange(range) {
  return eachDate(range).reduce(
    (totals, dateIso) => {
      const orders = ordersForDate(dateIso);

      return {
        revenue: roundCurrency(totals.revenue + revenueForDate(dateIso)),
        orders: totals.orders + orders.total,
        completedOrders: totals.completedOrders + orders.completed,
        pendingOrders: totals.pendingOrders + orders.pending,
        cancelledOrders: totals.cancelledOrders + orders.cancelled,
        newUsers: totals.newUsers + newUsersForDate(dateIso),
        newSubscriptions:
          totals.newSubscriptions + newSubscriptionsForDate(dateIso),
        churnedSubscriptions:
          totals.churnedSubscriptions + churnedSubscriptionsForDate(dateIso),
      };
    },
    {
      revenue: 0,
      orders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0,
      newUsers: 0,
      newSubscriptions: 0,
      churnedSubscriptions: 0,
    },
  );
}

function percentChange(current, previous) {
  if (!previous) {
    return 0;
  }

  return roundPercentage(((current - previous) / previous) * 100);
}

function buildComparisonLabel(range) {
  const days = getRangeDayCount(range);

  return range?.preset === "year" ? "vs previous period" : `vs previous ${days} days`;
}

function buildKpi({
  id,
  label,
  value,
  format: valueFormat,
  current,
  previous,
  comparisonLabel,
}) {
  const change = percentChange(current, previous);

  return {
    id,
    label,
    value,
    format: valueFormat,
    change,
    trend: change > 0 ? "up" : change < 0 ? "down" : "flat",
    comparisonLabel,
  };
}

export function buildDashboardSummary(range) {
  const current = aggregateRange(range);
  const previousRange = getPreviousDateRange(range);
  const previous = previousRange
    ? aggregateRange(previousRange)
    : { ...current, revenue: current.revenue * 0.94, orders: current.orders * 0.95 };
  const comparisonLabel = buildComparisonLabel(range);
  const currentActiveUsers = activeUsersOn(range.end);
  const previousActiveUsers = previousRange
    ? activeUsersOn(previousRange.end)
    : currentActiveUsers * 0.95;
  const currentSubscriptions = subscriptionsOn(range.end);
  const previousSubscriptions = previousRange
    ? subscriptionsOn(previousRange.end)
    : currentSubscriptions * 0.95;

  return {
    range,
    kpis: [
      buildKpi({
        id: "revenue",
        label: "Total Revenue",
        value: current.revenue,
        format: "currency",
        current: current.revenue,
        previous: previous.revenue,
        comparisonLabel,
      }),
      buildKpi({
        id: "orders",
        label: "Total Orders",
        value: current.orders,
        format: "number",
        current: current.orders,
        previous: previous.orders,
        comparisonLabel,
      }),
      buildKpi({
        id: "activeUsers",
        label: "Active Users",
        value: currentActiveUsers,
        format: "number",
        current: currentActiveUsers,
        previous: previousActiveUsers,
        comparisonLabel,
      }),
      buildKpi({
        id: "subscriptions",
        label: "Total Subscriptions",
        value: currentSubscriptions,
        format: "number",
        current: currentSubscriptions,
        previous: previousSubscriptions,
        comparisonLabel,
      }),
    ],
  };
}

export function buildRevenueSeries(range) {
  const currentDates = eachDate(range);
  const previousRange = getPreviousDateRange(range);
  const previousDates = previousRange ? eachDate(previousRange) : [];
  const granularity = pickGranularity(getRangeDayCount(range));
  const buckets = new Map();

  currentDates.forEach((dateIso, index) => {
    const meta = getBucketMeta(dateIso, granularity);
    const bucket =
      buckets.get(meta.key) ??
      {
        date: meta.key,
        label: meta.label,
        tooltipLabel: meta.tooltipLabel,
        revenue: 0,
        previousRevenue: 0,
      };

    bucket.revenue += revenueForDate(dateIso);
    bucket.previousRevenue += revenueForDate(previousDates[index] ?? dateIso);
    buckets.set(meta.key, bucket);
  });

  const points = Array.from(buckets.values()).map((point) => ({
    ...point,
    revenue: roundCurrency(point.revenue),
    previousRevenue: roundCurrency(point.previousRevenue),
  }));

  const revenue = roundCurrency(
    points.reduce((total, point) => total + point.revenue, 0),
  );
  const previousRevenue = roundCurrency(
    points.reduce((total, point) => total + point.previousRevenue, 0),
  );

  return {
    range,
    granularity,
    currency: "USD",
    points,
    totals: {
      revenue,
      previousRevenue,
      change: percentChange(revenue, previousRevenue),
    },
  };
}

export function buildSalesSummary(range) {
  const current = aggregateRange(range);
  const previousRange = getPreviousDateRange(range);
  const previous = previousRange ? aggregateRange(previousRange) : null;
  const total = current.completedOrders + current.pendingOrders + current.cancelledOrders;
  const statuses = [
    {
      status: "completed",
      label: "Completed",
      value: current.completedOrders,
    },
    {
      status: "pending",
      label: "Pending",
      value: current.pendingOrders,
    },
    {
      status: "cancelled",
      label: "Cancelled",
      value: current.cancelledOrders,
    },
  ].map((status) => ({
    ...status,
    percentage: total ? roundPercentage((status.value / total) * 100) : 0,
  }));

  return {
    range,
    total,
    totalChange: previous
      ? percentChange(
          total,
          previous.completedOrders +
            previous.pendingOrders +
            previous.cancelledOrders,
        )
      : 0,
    statuses,
  };
}

export function buildUserGrowth(range) {
  const currentDates = eachDate(range);
  const previousRange = getPreviousDateRange(range);
  const previousDates = previousRange ? eachDate(previousRange) : [];
  const granularity = pickGranularity(getRangeDayCount(range));
  const buckets = new Map();

  currentDates.forEach((dateIso, index) => {
    const meta = getBucketMeta(dateIso, granularity);
    const bucket =
      buckets.get(meta.key) ??
      {
        date: meta.key,
        label: meta.label,
        tooltipLabel: meta.tooltipLabel,
        newUsers: 0,
        previousNewUsers: 0,
      };

    bucket.newUsers += newUsersForDate(dateIso);
    bucket.previousNewUsers += newUsersForDate(previousDates[index] ?? dateIso);
    buckets.set(meta.key, bucket);
  });

  const points = Array.from(buckets.values());
  const totalNewUsers = points.reduce((total, point) => total + point.newUsers, 0);
  const previousNewUsers = points.reduce(
    (total, point) => total + point.previousNewUsers,
    0,
  );

  return {
    range,
    granularity,
    points,
    totalNewUsers,
    previousNewUsers,
    change: percentChange(totalNewUsers, previousNewUsers),
  };
}

function getActivityAnchor(range) {
  const start = startOfDay(parseISO(range.start));
  const end = endOfDay(parseISO(range.end));
  const now = new Date();

  return {
    start,
    anchor: end > now && now >= start ? now : end,
  };
}

export function buildRecentTransactions(range, limit = 8) {
  const { start, anchor } = getActivityAnchor(range);
  const availableMinutes = Math.max(1, differenceInMinutes(anchor, start));
  const end = endOfDay(parseISO(range.end));
  const items = Array.from({ length: limit }, (_, index) => {
    const seed = randomFor(`${range.start}:${range.end}:transaction:${index}`);
    const offsetMinutes = Math.min(
      availableMinutes - 1,
      index * 41 + Math.round(seed * 29),
    );
    const timestamp = subMinutes(anchor, offsetMinutes);
    const customer =
      CUSTOMERS[(index + Math.floor(seed * CUSTOMERS.length)) % CUSTOMERS.length];
    const method =
      PAYMENT_METHODS[
        (index + Math.round(randomFor(`${range.end}:method:${index}`) * 4)) %
          PAYMENT_METHODS.length
      ];

    return {
      id: `TRX-${format(end, "yyMMdd")}-${String(
        2400 + index * 7 + Math.round(seed * 31),
      ).padStart(4, "0")}`,
      customer,
      date: timestamp.toISOString(),
      amount: roundCurrency(38 + seed * 1240),
      method,
      status: TRANSACTION_STATUS_SEQUENCE[index % TRANSACTION_STATUS_SEQUENCE.length],
    };
  });

  return { range, items };
}

export function buildRecentActivities(range, limit = 6) {
  const { start, anchor } = getActivityAnchor(range);
  const end = endOfDay(parseISO(range.end));
  const availableMinutes = Math.max(1, differenceInMinutes(anchor, start));

  const items = ACTIVITY_TEMPLATES.slice(0, limit).map((template, index) => {
    const seed = randomFor(`${range.start}:${range.end}:activity:${index}`);
    const offsetMinutes = Math.min(
      availableMinutes - 1,
      index * 53 + Math.round(seed * 37),
    );
    const customer =
      CUSTOMERS[(index + Math.round(seed * CUSTOMERS.length)) % CUSTOMERS.length];

    return {
      id: `activity-${format(end, DATE_FORMAT)}-${index + 1}`,
      type: template.type,
      title: template.title,
      description: template.buildDescription(customer),
      timestamp: subMinutes(anchor, offsetMinutes).toISOString(),
    };
  });

  return { range, items };
}

export function buildSubscriptionPerformance(range) {
  const currentDates = eachDate(range);
  const granularity = pickGranularity(getRangeDayCount(range));
  const buckets = new Map();

  currentDates.forEach((dateIso) => {
    const meta = getBucketMeta(dateIso, granularity);
    const bucket =
      buckets.get(meta.key) ??
      {
        date: meta.key,
        label: meta.label,
        tooltipLabel: meta.tooltipLabel,
        newSubscriptions: 0,
        churnedSubscriptions: 0,
        activeSubscriptions: 0,
      };

    bucket.newSubscriptions += newSubscriptionsForDate(dateIso);
    bucket.churnedSubscriptions += churnedSubscriptionsForDate(dateIso);
    bucket.activeSubscriptions = subscriptionsOn(dateIso);
    buckets.set(meta.key, bucket);
  });

  const points = Array.from(buckets.values());
  const newSubscriptions = points.reduce(
    (total, point) => total + point.newSubscriptions,
    0,
  );
  const churnedSubscriptions = points.reduce(
    (total, point) => total + point.churnedSubscriptions,
    0,
  );
  const activeSubscriptions = subscriptionsOn(range.end);
  const churnRate = activeSubscriptions
    ? roundPercentage(
        (churnedSubscriptions / (activeSubscriptions + churnedSubscriptions)) *
          100,
      )
    : 0;

  return {
    range,
    granularity,
    points,
    activeSubscriptions,
    newSubscriptions,
    churnedSubscriptions,
    churnRate,
  };
}

export function buildProductPerformance(range) {
  const days = Math.max(1, getRangeDayCount(range));
  const scale = days / 30;
  const items = PRODUCT_CATALOG.map((product) => {
    const noise =
      0.9 + randomFor(`${range.start}:${range.end}:${product.id}`) * 0.2;

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      unitsSold: Math.max(1, Math.round(product.baseUnits * scale * noise)),
      revenue: roundCurrency(product.baseRevenue * scale * noise),
    };
  });
  const totalRevenue = roundCurrency(
    items.reduce((total, product) => total + product.revenue, 0),
  );

  return {
    range,
    totalRevenue,
    items: items
      .map((product) => ({
        ...product,
        share: totalRevenue
          ? roundPercentage((product.revenue / totalRevenue) * 100)
          : 0,
      }))
      .sort((first, second) => second.revenue - first.revenue),
  };
}

export function buildAnalyticsOverview(range) {
  return {
    range,
    summary: {
      kpis: buildDashboardSummary(range).kpis,
    },
    revenueTrend: buildRevenueSeries(range),
    salesPerformance: buildSalesSummary(range),
    userAcquisition: buildUserGrowth(range),
    subscriptionPerformance: buildSubscriptionPerformance(range),
    productPerformance: buildProductPerformance(range),
  };
}
