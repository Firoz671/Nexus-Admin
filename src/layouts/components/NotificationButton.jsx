import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChartNoAxesCombined,
  LayoutDashboard,
  Palette,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const SAMPLE_NOTIFICATIONS = Object.freeze([
  {
    id: "shell-preview",
    title: "Application shell preview",
    description:
      "The Phase 2 sidebar, topbar, and responsive navigation are ready to explore.",
    time: "Sample · today",
    icon: LayoutDashboard,
  },
  {
    id: "design-tokens",
    title: "Design tokens available",
    description:
      "Phase 1 semantic colors and typography are used throughout the new layout.",
    time: "Sample · earlier",
    icon: Palette,
  },
  {
    id: "module-routes",
    title: "Module routes prepared",
    description:
      "Analytics, orders, products, users, and settings now have placeholder routes.",
    time: "Sample · earlier",
    icon: ChartNoAxesCombined,
  },
]);

export function NotificationButton({ className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    panelRef.current?.focus();

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Notifications, sample preview"
        title="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? "notification-preview" : undefined}
        onClick={() => setOpen((current) => !current)}
        className="relative text-base-content/65"
      >
        <Bell />
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 size-1.5 rounded-full bg-error ring-2 ring-base-100"
        />
      </Button>

      {open ? (
        <div
          ref={panelRef}
          id="notification-preview"
          role="dialog"
          aria-label="Sample notifications"
          tabIndex={-1}
          className="nexus-panel-enter absolute right-0 top-full z-50 mt-2 w-[min(21rem,calc(100vw-1.5rem))] rounded-card border border-base-300 bg-base-100 shadow-xl outline-none"
        >
          <div className="flex items-start justify-between gap-3 border-b border-base-300 p-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-base-content">
                  Notifications
                </h2>
                <Badge variant="info" size="sm">
                  Preview
                </Badge>
              </div>
              <p className="mt-1 text-xs text-base-content/55">
                Sample content for layout demonstration.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Close notifications"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="-mr-1 -mt-1 shrink-0"
            >
              <X />
            </Button>
          </div>

          <ul className="divide-y divide-base-300/70">
            {SAMPLE_NOTIFICATIONS.map((notification) => {
              const Icon = notification.icon;

              return (
                <li
                  key={notification.id}
                  className="flex gap-3 p-4 transition-colors hover:bg-base-200/60"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-base-content">
                        {notification.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 size-1.5 shrink-0 rounded-full bg-info"
                      />
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-base-content/60">
                      {notification.description}
                    </span>
                    <span className="mt-1 block text-[0.6875rem] font-medium uppercase tracking-wide text-base-content/40">
                      {notification.time}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-base-300 p-3">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-control px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-offset-2"
            >
              Open notifications module
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
