import { AUTH_STATUS } from "@/constants/auth";
import { DEMO_SESSIONS } from "@/mocks/data/users";
import { useAuthStore } from "@/store/authStore";

export function signInAs(role = "admin") {
  const session = DEMO_SESSIONS[role];

  if (!session) {
    throw new Error(`Unknown demo role: ${role}`);
  }

  useAuthStore.setState({
    user: session.user,
    accessToken: session.accessToken,
    isAuthenticated: true,
    authStatus: AUTH_STATUS.AUTHENTICATED,
    isInitializing: false,
    isLoggingOut: false,
  });

  return session;
}

export function resetAuthState() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    authStatus: AUTH_STATUS.UNAUTHENTICATED,
    isInitializing: false,
    isLoggingOut: false,
  });
}
