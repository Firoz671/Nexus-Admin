import { cn } from "@/utils/cn";

export function Card({
  title,
  description,
  header,
  footer,
  children,
  bordered = true,
  className,
  contentClassName,
}) {
  const hasHeader = Boolean(header || title || description);
  const hasBody = Boolean(children);
  const hasFooter = Boolean(footer);

  return (
    <div
      className={cn(
        "rounded-card bg-base-100",
        bordered ? "border border-base-300 shadow-sm" : "border border-transparent",
        className,
      )}
    >
      {hasHeader ? (
        <div
          className={cn(
            "p-5 sm:p-6",
            (hasBody || hasFooter) && "border-b border-base-300",
          )}
        >
          {header ?? (
            <div>
              {title ? (
                <h3 className="text-heading-3 font-semibold text-base-content">
                  {title}
                </h3>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-base-content/60">{description}</p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {hasBody ? (
        <div
          className={cn(
            "p-5 sm:p-6",
            hasHeader && "pt-4 sm:pt-5",
            contentClassName,
          )}
        >
          {children}
        </div>
      ) : null}

      {hasFooter ? (
        <div className="border-t border-base-300 px-5 py-3.5 sm:px-6">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
