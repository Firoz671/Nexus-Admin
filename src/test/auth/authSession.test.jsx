import { describe, expect, it } from "vitest";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { App } from "@/app/App";
import { queryClient } from "@/app/queryClient";
import {
  AUTH_STATUS,
  AUTH_STORAGE_KEY,
} from "@/constants/auth";
import { DEMO_ACCOUNTS } from "@/features/auth/constants/demoAccounts";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { DEMO_SESSIONS } from "@/mocks/data/users";
import { server } from "@/mocks/server";
import { useAuthStore } from "@/store/authStore";
import { signInAs } from "../helpers/auth";

function renderAppAt(path) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

function setInitialAuthState() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    authStatus: AUTH_STATUS.IDLE,
    isInitializing: true,
    isLoggingOut: false,
  });
}

async function seedPersistedToken(token) {
  setInitialAuthState();
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      state: { accessToken: token },
      version: 1,
    }),
  );

  await useAuthStore.persist.rehydrate();
}

describe("authentication session", () => {
  it("starts unauthenticated when no persisted token exists", async () => {
    setInitialAuthState();

    renderAppAt("/dashboard");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");

    await waitFor(() => {
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("restores a persisted session through the current-user endpoint", async () => {
    await seedPersistedToken(DEMO_SESSIONS.admin.accessToken);

    renderAppAt("/dashboard");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(useAuthStore.getState().user).toMatchObject({
      email: "admin@nexus.test",
      role: "admin",
    });
    expect(useAuthStore.getState().accessToken).toBe(
      DEMO_SESSIONS.admin.accessToken,
    );
  });

  it("clears an invalid persisted token and returns to login", async () => {
    await seedPersistedToken("invalid-persisted-token");

    renderAppAt("/dashboard");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBeNull();
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });

  it("updates authentication state after a successful login", async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const adminAccount = DEMO_ACCOUNTS.find(
      (account) => account.role === "admin",
    );
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate({
        email: adminAccount.email,
        password: adminAccount.password,
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toMatchObject({
      email: "admin@nexus.test",
      role: "admin",
    });
    expect(useAuthStore.getState().accessToken).toBe(
      DEMO_SESSIONS.admin.accessToken,
    );

    const persistedState = JSON.parse(
      localStorage.getItem(AUTH_STORAGE_KEY),
    );

    expect(persistedState.state.accessToken).toBe(
      DEMO_SESSIONS.admin.accessToken,
    );
    expect(persistedState.state).not.toHaveProperty("user");
    expect(persistedState.state).not.toHaveProperty("password");
  });

  it("clears authentication state and cached data after logout", async () => {
    const user = userEvent.setup();
    signInAs("admin");
    queryClient.setQueryData(["private", "preview"], { secret: true });

    renderAppAt("/dashboard");
    await screen.findByRole("heading", { level: 1, name: "Overview" });

    await user.click(
      screen.getByRole("button", {
        name: "Open user menu for Alex Morgan",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Sign Out" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(queryClient.getQueryData(["private", "preview"])).toBeUndefined();
  });

  it("does not carry the previous route into a later login", async () => {
    const user = userEvent.setup();
    signInAs("admin");

    renderAppAt("/settings");
    await screen.findByRole("heading", { level: 1, name: "Settings" });

    await user.click(
      screen.getByRole("button", {
        name: "Open user menu for Alex Morgan",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Sign Out" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Sign in to Nexus Admin",
    });

    await user.click(
      screen.getByRole("button", { name: "Use manager account" }),
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/dashboard");
  });

  it("clears the session and returns to login after a mid-session 401", async () => {
    const user = userEvent.setup();
    signInAs("admin");
    server.use(
      http.get(/\/users\/?$/, () =>
        HttpResponse.json(
          {
            success: false,
            message: "Your session has expired.",
            data: null,
          },
          { status: 401 },
        ),
      ),
    );

    renderAppAt("/dashboard");
    await screen.findByRole("heading", { level: 1, name: "Overview" });

    await user.click(screen.getByRole("link", { name: "Users" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(
      localStorage.getItem(AUTH_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).state
            .accessToken
        : null,
    ).toBeNull();
  });

  it("clears the local session even when the logout request fails", async () => {
    const user = userEvent.setup();
    signInAs("admin");
    server.use(
      http.post(/\/auth\/logout\/?$/, () =>
        HttpResponse.json(
          { success: false, message: "" },
          { status: 500 },
        ),
      ),
    );

    renderAppAt("/dashboard");
    await screen.findByRole("heading", { level: 1, name: "Overview" });

    await user.click(
      screen.getByRole("button", {
        name: "Open user menu for Alex Morgan",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Sign Out" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to Nexus Admin",
      }),
    ).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
