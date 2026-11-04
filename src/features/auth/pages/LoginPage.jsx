import { useEffect } from "react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";

export function LoginPage() {
  useEffect(() => {
    useAuthStore.getState().finishLogout();
  }, []);

  return (
    <AuthLayout>
      <div className="mb-7">
        <Badge variant="neutral" size="sm">
          Demo workspace access
        </Badge>
        <h1 className="mt-3 text-heading-1 font-semibold text-base-content">
          Sign in to Nexus Admin
        </h1>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          Enter your workspace credentials to continue to the administration
          console.
        </p>
      </div>

      <LoginForm />

      <p className="mt-7 text-center text-xs leading-5 text-base-content/60 lg:hidden">
        Demo environment. Credentials are public and authentication is
        simulated by MSW.
      </p>
    </AuthLayout>
  );
}
