import { Settings } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export function SettingsPlaceholderPage() {
  return (
    <ComingSoonPage
      icon={Settings}
      title="Settings"
      description="Workspace preferences, account configuration, and integrations will be managed here."
    />
  );
}
