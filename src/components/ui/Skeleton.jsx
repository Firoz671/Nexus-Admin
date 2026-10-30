import { cn } from "@/utils/cn";

const variantClasses = {
  text: "h-4 w-full rounded-control",
  circle: "size-10 rounded-full",
  rect: "h-24 w-full rounded-card",
};

export function Skeleton({ variant = "rect", className, ...props }) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-base-300",
        variantClasses[variant] ?? variantClasses.rect,
        className,
      )}
    />
  );
}
