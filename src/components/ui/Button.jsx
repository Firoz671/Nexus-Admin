import { cn } from "@/utils/cn";

const variantClasses = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-error",
};

const sizeClasses = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

const spinnerClasses = {
  sm: "loading-xs",
  md: "loading-sm",
  lg: "loading-md",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  leftIcon = null,
  rightIcon = null,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "btn",
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        fullWidth && "btn-block",
        iconOnly && "btn-square",
        className,
      )}
    >
      {loading ? (
        <span
          className={cn(
            "loading loading-spinner",
            spinnerClasses[size] ?? spinnerClasses.md,
          )}
          aria-hidden="true"
        />
      ) : leftIcon ? (
        <span className="[&_svg]:size-4" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children ? <span>{children}</span> : null}
      {rightIcon && !loading ? (
        <span className="[&_svg]:size-4" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
}
