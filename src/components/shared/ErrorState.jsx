import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function ErrorState({
  icon,
  title = "Something went wrong",
  description = "We could not load this content. Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-base-300 bg-base-100 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-error/10 text-error [&_svg]:size-5">
        {icon ?? <AlertTriangle />}
      </div>

      <h3 className="text-heading-3 font-semibold text-base-content">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm leading-6 text-base-content/60">
        {description}
      </p>

      {onRetry || action ? (
        <div className="mt-5">
          {action ?? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
