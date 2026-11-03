import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { createDateRange, getRangeDayCount } from "@/utils/dateRange";

function renderFilter(overrides = {}) {
  const value = overrides.value ?? createDateRange("30d");
  const onChange = overrides.onChange ?? vi.fn();

  render(<DateRangeFilter value={value} onChange={onChange} />);

  return { onChange, value };
}

describe("DateRangeFilter", () => {
  it("shows the active preset and selects another preset", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilter();

    expect(
      screen.getByRole("button", { name: "Last 30 days" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Last 7 days" }),
    ).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("button", { name: "Last 7 days" }));

    expect(onChange).toHaveBeenCalledTimes(1);

    const nextRange = onChange.mock.calls[0][0];

    expect(nextRange.preset).toBe("7d");
    expect(getRangeDayCount(nextRange)).toBe(7);
  });

  it("applies a valid custom date range", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilter();

    await user.click(
      screen.getByRole("button", { name: "Custom date range" }),
    );

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-01-10" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-01-20" },
    });

    await user.click(screen.getByRole("button", { name: "Apply range" }));

    expect(onChange).toHaveBeenCalledWith({
      preset: "custom",
      start: "2026-01-10",
      end: "2026-01-20",
    });
    expect(
      screen.queryByRole("group", { name: "Custom date range" }),
    ).not.toBeInTheDocument();
  });

  it("validates an inverted custom date range", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilter();

    await user.click(
      screen.getByRole("button", { name: "Custom date range" }),
    );

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-02-10" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-02-01" },
    });

    await user.click(screen.getByRole("button", { name: "Apply range" }));

    expect(
      screen.getByText("The start date must be on or before the end date."),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes the custom panel with Escape and restores focus", async () => {
    const user = userEvent.setup();

    renderFilter();

    const trigger = screen.getByRole("button", {
      name: "Custom date range",
    });

    await user.click(trigger);

    expect(
      screen.getByRole("group", { name: "Custom date range" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("group", { name: "Custom date range" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
