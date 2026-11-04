import { Loader } from "@/components/ui/Loader";
import { cn } from "@/utils/cn";

export function RouteLoadingScreen({
  label = "Loading",
  description,
  className,
  fullScreen = true,
}) {
  return (
    <div
      className={cn(
        fullScreen ? "min-h-screen" : "min-h-[50vh]",
        "flex flex-col items-center justify-center gap-4 bg-base-200 px-4 text-center",
        className,
      )}
    >
      <Loader size="lg" label={label} />
      <div>
        <p className="text-sm font-medium text-base-content">{label}</p>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-base-content/60">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
