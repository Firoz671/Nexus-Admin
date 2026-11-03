import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_STATUS, AUTH_STORAGE_KEY } from "@/constants/auth";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authStatus: AUTH_STATUS.IDLE,
  isInitializing: true,
  isLoggingOut: false,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      setAuth: ({ user, accessToken }) => {
        if (!user || !accessToken) {
          return;
        }

        set({
          user,
          accessToken,
          isAuthenticated: true,
          authStatus: AUTH_STATUS.AUTHENTICATED,
          isInitializing: false,
          isLoggingOut: false,
        });
      },

      clearAuth: () => {
        set((state) => ({
          ...initialState,
          authStatus: AUTH_STATUS.UNAUTHENTICATED,
          isInitializing: false,
          isLoggingOut: state.isLoggingOut,
        }));
      },

      setAuthStatus: (authStatus) => {
        set({
          authStatus,
          isInitializing:
            authStatus === AUTH_STATUS.IDLE ||
            authStatus === AUTH_STATUS.INITIALIZING,
        });
      },

      startLogout: () => {
        set({ isLoggingOut: true });
      },

      finishLogout: () => {
        set({ isLoggingOut: false });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      version: 1,
      merge: (persistedState, currentState) => ({
        ...currentState,
        accessToken:
          typeof persistedState?.accessToken === "string"
            ? persistedState.accessToken
            : null,
      }),
    },
  ),
);
