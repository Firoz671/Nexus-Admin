import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";
import { signInAs } from "../helpers/auth";

function renderAppAt(path) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

describe("authentication routing", () => {
  it("redirects unauthenticated users from protected routes to login", async () => {
    renderAppAt("/users");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });

  it("allows authenticated users to access the dashboard", async () => {
    signInAs("admin");

    renderAppAt("/dashboard");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");
  });

  it("preserves the originally requested route after login", async () => {
    const user = userEvent.setup();

    renderAppAt("/orders");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sign in to Nexus Admin",
    });

    await user.click(
      screen.getByRole("button", { name: "Use administrator account" }),
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Orders" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/orders");
  });

  it("redirects authenticated users away from the login page", async () => {
    signInAs("admin");

    renderAppAt("/login");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");
  });

  it("prevents managers from accessing settings", async () => {
    signInAs("manager");

    renderAppAt("/settings");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Access denied" }),
    ).toBeInTheDocument();
    expect(screen.getByText("403 · Forbidden")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: "Settings" }),
    ).not.toBeInTheDocument();

    const sidebar = screen.getByRole("complementary", { name: "Sidebar" });

    expect(
      within(sidebar).queryByRole("link", { name: "Settings" }),
    ).not.toBeInTheDocument();
    expect(
      within(sidebar).getByRole("link", { name: "Users" }),
    ).toBeInTheDocument();

    const breadcrumbs = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    expect(within(breadcrumbs).getByText("Access denied")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("allows administrators to access settings", async () => {
    signInAs("admin");

    renderAppAt("/settings");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Settings" }),
    ).toBeInTheDocument();

    const sidebar = screen.getByRole("complementary", { name: "Sidebar" });

    expect(
      within(sidebar).getByRole("link", { name: "Settings" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("keeps the design system showcase public", async () => {
    renderAppAt("/design-system");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Nexus Admin design system",
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/design-system");
  });
});
