import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AUTH_STATUS, AUTH_UNAUTHORIZED_EVENT } from "@/constants/auth";
import { getCurrentUser } from "@/features/auth/services/authService";
import { queryKeys } from "@/services/api/queryKeys";
import { useAuthStore } from "@/store/authStore";

export function AuthSessionInitializer({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.authStatus);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setAuthStatus = useAuthStore((state) => state.setAuthStatus);
  const queryClient = useQueryClient();

  const shouldRestoreSession =
    Boolean(accessToken) &&
    (authStatus === AUTH_STATUS.IDLE ||
      authStatus === AUTH_STATUS.INITIALIZING);

  const currentUserQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    enabled: shouldRestoreSession,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (authStatus !== AUTH_STATUS.IDLE) {
      return;
    }

    if (!accessToken) {
      clearAuth();
      return;
    }

    setAuthStatus(AUTH_STATUS.INITIALIZING);
  }, [authStatus, accessToken, clearAuth, setAuthStatus]);

  useEffect(() => {
    if (!shouldRestoreSession || !currentUserQuery.data) {
      return;
    }

    setAuth({ user: currentUserQuery.data, accessToken });
  }, [shouldRestoreSession, currentUserQuery.data, accessToken, setAuth]);

  useEffect(() => {
    if (!shouldRestoreSession || !currentUserQuery.isError) {
      return;
    }

    clearAuth();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
  }, [shouldRestoreSession, currentUserQuery.isError, clearAuth, queryClient]);

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [queryClient]);

  return children;
}
