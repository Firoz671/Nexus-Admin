import { beforeEach, describe, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";
import { signInAs } from "../helpers/auth";

function renderOrdersPage() {
  window.history.replaceState({}, "", "/orders");
  return render(<App />);
}

async function getOrdersTable() {
  return screen.findByRole("table", { name: "Orders" });
}

function getOrderRow(table, orderId) {
  return within(table).getByText(orderId).closest("tr");
}

function getSummaryValue(label) {
  return within(screen.getByText(label, { selector: "p" }).parentElement);
}

describe("OrdersPage", () => {
  beforeEach(() => {
    signInAs("manager");
  });

  it("renders order metrics and the paginated order directory", async () => {
    renderOrdersPage();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Orders" }),
    ).toBeInTheDocument();

    const table = await getOrdersTable();

    expect(getSummaryValue("Total orders").getByText("30")).toBeInTheDocument();
    expect(getSummaryValue("Pending").getByText("4")).toBeInTheDocument();
    expect(getSummaryValue("In progress").getByText("10")).toBeInTheDocument();
    expect(getSummaryValue("Completed").getByText("12")).toBeInTheDocument();
    expect(getSummaryValue("Cancelled").getByText("4")).toBeInTheDocument();

    expect(within(table).getByText("ORD-1001")).toBeInTheDocument();
    expect(within(table).getByText("ORD-1010")).toBeInTheDocument();
    expect(
      within(table).queryByText("ORD-1011"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("paginates the directory and sorts by order total", async () => {
    const user = userEvent.setup();

    renderOrdersPage();
    const table = await getOrdersTable();

    expect(screen.getByText(/showing/i)).toHaveTextContent(
      "Showing 1–10 of 30 orders",
    );

    await user.click(screen.getByRole("button", { name: "Go to page 2" }));

    await waitFor(() => {
      expect(within(table).getByText("ORD-1011")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(/showing/i)).toHaveTextContent(
      "Showing 11–20 of 30 orders",
    );

    const getTotals = () =>
      within(table)
        .getAllByRole("row")
        .slice(1)
        .map((row) =>
          Number(
            within(row)
              .getAllByRole("cell")[4]
              .textContent.replace(/[^0-9.-]/g, ""),
          ),
        );

    await user.click(
      within(table).getByRole("button", { name: "Sort by Total" }),
    );

    await waitFor(() => {
      const totals = getTotals();

      expect(totals).toHaveLength(10);
      expect(totals).toEqual([...totals].sort((left, right) => right - left));
    });
    expect(
      within(table).getByRole("columnheader", { name: /total/i }),
    ).toHaveAttribute("aria-sort", "descending");

    await user.click(
      within(table).getByRole("button", { name: "Sort by Total" }),
    );

    await waitFor(() => {
      const totals = getTotals();

      expect(totals).toEqual([...totals].sort((left, right) => left - right));
    });
  });

  it("filters by search, order status, payment status, and validates dates", async () => {
    const user = userEvent.setup();

    renderOrdersPage();
    const table = await getOrdersTable();

    const search = screen.getByRole("searchbox", { name: "Search orders" });

    await user.type(search, "ORD-1003");

    await waitFor(() => {
      expect(screen.getByText(/1 matching order$/i)).toBeInTheDocument();
    });
    expect(within(table).getByText("ORD-1003")).toBeInTheDocument();
    expect(within(table).queryByText("ORD-1001")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Order status" }),
      "pending",
    );

    await waitFor(() => {
      expect(screen.getByText(/4 matching orders$/i)).toBeInTheDocument();
    });
    expect(within(table).getByText("ORD-1003")).toBeInTheDocument();
    expect(within(table).getByText("ORD-1009")).toBeInTheDocument();
    expect(within(table).queryByText("ORD-1001")).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Order status" }),
      "all",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Payment" }),
      "refunded",
    );

    await waitFor(() => {
      expect(screen.getByText(/5 matching orders$/i)).toBeInTheDocument();
    });
    expect(within(table).getByText("ORD-1005")).toBeInTheDocument();
    expect(within(table).getByText("ORD-1010")).toBeInTheDocument();
    expect(within(table).queryByText("ORD-1001")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "2026-03-01" },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Start date must be on or before the end date.",
    );

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(
      screen.queryByText("Start date must be on or before the end date."),
    ).not.toBeInTheDocument();
  });

  it("shows order details and advances fulfillment status with confirmation", async () => {
    const user = userEvent.setup();

    renderOrdersPage();
    const table = await getOrdersTable();

    await user.click(
      within(table).getByRole("button", { name: "Actions for ORD-1003" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "View order" }));

    const details = await screen.findByRole("dialog", {
      name: "Order details",
    });

    expect(within(details).getByText("ORD-1003")).toBeInTheDocument();
    expect(
      within(details).getAllByText("Sofia Alvarez"),
    ).toHaveLength(2);
    expect(
      within(details).getByText("sofia.alvarez@example.com"),
    ).toBeInTheDocument();
    expect(within(details).getByText("Data Export Kit")).toBeInTheDocument();
    expect(
      within(details).getByText("Automation Templates"),
    ).toBeInTheDocument();
    expect(within(details).getByText("1222 Market Street")).toBeInTheDocument();
    expect(
      within(details).getByRole("button", { name: "Mark as processing" }),
    ).toBeInTheDocument();

    await user.click(
      within(details).getByRole("button", { name: "Mark as processing" }),
    );

    const confirmation = await screen.findByRole("dialog", {
      name: "Start processing ORD-1003?",
    });

    await user.click(
      within(confirmation).getByRole("button", {
        name: "Start processing",
      }),
    );

    await waitFor(() => {
      const row = getOrderRow(table, "ORD-1003");

      expect(within(row).getByText("Processing")).toBeInTheDocument();
    });
    expect(
      screen.getByText("ORD-1003 was marked as processing."),
    ).toBeInTheDocument();
  });

  it("cancels orders and exposes no fulfillment actions for terminal orders", async () => {
    const user = userEvent.setup();

    renderOrdersPage();
    const table = await getOrdersTable();

    await user.click(
      within(table).getByRole("button", { name: "Actions for ORD-1001" }),
    );

    expect(
      screen.getByRole("menuitem", { name: "View order" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Cancel order" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Mark as processing" }),
    ).not.toBeInTheDocument();

    await user.keyboard("{Escape}");

    await user.click(
      within(table).getByRole("button", { name: "Actions for ORD-1009" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Cancel order" }));

    const confirmation = await screen.findByRole("dialog", {
      name: "Cancel ORD-1009?",
    });

    await user.click(
      within(confirmation).getByRole("button", { name: "Cancel order" }),
    );

    await waitFor(() => {
      const row = getOrderRow(table, "ORD-1009");

      expect(within(row).getByText("Cancelled")).toBeInTheDocument();
    });
    expect(screen.getByText("ORD-1009 was cancelled.")).toBeInTheDocument();
  });
});
