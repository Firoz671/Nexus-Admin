import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/cn";

function SortIcon({ active, sortOrder }) {
  if (!active) {
    return <ChevronsUpDown className="size-3.5 opacity-45" aria-hidden="true" />;
  }

  return sortOrder === "asc" ? (
    <ArrowUp className="size-3.5" aria-hidden="true" />
  ) : (
    <ArrowDown className="size-3.5" aria-hidden="true" />
  );
}

export function DataTable({
  caption,
  columns,
  rows,
  getRowKey,
  sortBy,
  sortOrder,
  onSort,
  minWidthClassName = "min-w-[760px]",
  className,
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table
        className={cn(
          "w-full border-collapse text-left text-sm",
          minWidthClassName,
        )}
      >
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-xs uppercase tracking-wide text-base-content/60">
            {columns.map((column) => {
              const isSorted = Boolean(column.sortKey) && sortBy === column.sortKey;
              const ariaSort = isSorted
                ? sortOrder === "asc"
                  ? "ascending"
                  : "descending"
                : "none";

              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cn(
                    "whitespace-nowrap pb-3 pr-4 font-semibold last:pr-0",
                    column.headerClassName,
                  )}
                >
                  {column.sortKey && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.sortKey)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-control text-inherit transition-colors hover:text-base-content focus-visible:outline-offset-4",
                        isSorted && "text-base-content",
                      )}
                      aria-label={`Sort by ${column.header}`}
                    >
                      {column.header}
                      <SortIcon
                        active={isSorted}
                        sortOrder={sortOrder}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-t border-base-300/70 align-middle"
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cn(
                    "py-3 pr-4 text-base-content last:pr-0",
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
