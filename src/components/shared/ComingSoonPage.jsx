import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DASHBOARD_PATH } from "@/constants/navigation";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";

export function ComingSoonPage({ icon: Icon, title, description, note }) {
  return (
    <div>
      <PageHeader
        eyebrow="Module preview"
        title={title}
        description={description}
        actions={
          <Badge variant="info" size="sm">
            Planned for a later phase
          </Badge>
        }
      />

      <div className="mt-6 sm:mt-8">
        <EmptyState
          icon={<Icon />}
          title={`${title} is coming soon`}
          description={
            note ??
            "This route validates the application shell and navigation. The module itself is not part of Phase 2 and will be built in a later phase."
          }
          className="px-6 py-14 sm:py-16"
          action={
            <Link
              to={DASHBOARD_PATH}
              className="btn btn-outline btn-sm gap-2"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to overview
            </Link>
          }
        />
      </div>
    </div>
  );
}
