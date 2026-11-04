import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/formatters";

function getPageItems(page, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", pageCount];
  }

  if (page >= pageCount - 3) {
    return [
      1,
      "start-ellipsis",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ];
  }

  return [
    1,
    "start-ellipsis",
    page - 1,
    page,
    page + 1,
    "end-ellipsis",
    pageCount,
  ];
}

export function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
  className,
}) {
  if (!totalItems) {
    return null;
  }

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col gap-3 rounded-card border border-base-300 bg-base-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-base-content/60">
        Showing{" "}
        <span className="font-semibold text-base-content">
          {formatNumber(firstItem)}–{formatNumber(lastItem)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-base-content">
          {formatNumber(totalItems)}
        </span>{" "}
        {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ChevronLeft />}
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {getPageItems(page, pageCount).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-label={`Go to page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                "flex size-8 items-center justify-center rounded-control text-xs font-semibold transition-colors focus-visible:outline-offset-2",
                item === page
                  ? "bg-primary text-primary-content"
                  : "text-base-content/65 hover:bg-base-200 hover:text-base-content",
              )}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className="px-1 text-xs text-base-content/60"
            >
              …
            </span>
          ),
        )}

        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ChevronRight />}
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">Next</span>
        </Button>
      </div>
    </nav>
  );
}
