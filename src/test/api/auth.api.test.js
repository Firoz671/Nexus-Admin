import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { DEMO_ACCOUNTS } from "@/features/auth/constants/demoAccounts";
import {
  getCurrentUser,
  login,
  logout,
} from "@/features/auth/services/authService";
import { DEMO_SESSIONS } from "@/mocks/data/users";
import { server } from "@/mocks/server";
import { useAuthStore } from "@/store/authStore";

const adminAccount = DEMO_ACCOUNTS.find(
  (account) => account.role === "admin",
);

describe("mock authentication API", () => {
  it("logs in with the administrator demo account", async () => {
    const session = await login({
      email: adminAccount.email,
      password: adminAccount.password,
    });

    expect(session.accessToken).toBe(DEMO_SESSIONS.admin.accessToken);
    expect(session.user).toMatchObject({
      id: "user-001",
      name: "Alex Morgan",
      email: "admin@nexus.test",
      role: "admin",
      avatar: null,
    });
    expect(session.user).not.toHaveProperty("password");
  });

  it("logs in with the manager demo account", async () => {
    const managerAccount = DEMO_ACCOUNTS.find(
      (account) => account.role === "manager",
    );

    const session = await login({
      email: managerAccount.email,
      password: managerAccount.password,
    });

    expect(session.accessToken).toBe(DEMO_SESSIONS.manager.accessToken);
    expect(session.user.role).toBe("manager");
  });

  it("rejects invalid credentials with a useful message", async () => {
    await expect(
      login({
        email: adminAccount.email,
        password: "WrongPassword1!",
      }),
    ).rejects.toThrow("Invalid email or password.");
  });

  it("rejects missing credentials", async () => {
    await expect(
      login({
        email: "",
        password: "",
      }),
    ).rejects.toThrow("Email and password are required.");
  });

  it("returns the current user for a valid token", async () => {
    useAuthStore.setState({
      accessToken: DEMO_SESSIONS.admin.accessToken,
    });

    await expect(getCurrentUser()).resolves.toMatchObject({
      email: "admin@nexus.test",
      role: "admin",
    });
  });

  it("rejects the current user request for an invalid token", async () => {
    useAuthStore.setState({
      accessToken: "invalid-mock-token",
    });

    await expect(getCurrentUser()).rejects.toThrow(
      "Your session is invalid or has expired. Please sign in again.",
    );
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("returns a successful logout response", async () => {
    useAuthStore.setState({
      accessToken: DEMO_SESSIONS.admin.accessToken,
    });

    await expect(logout()).resolves.toBeUndefined();
  });

  it("maps a server failure to a user-friendly message", async () => {
    server.use(
      http.post(/\/auth\/login\/?$/, () =>
        HttpResponse.json(
          { success: false, message: "" },
          { status: 500 },
        ),
      ),
    );

    await expect(
      login({
        email: adminAccount.email,
        password: adminAccount.password,
      }),
    ).rejects.toThrow(
      "The server could not complete the request. Please try again.",
    );
  });

  it("maps a network failure to a user-friendly message", async () => {
    server.use(
      http.post(/\/auth\/login\/?$/, () => HttpResponse.error()),
    );

    await expect(
      login({
        email: adminAccount.email,
        password: adminAccount.password,
      }),
    ).rejects.toThrow(
      "Unable to reach the server. Check your connection and try again.",
    );
  });
});
