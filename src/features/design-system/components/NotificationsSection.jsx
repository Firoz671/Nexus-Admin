import { Bell, CheckCircle2, Info, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShowcaseSection } from "./ShowcaseSection";

export function NotificationsSection() {
  const showLoadingToast = () => {
    const toastId = toast.loading("Syncing workspace data...");

    window.setTimeout(() => {
      toast.success("Workspace synced successfully.", { id: toastId });
    }, 1600);
  };

  return (
    <ShowcaseSection
      id="notifications"
      title="Notifications"
      description="React Hot Toast is mounted once at the application root. Toasts inherit theme tokens and support success, error, loading, and informational messages."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Notification patterns"
          description="Trigger each pattern to verify the global toast provider."
        >
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              leftIcon={<CheckCircle2 />}
              onClick={() => toast.success("Changes saved successfully.")}
            >
              Success
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<XCircle />}
              onClick={() => toast.error("We could not save your changes.")}
            >
              Error
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Bell />}
              onClick={showLoadingToast}
            >
              Loading
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Info />}
              onClick={() =>
                toast("Heads up: maintenance starts at 22:00 UTC.", {
                  icon: <Info className="size-4 text-info" />,
                })
              }
            >
              Info
            </Button>
          </div>
        </Card>

        <Card
          title="Configured once"
          description="The provider lives in app/providers.jsx so features never mount their own toaster."
        >
          <ul className="space-y-2.5 text-sm text-base-content/65">
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              Positioned top-right with a 3.5 second default duration.
            </li>
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              Surfaces use base and semantic theme tokens in both modes.
            </li>
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              Loading toasts can be updated in place with a stable toast id.
            </li>
          </ul>
        </Card>
      </div>
    </ShowcaseSection>
  );
}
