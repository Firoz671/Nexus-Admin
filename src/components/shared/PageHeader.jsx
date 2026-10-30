import { cn } from "@/utils/cn";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  as: Heading = "h1",
  headingId,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-label font-semibold uppercase text-primary">
            {eyebrow}
          </p>
        ) : null}
        <Heading
          id={headingId}
          className="mt-1 text-heading-1 font-semibold text-base-content"
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
