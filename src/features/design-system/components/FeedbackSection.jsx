import { Inbox, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ShowcaseSection } from "./ShowcaseSection";

const loaderSizes = ["xs", "sm", "md", "lg"];

export function FeedbackSection() {
  return (
    <ShowcaseSection
      id="feedback"
      title="Feedback states"
      description="Loading, empty, and error states keep the interface honest while data is unavailable. Each state offers a clear next action."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Skeleton placeholders"
          description="Use shape-matched skeletons for lists, cards, and profile rows."
        >
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="size-12" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-2/3" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <Skeleton variant="rect" className="h-16" />
            <Skeleton variant="rect" className="h-16" />
            <Skeleton variant="rect" className="h-16" />
          </div>
        </Card>

        <Card
          title="Loaders"
          description="Compact spinners with screen-reader labels for background operations."
        >
          <div className="flex flex-wrap items-center gap-8">
            {loaderSizes.map((size) => (
              <div
                key={size}
                className="flex flex-col items-center gap-2 text-xs text-base-content/45"
              >
                <Loader size={size} label={`Loading ${size} example`} />
                <span className="font-mono uppercase">{size}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-control bg-base-200/60 p-3.5 text-xs leading-5 text-base-content/55">
            Loaders expose role="status" and an audible label while remaining
            visually compact.
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-label font-semibold uppercase text-base-content/45">
            Empty state
          </p>
          <EmptyState
            icon={<Inbox />}
            title="No projects yet"
            description="Create your first project to start organizing work and inviting teammates."
            action={
              <Button leftIcon={<Plus />} size="sm">
                New project
              </Button>
            }
          />
        </div>

        <div>
          <p className="mb-3 text-label font-semibold uppercase text-base-content/45">
            Error state
          </p>
          <ErrorState
            title="Could not load activity"
            description="The activity feed is temporarily unavailable. Retry the request or come back in a moment."
            onRetry={() =>
              toast("Retry is ready to connect to your data source.")
            }
          />
        </div>
      </div>
    </ShowcaseSection>
  );
}
