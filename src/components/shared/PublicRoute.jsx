import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getSafeRedirectPath } from "@/features/auth/utils/redirect";
import { RouteLoadingScreen } from "./RouteLoadingScreen";

export function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <RouteLoadingScreen
        label="Checking your session"
        description="Restoring your workspace access."
      />
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={getSafeRedirectPath(location.state?.from)}
        replace
      />
    );
  }

  return (
    <Suspense
      fallback={
        <RouteLoadingScreen
          label="Loading sign in"
          description="Preparing secure workspace access."
        />
      }
    >
      <Outlet />
    </Suspense>
  );
}
