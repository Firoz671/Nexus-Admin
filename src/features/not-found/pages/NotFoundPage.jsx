import { Link } from "react-router-dom";
import { LayoutDashboard, SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export function NotFoundPage() {
  return (
    <div>
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="The page you are looking for does not exist or may have moved."
      />

      <div className="mt-6 sm:mt-8">
        <EmptyState
          icon={<SearchX />}
          title="This route is not part of the application shell"
          description="Use the navigation to return to a valid module, or open the design system showcase."
          className="px-6 py-14 sm:py-16"
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/dashboard"
                className="btn btn-primary btn-sm gap-2"
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Back to overview
              </Link>
              <Link to="/design-system" className="btn btn-ghost btn-sm">
                Open design system
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}
