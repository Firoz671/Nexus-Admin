import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { App } from "@/app/App";
import { buildDashboardSummary } from "@/mocks/data/analytics";
import { server } from "@/mocks/server";
import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import { resolveDateRangeParams } from "@/utils/dateRange";
import { signInAs } from "../helpers/auth";

function renderDashboard() {
  window.history.replaceState({}, "", "/dashboard");
  return render(<App />);
}

function summaryResponseFromRequest(request) {
  const range = resolveDateRangeParams(
    new URL(request.url).searchParams,
  );

  return HttpResponse.json({
    success: true,
    message: "Dashboard summary retrieved",
    data: buildDashboardSummary(range),
  });
}

describe("DashboardPage", () => {
  beforeEach(() => {
    signInAs("admin");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(
    "renders API-driven KPIs, charts, transactions, and activity",
    async () => {
      renderDashboard();

      await screen.findByRole("heading", { level: 1, name: "Overview" });

      expect(await screen.findByText("Total Revenue")).toBeInTheDocument();
      expect(screen.getByText("Total Orders")).toBeInTheDocument();
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("Total Subscriptions")).toBeInTheDocument();

      expect(
        await screen.findByRole("img", { name: /revenue trend chart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: /sales status distribution chart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: /new user growth chart/i }),
      ).toBeInTheDocument();

      expect(
        (await screen.findAllByText(/^TRX-/)).length,
      ).toBeGreaterThan(0);
      expect(await screen.findByText("Order completed")).toBeInTheDocument();
      expect(screen.getByText("Recent transactions")).toBeInTheDocument();
      expect(screen.getByText("Recent activity")).toBeInTheDocument();
    },
    20000,
  );

  it(
    "shows skeleton loading states before KPI data arrives",
    async () => {
      server.use(
        http.get(/\/dashboard\/summary\/?$/, async ({ request }) => {
          await delay(200);

          return summaryResponseFromRequest(request);
        }),
      );

      renderDashboard();

      await screen.findByRole("heading", { level: 1, name: "Overview" });

      expect(
        screen.getByRole("status", { name: "Loading key metrics" }),
      ).toBeInTheDocument();

      expect(await screen.findByText("Total Revenue")).toBeInTheDocument();
    },
    20000,
  );

  it(
    "requests filtered data when the date range changes",
    async () => {
      const user = userEvent.setup();
      const getSpy = vi.spyOn(apiClient, "get");

      renderDashboard();

      await screen.findByRole("heading", { level: 1, name: "Overview" });
      await screen.findByText("Total Revenue");

      getSpy.mockClear();

      await user.click(screen.getByRole("button", { name: "Last 7 days" }));

      await waitFor(() => {
        expect(
          getSpy.mock.calls.some(
            ([url, config]) =>
              url === ENDPOINTS.dashboard.summary &&
              config?.params?.range === "7d",
          ),
        ).toBe(true);
      });

      expect(
        screen.getByRole("button", { name: "Last 7 days" }),
      ).toHaveAttribute("aria-pressed", "true");
    },
    20000,
  );

  it(
    "renders an empty state when no transactions exist",
    async () => {
      server.use(
        http.get(/\/dashboard\/transactions\/?$/, ({ request }) => {
          const range = resolveDateRangeParams(
            new URL(request.url).searchParams,
          );

          return HttpResponse.json({
            success: true,
            message: "Recent transactions retrieved",
            data: { range, items: [] },
          });
        }),
      );

      renderDashboard();

      expect(
        await screen.findByText("No transactions in this range"),
      ).toBeInTheDocument();
    },
    20000,
  );

  it(
    "renders an empty state instead of a zero-value revenue chart",
    async () => {
      server.use(
        http.get(/\/dashboard\/revenue\/?$/, ({ request }) => {
          const range = resolveDateRangeParams(
            new URL(request.url).searchParams,
          );

          return HttpResponse.json({
            success: true,
            message: "Revenue analytics retrieved",
            data: {
              range,
              granularity: "day",
              currency: "USD",
              points: [],
              totals: { revenue: 0, previousRevenue: 0, change: 0 },
            },
          });
        }),
      );

      renderDashboard();

      expect(
        await screen.findByText("No revenue data for this range"),
      ).toBeInTheDocument();
    },
    20000,
  );

  it(
    "shows an error state and retries the KPI request",
    async () => {
      const user = userEvent.setup();

      server.use(
        http.get(/\/dashboard\/summary\/?$/, () =>
          HttpResponse.json(
            {
              success: false,
              message: "Summary is temporarily unavailable.",
              data: null,
            },
            { status: 503 },
          ),
        ),
      );

      renderDashboard();

      expect(
        await screen.findByText("Unable to load key metrics"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Summary is temporarily unavailable."),
      ).toBeInTheDocument();

      const retryButton = screen.getByRole("button", { name: "Try again" });

      server.use(
        http.get(/\/dashboard\/summary\/?$/, ({ request }) =>
          summaryResponseFromRequest(request),
        ),
      );

      await user.click(retryButton);

      expect(await screen.findByText("Total Revenue")).toBeInTheDocument();
    },
    20000,
  );
});
