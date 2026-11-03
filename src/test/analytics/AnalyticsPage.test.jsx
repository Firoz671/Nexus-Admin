import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { App } from "@/app/App";
import { server } from "@/mocks/server";
import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import { signInAs } from "../helpers/auth";

function renderAnalytics() {
  window.history.replaceState({}, "", "/analytics");
  return render(<App />);
}

describe("AnalyticsPage", () => {
  beforeEach(() => {
    signInAs("admin");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(
    "renders summary metrics, charts, subscription performance, and products",
    async () => {
      renderAnalytics();

      await screen.findByRole("heading", { level: 1, name: "Analytics" });

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
        screen.getByRole("img", {
          name: /subscription performance chart/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByText("Active subscriptions")).toBeInTheDocument();
      expect(screen.getByText("Churn rate")).toBeInTheDocument();

      expect(
        await screen.findByText("Nexus Analytics Suite"),
      ).toBeInTheDocument();
      expect(screen.getByText("Product performance")).toBeInTheDocument();
    },
    20000,
  );

  it(
    "requests filtered analytics when the date range changes",
    async () => {
      const user = userEvent.setup();
      const getSpy = vi.spyOn(apiClient, "get");

      renderAnalytics();

      await screen.findByRole("heading", { level: 1, name: "Analytics" });
      await screen.findByText("Total Revenue");

      getSpy.mockClear();

      await user.click(screen.getByRole("button", { name: "Last 90 days" }));

      await waitFor(() => {
        expect(
          getSpy.mock.calls.some(
            ([url, config]) =>
              url === ENDPOINTS.analytics.overview &&
              config?.params?.range === "90d",
          ),
        ).toBe(true);
      });
    },
    20000,
  );

  it(
    "shows an error state when the analytics request fails",
    async () => {
      server.use(
        http.get(/\/analytics\/overview\/?$/, () =>
          HttpResponse.json(
            {
              success: false,
              message: "Analytics is temporarily unavailable.",
              data: null,
            },
            { status: 503 },
          ),
        ),
      );

      renderAnalytics();

      expect(
        await screen.findByText("Unable to load key metrics"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Unable to load revenue trend"),
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Analytics is temporarily unavailable.").length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByRole("button", { name: "Try again" }).length,
      ).toBeGreaterThan(0);
    },
    20000,
  );

  it(
    "allows managers to access analytics while preserving settings restrictions",
    async () => {
      signInAs("manager");

      renderAnalytics();

      await screen.findByRole("heading", { level: 1, name: "Analytics" });

      const sidebar = screen.getByRole("complementary", { name: "Sidebar" });

      expect(
        within(sidebar).getByRole("link", { name: "Analytics" }),
      ).toBeInTheDocument();
      expect(
        within(sidebar).queryByRole("link", { name: "Settings" }),
      ).not.toBeInTheDocument();
    },
    20000,
  );
});
