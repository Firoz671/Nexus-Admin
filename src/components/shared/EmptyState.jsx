import { cn } from "@/utils/cn";

export function EmptyState({
  icon,
  title = "Nothing here yet",
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-base-200 text-base-content/60 [&_svg]:size-5">
          {icon}
        </div>
      ) : null}

      <h3 className="text-heading-3 font-semibold text-base-content">
        {title}
      </h3>

      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-6 text-base-content/60">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
