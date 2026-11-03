import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LOGIN_PATH } from "@/constants/auth";
import { ROLES } from "@/constants/permissions";
import { login, logout } from "@/features/auth/services/authService";
import { queryKeys } from "@/services/api/queryKeys";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authStatus = useAuthStore((state) => state.authStatus);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated,
    authStatus,
    isInitializing,
    isLoggingOut,
    isAdmin: user?.role === ROLES.ADMIN,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      useAuthStore.getState().setAuth(session);
      queryClient.setQueryData(queryKeys.auth.me, session.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSettled: (_data, error) => {
      useAuthStore.getState().startLogout();
      useAuthStore.getState().clearAuth();
      useAuthStore.persist.clearStorage();
      queryClient.clear();

      if (error) {
        toast.error(
          "Your local session was cleared, but the logout request failed.",
        );
      } else {
        toast.success("You have been signed out.");
      }

      navigate(LOGIN_PATH, { replace: true, state: null });
    },
  });
}
