import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";
import { THEMES } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";

function renderAppAt(path) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

async function renderDashboard() {
  const view = renderAppAt("/dashboard");

  await screen.findByRole("heading", { level: 1, name: "Overview" });

  return view;
}

function getSidebar() {
  return screen.getByRole("complementary", { name: "Sidebar" });
}

describe("DashboardLayout", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: THEMES.LIGHT });
    document.documentElement.setAttribute("data-theme", THEMES.LIGHT);
  });

  it("renders the shell, sidebar navigation, and breadcrumb state", async () => {
    await renderDashboard();

    const sidebar = getSidebar();

    expect(
      within(sidebar).getByRole("link", { name: "Overview" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(sidebar).getByRole("link", { name: "Users" }),
    ).toBeInTheDocument();
    expect(
      within(sidebar).getByRole("link", { name: "Settings" }),
    ).toBeInTheDocument();

    const breadcrumbs = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    expect(within(breadcrumbs).getByText("Overview")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", {
        name: "Switch workspace: Nexus Technologies",
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("contentinfo")).getByRole("link", {
        name: "Open design system",
      }),
    ).toHaveAttribute("href", "/design-system");
  });

  it("navigates with sidebar links and updates active state", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    const sidebar = getSidebar();

    await user.click(within(sidebar).getByRole("link", { name: "Users" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Users" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/users");
    expect(
      within(sidebar).getByRole("link", { name: "Users" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(sidebar).getByRole("link", { name: "Overview" }),
    ).not.toHaveAttribute("aria-current");

    const breadcrumbs = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    expect(within(breadcrumbs).getByText("Users")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("navigates back to the overview from breadcrumbs", async () => {
    const user = userEvent.setup();

    renderAppAt("/users");
    await screen.findByRole("heading", { level: 1, name: "Users" });

    const breadcrumbs = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    await user.click(
      within(breadcrumbs).getByRole("link", { name: "Dashboard" }),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");
  });

  it("collapses and expands the desktop sidebar", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    expect(screen.getByText("Administration console")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Collapse sidebar" }),
    );

    expect(
      screen.getByRole("button", { name: "Expand sidebar" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Administration console"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));

    expect(
      screen.getByRole("button", { name: "Collapse sidebar" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Administration console")).toBeInTheDocument();
  });

  it("switches workspaces from the workspace menu", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(
      screen.getByRole("button", {
        name: "Switch workspace: Nexus Technologies",
      }),
    );

    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(
      screen.getByRole("menuitem", { name: "Creative Studio" }),
    );

    expect(
      screen.getByRole("button", {
        name: "Switch workspace: Creative Studio",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports keyboard workspace selection", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    const trigger = screen.getByRole("button", {
      name: "Switch workspace: Nexus Technologies",
    });

    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");

    expect(
      screen.getByRole("button", {
        name: "Switch workspace: Creative Studio",
      }),
    ).toBeInTheDocument();
  });

  it("opens and closes the profile menu with Escape", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    const trigger = screen.getByRole("button", {
      name: "Open user menu for Alex Morgan",
    });

    await user.click(trigger);

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "My Profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Account Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Help Center" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Sign Out" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("navigates to settings from the profile menu", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(
      screen.getByRole("button", {
        name: "Open user menu for Alex Morgan",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", { name: "Account Settings" }),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Settings" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/settings");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens and closes the notification preview with Escape", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    const trigger = screen.getByRole("button", {
      name: "Notifications, sample preview",
    });

    await user.click(trigger);

    const panel = screen.getByRole("dialog", {
      name: "Sample notifications",
    });

    expect(
      within(panel).getByText("Sample content for layout demonstration."),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText("Application shell preview"),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Sample notifications" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps the Phase 1 theme toggle working inside the topbar", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );

    expect(useThemeStore.getState().theme).toBe(THEMES.DARK);
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      THEMES.DARK,
    );
    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });

  it("opens the mobile drawer and closes it with Escape", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    const openButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    await user.click(openButton);

    const drawer = screen.getByRole("dialog", { name: "Navigation menu" });

    expect(drawer).toBeInTheDocument();
    expect(
      within(drawer).getByRole("button", {
        name: "Close navigation menu",
      }),
    ).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(openButton).toHaveFocus();
  });

  it("closes the mobile drawer after selecting a navigation item", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const drawer = screen.getByRole("dialog", { name: "Navigation menu" });

    await user.click(
      within(drawer).getByRole("link", { name: "Products" }),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Products" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/products");
    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile drawer with its close button", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const drawer = screen.getByRole("dialog", { name: "Navigation menu" });

    await user.click(
      within(drawer).getByRole("button", {
        name: "Close navigation menu",
      }),
    );

    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile drawer when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeInTheDocument();

    const backdrop = document.querySelector(
      '[aria-hidden="true"].nexus-overlay-enter',
    );

    fireEvent.mouseDown(backdrop);

    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders a not-found page for unknown routes", async () => {
    const user = userEvent.setup();

    renderAppAt("/this-route-does-not-exist");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Page not found",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", { name: "Back to overview" }),
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");
  });
});
