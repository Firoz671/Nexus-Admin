import { Bell } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export function NotificationsPlaceholderPage() {
  return (
    <ComingSoonPage
      icon={Bell}
      title="Notifications"
      description="Notification history, preferences, and delivery settings will be available here."
    />
  );
}
