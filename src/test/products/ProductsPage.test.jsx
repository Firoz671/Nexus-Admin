import { beforeEach, describe, expect, it } from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";
import { signInAs } from "../helpers/auth";

function renderProductsPage() {
  window.history.replaceState({}, "", "/products");
  return render(<App />);
}

async function getProductsTable() {
  return screen.findByRole("table", { name: "Products" });
}

async function searchProducts(user, value) {
  const search = screen.getByRole("searchbox", { name: "Search products" });

  await user.clear(search);
  await user.type(search, value);
}

function getSummaryValue(label) {
  return within(screen.getByText(label, { selector: "p" }).parentElement);
}

describe("ProductsPage", () => {
  beforeEach(() => {
    signInAs("manager");
  });

  it("renders catalog metrics, pagination, and low-stock indicators", async () => {
    renderProductsPage();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Products" }),
    ).toBeInTheDocument();

    const table = await getProductsTable();

    expect(
      getSummaryValue("Total products").getByText("24"),
    ).toBeInTheDocument();
    expect(
      getSummaryValue("Active products").getByText("17"),
    ).toBeInTheDocument();
    expect(
      getSummaryValue("Draft / inactive").getByText("7"),
    ).toBeInTheDocument();
    expect(getSummaryValue("Low stock").getByText("9")).toBeInTheDocument();

    expect(within(table).getByText("Fleet Monitoring")).toBeInTheDocument();
    expect(within(table).getByText("Webhook Relay")).toBeInTheDocument();
    expect(
      within(table).queryByText("Nexus Analytics Suite"),
    ).not.toBeInTheDocument();
    expect(within(table).getAllByText("Low stock").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("filters catalog results and sorts by price", async () => {
    const user = userEvent.setup();

    renderProductsPage();
    const table = await getProductsTable();

    await searchProducts(user, "webhook");

    await waitFor(() => {
      expect(screen.getByText(/1 matching product$/i)).toBeInTheDocument();
    });
    expect(within(table).getByText("Webhook Relay")).toBeInTheDocument();
    expect(
      within(table).queryByText("Fleet Monitoring"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() => {
      expect(within(table).getByText("Fleet Monitoring")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Category" }),
      "Security",
    );

    await waitFor(() => {
      expect(
        within(table).getByText("Incident Response Pack"),
      ).toBeInTheDocument();
    });
    expect(within(table).queryByText("Fleet Monitoring")).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Status" }),
      "draft",
    );

    await waitFor(() => {
      expect(
        within(table).getByText("Incident Response Pack"),
      ).toBeInTheDocument();
    });
    expect(
      within(table).queryByText("Audit Log Add-on"),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/1 matching product$/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Stock level" }),
      "low_stock",
    );

    await waitFor(() => {
      expect(
        within(table).getByText("Workflow Automations"),
      ).toBeInTheDocument();
    });
    expect(
      within(table).queryByText("Nexus Analytics Suite"),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/7 matching products$/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.click(
      within(table).getByRole("button", { name: "Sort by Price" }),
    );
    await user.click(
      within(table).getByRole("button", { name: "Sort by Price" }),
    );

    await waitFor(() => {
      const firstRow = within(table).getAllByRole("row")[1];

      expect(within(firstRow).getByText("Automation Templates")).toBeInTheDocument();
    });
  });

  it("validates product creation, creates a product, and reports duplicate SKUs", async () => {
    const user = userEvent.setup();

    renderProductsPage();
    const table = await getProductsTable();

    await user.click(screen.getByRole("button", { name: "Add product" }));

    let dialog = await screen.findByRole("dialog", {
      name: "Create product",
    });

    await user.click(
      within(dialog).getByRole("button", { name: "Create product" }),
    );

    expect(
      await within(dialog).findByText(
        "Product name must be at least 2 characters.",
      ),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("SKU is required.")).toBeInTheDocument();
    expect(within(dialog).getByText("Enter a valid price.")).toBeInTheDocument();
    expect(
      within(dialog).getByText("Enter a valid stock quantity."),
    ).toBeInTheDocument();

    await user.type(
      within(dialog).getByLabelText(/product name/i),
      "Test Product",
    );
    await user.type(within(dialog).getByLabelText(/^sku/i), "nx-test-001");
    await user.type(within(dialog).getByLabelText(/price/i), "49.99");
    await user.type(within(dialog).getByLabelText(/stock quantity/i), "5");
    await user.type(
      within(dialog).getByLabelText(/description/i),
      "A test product for the catalog.",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Create product" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Create product" }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(within(table).getByText("Test Product")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Product created successfully."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add product" }));
    dialog = await screen.findByRole("dialog", { name: "Create product" });

    await user.type(
      within(dialog).getByLabelText(/product name/i),
      "Duplicate SKU Product",
    );
    await user.type(within(dialog).getByLabelText(/^sku/i), "NX-ANL-001");
    await user.type(within(dialog).getByLabelText(/price/i), "10");
    await user.type(within(dialog).getByLabelText(/stock quantity/i), "1");
    await user.click(
      within(dialog).getByRole("button", { name: "Create product" }),
    );

    expect(
      await within(dialog).findByText(
        "A product with this SKU already exists.",
      ),
    ).toBeInTheDocument();
  });

  it("edits product pricing and inventory details", async () => {
    const user = userEvent.setup();

    renderProductsPage();
    const table = await getProductsTable();

    await searchProducts(user, "fleet monitoring");

    await waitFor(() => {
      expect(within(table).getByText("Fleet Monitoring")).toBeInTheDocument();
    });

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Fleet Monitoring",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Edit product" }));

    const dialog = await screen.findByRole("dialog", { name: "Edit product" });
    const priceInput = within(dialog).getByLabelText(/price/i);
    const stockInput = within(dialog).getByLabelText(/stock quantity/i);

    await user.clear(priceInput);
    await user.type(priceInput, "199.50");
    await user.clear(stockInput);
    await user.type(stockInput, "3");
    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Edit product" }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      const row = within(table).getByText("Fleet Monitoring").closest("tr");

      expect(within(row).getByText("$199.50")).toBeInTheDocument();
      expect(within(row).getByText("Low stock")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Product updated successfully."),
    ).toBeInTheDocument();
  });

  it("shows product details and supports status and deletion workflows", async () => {
    const user = userEvent.setup();

    renderProductsPage();
    const table = await getProductsTable();

    await searchProducts(user, "fleet monitoring");

    await waitFor(() => {
      expect(within(table).getByText("Fleet Monitoring")).toBeInTheDocument();
    });

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Fleet Monitoring",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "View details" }));

    const details = await screen.findByRole("dialog", {
      name: "Product details",
    });

    expect(within(details).getByText("Fleet Monitoring")).toBeInTheDocument();
    expect(
      within(details).getByText(
        "Operational telemetry and health monitoring for distributed fleets.",
      ),
    ).toBeInTheDocument();
    expect(within(details).getByText("$179.00")).toBeInTheDocument();

    await user.click(
      within(details).getByRole("button", { name: "Close" }),
    );

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Fleet Monitoring",
      }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: "Deactivate product" }),
    );

    const deactivateDialog = await screen.findByRole("dialog", {
      name: "Deactivate Fleet Monitoring?",
    });

    await user.click(
      within(deactivateDialog).getByRole("button", {
        name: "Deactivate product",
      }),
    );

    await waitFor(() => {
      const row = within(table).getByText("Fleet Monitoring").closest("tr");

      expect(within(row).getByText("Inactive")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Fleet Monitoring was deactivated."),
    ).toBeInTheDocument();

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Fleet Monitoring",
      }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: "Delete product" }),
    );

    const deleteDialog = await screen.findByRole("dialog", {
      name: "Delete Fleet Monitoring?",
    });

    await user.click(
      within(deleteDialog).getByRole("button", { name: "Delete product" }),
    );

    await waitFor(() => {
      expect(screen.queryByText("Fleet Monitoring")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Fleet Monitoring was deleted."),
    ).toBeInTheDocument();
  });
});
