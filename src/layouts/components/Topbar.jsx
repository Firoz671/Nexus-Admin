import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationButton } from "./NotificationButton";
import { UserProfileMenu } from "./UserProfileMenu";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Topbar({ onOpenMobileNavigation, mobileNavigationOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-base-300 bg-base-100/95 px-3 backdrop-blur sm:gap-3 sm:px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Open navigation menu"
        title="Open navigation menu"
        aria-haspopup="dialog"
        aria-expanded={mobileNavigationOpen}
        aria-controls={
          mobileNavigationOpen ? "mobile-navigation" : undefined
        }
        onClick={onOpenMobileNavigation}
        className="shrink-0 lg:hidden"
      >
        <Menu />
      </Button>

      <Breadcrumbs className="min-w-0 flex-1" />

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <WorkspaceSwitcher />
        <ThemeToggle />
        <NotificationButton />
        <UserProfileMenu />
      </div>
    </header>
  );
}
