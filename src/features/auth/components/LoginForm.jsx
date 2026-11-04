import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROLE_LABELS } from "@/constants/permissions";
import { DEMO_ACCOUNTS } from "@/features/auth/constants/demoAccounts";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import { getSafeRedirectPath } from "@/features/auth/utils/redirect";

const demoRoleVariants = {
  admin: "info",
  manager: "neutral",
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const isBusy = loginMutation.isPending || isSubmitting;

  const onSubmit = (values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate(getSafeRedirectPath(location.state?.from), {
          replace: true,
        });
      },
    });
  };

  const fillDemoAccount = (account) => {
    loginMutation.reset();
    setValue("email", account.email, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("password", account.password, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="rounded-card border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <form
        id="login-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        tabIndex={-1}
        className="space-y-4"
        aria-label="Sign in"
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@nexus.test"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          leadingIcon={<Mail />}
          error={errors.email?.message}
          disabled={isBusy}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          leadingIcon={<LockKeyhole />}
          error={errors.password?.message}
          disabled={isBusy}
          trailingAction={
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}
              className="flex size-7 items-center justify-center rounded-control text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-offset-2"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          }
          {...register("password")}
        />

        {loginMutation.isError ? (
          <div
            role="alert"
            className="flex gap-2.5 rounded-control border border-error/30 bg-error/10 px-3 py-2.5 text-sm text-error"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <p>{loginMutation.error.message}</p>
          </div>
        ) : null}

        <Button
          type="submit"
          fullWidth
          loading={isBusy}
          disabled={isBusy}
          rightIcon={!isBusy ? <ArrowRight /> : null}
        >
          {isBusy ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 rounded-card border border-base-300 bg-base-200/60 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-base-content">
              Demo accounts
            </p>
            <p className="mt-0.5 text-xs leading-5 text-base-content/60">
              Fill either account, then submit the form to sign in.
            </p>
          </div>
          <Badge variant="warning" size="sm" className="shrink-0">
            Mock only
          </Badge>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="flex flex-col rounded-control border border-base-300 bg-base-100 p-3"
            >
              <Badge
                variant={demoRoleVariants[account.role] ?? "neutral"}
                size="sm"
                className="w-fit"
              >
                {ROLE_LABELS[account.role] ?? account.role}
              </Badge>
              <p className="mt-2 truncate text-xs font-medium text-base-content">
                {account.email}
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-base-content/60">
                {account.password}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                className="mt-3"
                disabled={isBusy}
                onClick={() => fillDemoAccount(account)}
              >
                Use {ROLE_LABELS[account.role]?.toLowerCase() ?? account.role}{" "}
                account
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
