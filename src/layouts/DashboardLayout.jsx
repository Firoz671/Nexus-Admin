import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { MainContent } from "./components/MainContent";
import { MobileSidebar } from "./components/MobileSidebar";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    isOpen: mobileNavigationOpen,
    open: openMobileNavigation,
    close: closeMobileNavigation,
  } = useDisclosure(false);

  return (
    <div className="min-h-screen bg-base-200">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() =>
            setSidebarCollapsed((collapsed) => !collapsed)
          }
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onOpenMobileNavigation={openMobileNavigation}
            mobileNavigationOpen={mobileNavigationOpen}
          />

          <MainContent>
            <Outlet />
          </MainContent>

          <footer className="border-t border-base-300 bg-base-100">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1.5 px-4 py-4 text-xs text-base-content/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>Nexus Admin · Phase 2 application shell preview</p>
              <Link
                to="/design-system"
                className="w-fit rounded-control font-medium text-base-content/65 transition-colors hover:text-primary focus-visible:outline-offset-4"
              >
                Open design system
              </Link>
            </div>
          </footer>
        </div>
      </div>

      <MobileSidebar
        open={mobileNavigationOpen}
        onClose={closeMobileNavigation}
        onNavigate={closeMobileNavigation}
      />
    </div>
  );
}
