import { Users } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export function UsersPlaceholderPage() {
  return (
    <ComingSoonPage
      icon={Users}
      title="Users"
      description="Team member management, roles, and access controls will live in this module."
    />
  );
}
