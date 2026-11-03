import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "@/components/analytics/KpiCard";

function buildKpi(overrides = {}) {
  return {
    id: "revenue",
    label: "Total Revenue",
    value: 48250.75,
    format: "currency",
    change: 12.4,
    comparisonLabel: "vs previous 30 days",
    ...overrides,
  };
}

describe("KpiCard", () => {
  it("formats currency values and positive changes", () => {
    render(<KpiCard kpi={buildKpi()} />);

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("$48,251")).toBeInTheDocument();
    expect(screen.getByText("+12.4%")).toBeInTheDocument();
    expect(
      screen.getByText("Increased by 12.4 percent vs previous 30 days"),
    ).toBeInTheDocument();
  });

  it("formats numbers and negative changes", () => {
    render(
      <KpiCard
        kpi={buildKpi({
          id: "orders",
          label: "Total Orders",
          value: 1234,
          format: "number",
          change: -4.2,
        })}
      />,
    );

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("-4.2%")).toBeInTheDocument();
    expect(
      screen.getByText("Decreased by 4.2 percent vs previous 30 days"),
    ).toBeInTheDocument();
  });

  it("describes flat changes", () => {
    render(<KpiCard kpi={buildKpi({ change: 0 })} />);

    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(
      screen.getByText("Unchanged by 0.0 percent vs previous 30 days"),
    ).toBeInTheDocument();
  });
});
