import { Link } from "react-router-dom";
import { LayoutDashboard, ShieldX } from "lucide-react";
import { DASHBOARD_PATH } from "@/constants/navigation";
import { ROLE_LABELS } from "@/constants/permissions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";

export function UnauthorizedPage() {
  const { user } = useAuth();
  const roleLabel = ROLE_LABELS[user?.role] ?? "current";

  return (
    <div>
      <PageHeader
        eyebrow="403 · Forbidden"
        title="Access denied"
        description={`The ${roleLabel.toLowerCase()} role does not include access to this area. If you believe this is a mistake, contact a workspace administrator.`}
      />

      <div className="mt-6 sm:mt-8">
        <EmptyState
          icon={<ShieldX />}
          title="You do not have permission to view this page"
          description="Role-based access is enforced on the route itself, not only by hiding navigation links. Return to the dashboard to continue with the areas available to your role."
          className="px-6 py-14 sm:py-16"
          action={
            <Link
              to={DASHBOARD_PATH}
              className="btn btn-primary btn-sm gap-2"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Back to overview
            </Link>
          }
        />
      </div>
    </div>
  );
}
