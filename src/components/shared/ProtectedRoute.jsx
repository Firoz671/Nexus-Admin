import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "@/constants/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RouteLoadingScreen } from "./RouteLoadingScreen";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing, isLoggingOut } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <RouteLoadingScreen
        label="Checking your session"
        description="Restoring your workspace access."
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={LOGIN_PATH}
        replace
        state={isLoggingOut ? null : { from: location }}
      />
    );
  }

  return <Outlet />;
}
