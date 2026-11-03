import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { buildDashboardSummary } from "@/mocks/data/analytics";
import { server } from "@/mocks/server";
import { useAnalyticsOverview } from "@/features/analytics/hooks/useAnalyticsData";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardData";
import { createDateRange, resolveDateRangeParams } from "@/utils/dateRange";
import { signInAs } from "../helpers/auth";

function createTestQueryClient({ retry = false } = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry,
        gcTime: 0,
      },
    },
  });
}

function createWrapper(queryClient) {
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function buildSummaryResponse(request) {
  const params = new URL(request.url).searchParams;
  const range = resolveDateRangeParams(params);

  return HttpResponse.json({
    success: true,
    message: "Dashboard summary retrieved",
    data: buildDashboardSummary(range),
  });
}

describe("dashboard React Query hooks", () => {
  beforeEach(() => {
    signInAs("admin");
  });

  it("loads dashboard summary data", async () => {
    const queryClient = createTestQueryClient();
    const range = createDateRange("7d");
    const { result } = renderHook(() => useDashboardSummary(range), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data.kpis).toHaveLength(4);
    expect(result.current.data.range.preset).toBe("7d");
  });

  it("surfaces API error messages", async () => {
    const queryClient = createTestQueryClient();
    const range = createDateRange("30d");

    server.use(
      http.get(/\/dashboard\/summary\/?$/, () =>
        HttpResponse.json(
          {
            success: false,
            message: "Dashboard service unavailable.",
            data: null,
          },
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() => useDashboardSummary(range), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error.message).toBe(
      "Dashboard service unavailable.",
    );
  });

  it("retries transient failures", async () => {
    const queryClient = createTestQueryClient({ retry: 1 });
    const range = createDateRange("7d");
    let attemptCount = 0;

    server.use(
      http.get(/\/dashboard\/summary\/?$/, ({ request }) => {
        attemptCount += 1;

        if (attemptCount === 1) {
          return HttpResponse.json(
            {
              success: false,
              message: "Temporary service failure.",
              data: null,
            },
            { status: 503 },
          );
        }

        return buildSummaryResponse(request);
      }),
    );

    const { result } = renderHook(() => useDashboardSummary(range), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(attemptCount).toBe(2);
  });

  it("refetches with a new query key when the date range changes", async () => {
    const queryClient = createTestQueryClient();
    const ranges = [];

    server.use(
      http.get(/\/dashboard\/summary\/?$/, (info) => {
        const params = new URL(info.request.url).searchParams;
        ranges.push(params.get("range"));

        return buildSummaryResponse(info.request);
      }),
    );

    const { result, rerender } = renderHook(
      ({ range }) => useDashboardSummary(range),
      {
        initialProps: { range: createDateRange("7d") },
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.data?.range.preset).toBe("7d");
    });

    rerender({ range: createDateRange("30d") });

    await waitFor(() => {
      expect(result.current.data?.range.preset).toBe("30d");
    });

    expect(ranges).toContain("7d");
    expect(ranges).toContain("30d");
  });

  it("loads the analytics overview through its own query key", async () => {
    const queryClient = createTestQueryClient();
    const range = createDateRange("90d");
    const { result } = renderHook(() => useAnalyticsOverview(range), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data.revenueTrend.granularity).toBe("week");
    expect(result.current.data.productPerformance.items.length).toBeGreaterThan(
      0,
    );
    expect(queryClient.getQueryData(["analytics", "overview", "90d"])).toBe(
      undefined,
    );
    expect(
      queryClient.getQueryData([
        "analytics",
        "overview",
        "90d",
        range.start,
        range.end,
      ]),
    ).toBeTruthy();
  });
});
