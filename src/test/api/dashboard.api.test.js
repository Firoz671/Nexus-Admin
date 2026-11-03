import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import {
  getDashboardSummary,
  getRecentActivities,
  getRecentTransactions,
  getRevenueAnalytics,
  getSalesOverview,
  getUserGrowth,
} from "@/services/api/dashboard.api";
import { getAnalyticsOverview } from "@/services/api/analytics.api";
import { ENDPOINTS } from "@/services/api/endpoints";
import { server } from "@/mocks/server";
import { useAuthStore } from "@/store/authStore";
import { createDateRange } from "@/utils/dateRange";
import { signInAs } from "../helpers/auth";

const RANGE = createDateRange("7d");

describe("mock dashboard and analytics API", () => {
  beforeEach(() => {
    signInAs("admin");
  });

  it("returns a deterministic dashboard summary with KPI changes", async () => {
    const first = await getDashboardSummary(RANGE);
    const second = await getDashboardSummary(RANGE);

    expect(second).toEqual(first);
    expect(first.range).toMatchObject({ preset: "7d" });
    expect(first.kpis).toHaveLength(4);
    expect(first.kpis.map((kpi) => kpi.id)).toEqual([
      "revenue",
      "orders",
      "activeUsers",
      "subscriptions",
    ]);

    for (const kpi of first.kpis) {
      expect(typeof kpi.value).toBe("number");
      expect(Number.isFinite(kpi.change)).toBe(true);
      expect(kpi.comparisonLabel).toBe("vs previous 7 days");
      expect(["up", "down", "flat"]).toContain(kpi.trend);
    }

    expect(first.kpis[0].format).toBe("currency");
    expect(first.kpis[0].value).toBeGreaterThan(0);
  });

  it("returns revenue, sales, and user growth series", async () => {
    const revenue = await getRevenueAnalytics(RANGE);
    const sales = await getSalesOverview(RANGE);
    const growth = await getUserGrowth(RANGE);

    expect(revenue.granularity).toBe("day");
    expect(revenue.points).toHaveLength(7);
    expect(revenue.points[0]).toEqual(
      expect.objectContaining({
        date: expect.any(String),
        label: expect.any(String),
        revenue: expect.any(Number),
        previousRevenue: expect.any(Number),
      }),
    );
    expect(revenue.totals.revenue).toBeGreaterThan(0);

    expect(sales.total).toBeGreaterThan(0);
    expect(sales.statuses.map((status) => status.status)).toEqual([
      "completed",
      "pending",
      "cancelled",
    ]);
    expect(
      sales.statuses.reduce((total, status) => total + status.value, 0),
    ).toBe(sales.total);

    expect(growth.points).toHaveLength(7);
    expect(growth.totalNewUsers).toBeGreaterThan(0);
    expect(growth.points[0]).toEqual(
      expect.objectContaining({
        newUsers: expect.any(Number),
        previousNewUsers: expect.any(Number),
      }),
    );
  });

  it("returns transactions and activity with the expected structure", async () => {
    const transactions = await getRecentTransactions(RANGE);
    const activities = await getRecentActivities(RANGE);

    expect(transactions.items).toHaveLength(8);
    expect(transactions.items[0]).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^TRX-/),
        customer: expect.any(String),
        date: expect.any(String),
        amount: expect.any(Number),
        method: expect.any(String),
        status: expect.any(String),
      }),
    );
    expect(
      new Set(transactions.items.map((item) => item.status)),
    ).toEqual(new Set(["completed", "pending", "failed", "refunded"]));

    expect(activities.items).toHaveLength(6);
    expect(activities.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        type: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        timestamp: expect.any(String),
      }),
    );

    const rangeStart = new Date(`${RANGE.start}T00:00:00`);
    const rangeEnd = new Date(`${RANGE.end}T23:59:59.999`);
    const now = new Date();

    for (const item of [...transactions.items, ...activities.items]) {
      const timestamp = new Date(item.date ?? item.timestamp);

      expect(timestamp >= rangeStart).toBe(true);
      expect(timestamp <= rangeEnd).toBe(true);
      expect(timestamp <= now).toBe(true);
    }
  });

  it("returns a consolidated analytics overview", async () => {
    const overview = await getAnalyticsOverview(RANGE);

    expect(overview.summary.kpis).toHaveLength(4);
    expect(overview.revenueTrend.points).toHaveLength(7);
    expect(overview.salesPerformance.statuses).toHaveLength(3);
    expect(overview.userAcquisition.points).toHaveLength(7);
    expect(overview.subscriptionPerformance.points).toHaveLength(7);
    expect(overview.subscriptionPerformance.activeSubscriptions).toBeGreaterThan(
      0,
    );
    expect(overview.productPerformance.items).toHaveLength(5);
    expect(overview.productPerformance.items[0]).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        category: expect.any(String),
        unitsSold: expect.any(Number),
        revenue: expect.any(Number),
        share: expect.any(Number),
      }),
    );
  });

  it("passes the selected range through query parameters", async () => {
    let capturedParams = null;

    server.use(
      http.get(/\/dashboard\/summary\/?$/, ({ request }) => {
        capturedParams = new URL(request.url).searchParams;

        return HttpResponse.json({
          success: true,
          message: "Captured",
          data: { range: RANGE, kpis: [] },
        });
      }),
    );

    await getDashboardSummary({
      preset: "custom",
      start: "2026-01-10",
      end: "2026-01-20",
    });

    expect(capturedParams.get("range")).toBe("custom");
    expect(capturedParams.get("start")).toBe("2026-01-10");
    expect(capturedParams.get("end")).toBe("2026-01-20");
  });

  it("rejects invalid date range query parameters", async () => {
    await expect(
      getDashboardSummary({
        preset: "custom",
        start: "2026-02-10",
        end: "2026-02-01",
      }),
    ).rejects.toThrow("The start date must be on or before the end date.");

    await expect(
      getDashboardSummary({
        preset: "last-decade",
        start: "2026-01-01",
        end: "2026-01-02",
      }),
    ).rejects.toThrow(
      "Unknown date range. Use 7d, 30d, 90d, year, or custom.",
    );
  });

  it("requires authentication for dashboard resources", async () => {
    useAuthStore.setState({ accessToken: null });

    await expect(getDashboardSummary(RANGE)).rejects.toThrow(
      "Authentication is required.",
    );
  });

  it("uses the expected endpoint paths", () => {
    expect(ENDPOINTS.dashboard.summary).toBe("/dashboard/summary");
    expect(ENDPOINTS.dashboard.userGrowth).toBe("/dashboard/user-growth");
    expect(ENDPOINTS.analytics.overview).toBe("/analytics/overview");
  });
});
