import { cn } from "@/utils/cn";

const sizeClasses = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

export function Loader({
  size = "md",
  label = "Loading",
  className,
  ...props
}) {
  return (
    <span
      {...props}
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        className={cn(
          "loading loading-spinner text-primary",
          sizeClasses[size] ?? sizeClasses.md,
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
