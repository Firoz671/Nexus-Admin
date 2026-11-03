import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { App } from "@/app/App";
import { server } from "@/mocks/server";
import { DEMO_SESSIONS } from "@/mocks/data/users";
import { useAuthStore } from "@/store/authStore";

function renderLogin() {
  window.history.replaceState({}, "", "/login");
  return render(<App />);
}

async function fillAdministratorAccount(user) {
  await user.click(
    screen.getByRole("button", { name: "Use administrator account" }),
  );
}

describe("login page", () => {
  it("renders the form and demo credentials", async () => {
    renderLogin();

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByText("admin@nexus.test")).toBeInTheDocument();
    expect(screen.getByText("Admin123!")).toBeInTheDocument();
    expect(screen.getByText("manager@nexus.test")).toBeInTheDocument();
    expect(screen.getByText("Manager123!")).toBeInTheDocument();
  });

  it("shows validation messages for empty fields", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByLabelText(/Password/);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Hide password" }));

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("fills the form from the demo credential buttons", async () => {
    const user = userEvent.setup();
    renderLogin();

    await fillAdministratorAccount(user);

    expect(screen.getByLabelText(/Email/)).toHaveValue("admin@nexus.test");
    expect(screen.getByLabelText(/Password/)).toHaveValue("Admin123!");

    await user.click(
      screen.getByRole("button", { name: "Use manager account" }),
    );

    expect(screen.getByLabelText(/Email/)).toHaveValue("manager@nexus.test");
    expect(screen.getByLabelText(/Password/)).toHaveValue("Manager123!");
  });

  it("shows a loading state while the login request is pending", async () => {
    const user = userEvent.setup();

    server.use(
      http.post(/\/auth\/login\/?$/, async () => {
        await delay(150);

        return HttpResponse.json({
          success: true,
          message: "Login successful",
          data: DEMO_SESSIONS.admin,
        });
      }),
    );

    renderLogin();
    await fillAdministratorAccount(user);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Signing in...",
    });

    expect(pendingButton).toHaveAttribute("aria-busy", "true");
    expect(pendingButton).toBeDisabled();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
  });

  it("redirects after a successful login", async () => {
    const user = userEvent.setup();
    renderLogin();

    await fillAdministratorAccount(user);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");
    expect(useAuthStore.getState().user).toMatchObject({
      email: "admin@nexus.test",
      role: "admin",
    });
  });

  it("displays an error for invalid credentials and keeps the input", async () => {
    const user = userEvent.setup();
    renderLogin();

    await fillAdministratorAccount(user);

    const passwordInput = screen.getByLabelText(/Password/);

    await user.clear(passwordInput);
    await user.type(passwordInput, "WrongPassword1!");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Invalid email or password."),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
    expect(screen.getByLabelText(/Email/)).toHaveValue("admin@nexus.test");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
