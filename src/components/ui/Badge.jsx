import { cn } from "@/utils/cn";

const variantClasses = {
  success: "bg-success text-success-content",
  warning: "bg-warning text-warning-content",
  danger: "bg-error text-error-content",
  info: "bg-info text-info-content",
  neutral: "bg-neutral text-neutral-content",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[0.6875rem]",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
  ...props
}) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-semibold",
        variantClasses[variant] ?? variantClasses.neutral,
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
    >
      {children}
    </span>
  );
}
