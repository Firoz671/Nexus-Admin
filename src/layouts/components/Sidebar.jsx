import { Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { LifeBuoy, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import nexusMark from "@/assets/icons/nexus-mark.svg";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DASHBOARD_PATH, NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export function SidebarNavigation({ collapsed = false, onNavigate, className }) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn("flex flex-col gap-1 px-3 py-4", className)}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onNavigate}
            aria-label={item.label}
            className={({ isActive }) =>
              cn(
                "group relative flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors",
                "focus-visible:outline-offset-2",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/65 hover:bg-base-200 hover:text-base-content",
                collapsed && "justify-center px-0",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 h-5 w-0.5 rounded-full bg-primary transition-opacity",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className="size-[1.125rem] shrink-0"
                  aria-hidden="true"
                />
                {collapsed ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-full z-40 ml-3 whitespace-nowrap rounded-control border border-base-300 bg-base-100 px-2.5 py-1.5 text-xs font-medium text-base-content opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {item.label}
                  </span>
                ) : (
                  <span className="truncate">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function SidebarFooter({
  collapsed = false,
  onToggleCollapse,
  showCollapseControl = true,
}) {
  const handleHelp = () => {
    toast("Help and support is planned for a later phase.");
  };

  return (
    <div className="border-t border-base-300 p-3">
      <button
        type="button"
        onClick={handleHelp}
        title={collapsed ? "Help and support" : undefined}
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-control px-3 text-sm font-medium text-base-content/65 transition-colors hover:bg-base-200 hover:text-base-content",
          collapsed && "justify-center px-0",
        )}
      >
        <LifeBuoy className="size-[1.125rem] shrink-0" aria-hidden="true" />
        {collapsed ? (
          <span className="sr-only">Help and support</span>
        ) : (
          <span className="truncate">Help &amp; support</span>
        )}
      </button>

      <div
        className={cn(
          "mt-2 flex items-center gap-2 rounded-control border border-base-300/80 bg-base-200/50 p-2",
          collapsed && "justify-center border-transparent bg-transparent p-0",
        )}
      >
        <Avatar name="Alex Morgan" size="sm" />
        {!collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-base-content">
                Alex Morgan
              </p>
              <p className="truncate text-xs text-base-content/55">
                Administrator
              </p>
            </div>
            {showCollapseControl ? (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                onClick={onToggleCollapse}
              >
                <PanelLeftClose />
              </Button>
            ) : null}
          </>
        ) : null}
      </div>

      {collapsed && showCollapseControl ? (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label="Expand sidebar"
          title="Expand sidebar"
          onClick={onToggleCollapse}
          className="mt-2 w-full"
        >
          <PanelLeftOpen />
        </Button>
      ) : null}
    </div>
  );
}

export function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "sticky top-0 z-20 hidden h-screen shrink-0 flex-col border-r border-base-300 bg-base-100 transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-[4.75rem]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-base-300 px-3",
          collapsed ? "justify-center" : "justify-start",
        )}
      >
        <Link
          to={DASHBOARD_PATH}
          aria-label="Nexus Admin dashboard"
          className={cn(
            "flex min-w-0 items-center gap-3 rounded-control focus-visible:outline-offset-4",
            collapsed && "justify-center",
          )}
        >
          <img
            src={nexusMark}
            alt=""
            width="36"
            height="36"
            className="size-9 shrink-0 rounded-control shadow-sm"
          />
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-base-content">
                Nexus Admin
              </span>
              <span className="block truncate text-xs text-base-content/55">
                Administration console
              </span>
            </span>
          ) : null}
        </Link>
      </div>

      <div className="min-h-0 flex-1">
        <SidebarNavigation collapsed={collapsed} />
      </div>

      <SidebarFooter
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </aside>
  );
}
