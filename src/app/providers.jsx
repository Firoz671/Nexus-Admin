import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthSessionInitializer } from "@/features/auth/components/AuthSessionInitializer";
import { queryClient } from "./queryClient";

const toastOptions = {
  duration: 3500,
  style: {
    background: "var(--color-base-100)",
    color: "var(--color-base-content)",
    border: "1px solid var(--color-base-300)",
    borderRadius: "var(--radius-box)",
    boxShadow: "0 12px 32px -12px rgb(15 23 42 / 0.28)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  success: {
    iconTheme: {
      primary: "var(--color-success)",
      secondary: "var(--color-success-content)",
    },
  },
  error: {
    iconTheme: {
      primary: "var(--color-error)",
      secondary: "var(--color-error-content)",
    },
  },
  loading: {
    iconTheme: {
      primary: "var(--color-primary)",
      secondary: "var(--color-primary-content)",
    },
  },
};

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthSessionInitializer>{children}</AuthSessionInitializer>
        <Toaster position="top-right" gutter={10} toastOptions={toastOptions} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
