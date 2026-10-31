import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DASHBOARD_PATH, getNavItemForPath } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export function Breadcrumbs({ className }) {
  const { pathname } = useLocation();
  const currentItem = getNavItemForPath(pathname);
  const isDashboard = pathname === DASHBOARD_PATH;
  const currentLabel = currentItem?.label ?? "Page not found";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("min-w-0 overflow-hidden", className)}
    >
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {isDashboard ? (
          <li className="min-w-0">
            <span
              aria-current="page"
              className="block truncate font-medium text-base-content"
            >
              {currentLabel}
            </span>
          </li>
        ) : (
          <>
            <li className="shrink-0">
              <Link
                to={DASHBOARD_PATH}
                className="rounded-control font-medium text-base-content/55 transition-colors hover:text-base-content focus-visible:outline-offset-4"
              >
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true" className="shrink-0 text-base-content/35">
              <ChevronRight className="size-3.5" />
            </li>
            <li className="min-w-0">
              <span
                aria-current="page"
                className="block truncate font-medium text-base-content"
              >
                {currentLabel}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
