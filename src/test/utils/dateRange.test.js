import { describe, expect, it } from "vitest";
import {
  createCustomDateRange,
  createDateRange,
  formatDateRangeLabel,
  getPreviousDateRange,
  getRangeDayCount,
  resolveDateRangeParams,
  toDateRangeQueryParams,
} from "@/utils/dateRange";

const NOW = new Date(2026, 10, 2, 14, 30);

describe("date range utilities", () => {
  it("creates inclusive preset ranges", () => {
    const lastSevenDays = createDateRange("7d", NOW);
    const lastThirtyDays = createDateRange("30d", NOW);

    expect(lastSevenDays).toEqual({
      preset: "7d",
      start: "2026-10-27",
      end: "2026-11-02",
    });
    expect(getRangeDayCount(lastSevenDays)).toBe(7);
    expect(getRangeDayCount(lastThirtyDays)).toBe(30);
  });

  it("creates a year-to-date range", () => {
    const range = createDateRange("year", NOW);

    expect(range.start).toBe("2026-01-01");
    expect(range.end).toBe("2026-11-02");
  });

  it("validates custom ranges", () => {
    expect(createCustomDateRange("2026-10-01", "2026-10-15")).toEqual({
      preset: "custom",
      start: "2026-10-01",
      end: "2026-10-15",
    });

    expect(() => createCustomDateRange("2026-10-15", "2026-10-01")).toThrow(
      "The start date must be on or before the end date.",
    );
    expect(() => createCustomDateRange("not-a-date", "2026-10-01")).toThrow(
      "Choose a valid start and end date.",
    );
    expect(() => createCustomDateRange("2024-01-01", "2026-01-02")).toThrow(
      "Custom date ranges can cover up to 366 days.",
    );
  });

  it("parses query parameters for presets, custom ranges, and errors", () => {
    expect(
      resolveDateRangeParams({ range: "7d" }, NOW),
    ).toMatchObject({ preset: "7d", start: "2026-10-27", end: "2026-11-02" });

    expect(
      resolveDateRangeParams(
        {
          range: "custom",
          start: "2026-01-10",
          end: "2026-01-20",
        },
        NOW,
      ),
    ).toEqual({
      preset: "custom",
      start: "2026-01-10",
      end: "2026-01-20",
    });

    expect(
      resolveDateRangeParams(
        {
          range: "90d",
          start: "2026-07-01",
          end: "2026-07-31",
        },
        NOW,
      ),
    ).toMatchObject({ preset: "90d", start: "2026-07-01", end: "2026-07-31" });

    expect(() =>
      resolveDateRangeParams({ range: "invalid" }, NOW),
    ).toThrow("Unknown date range. Use 7d, 30d, 90d, year, or custom.");

    expect(() =>
      resolveDateRangeParams({ range: "7d", start: "2026-10-01" }, NOW),
    ).toThrow("Both start and end dates are required.");
  });

  it("builds previous ranges, labels, and API query parameters", () => {
    const range = createCustomDateRange("2026-10-01", "2026-10-10");

    expect(getPreviousDateRange(range)).toEqual({
      preset: "custom",
      start: "2026-09-21",
      end: "2026-09-30",
    });
    expect(formatDateRangeLabel(range)).toBe("Oct 1 – Oct 10, 2026");
    expect(toDateRangeQueryParams(range)).toEqual({
      range: "custom",
      start: "2026-10-01",
      end: "2026-10-10",
    });
  });
});
