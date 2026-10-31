import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import nexusMark from "@/assets/icons/nexus-mark.svg";
import { Button } from "@/components/ui/Button";
import { DASHBOARD_PATH } from "@/constants/navigation";
import { SidebarFooter, SidebarNavigation } from "./Sidebar";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function MobileSidebar({ open, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const onNavigateRef = useRef(onNavigate);

  useEffect(() => {
    onCloseRef.current = onClose;
    onNavigateRef.current = onNavigate;
  }, [onClose, onNavigate]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!panelRef.current.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const desktopQuery = window.matchMedia?.("(min-width: 1024px)");
    const handleDesktopChange = (event) => {
      if (event.matches) {
        onCloseRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery?.addEventListener?.("change", handleDesktopChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery?.removeEventListener?.("change", handleDesktopChange);
      document.body.style.overflow = previousOverflow;

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleNavigate = () => {
    onNavigateRef.current?.();
    onCloseRef.current();
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="nexus-overlay-enter absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-hidden="true"
        onMouseDown={onClose}
      />

      <div
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="nexus-drawer-enter absolute inset-y-0 left-0 flex w-[min(19rem,85vw)] flex-col border-r border-base-300 bg-base-100 shadow-2xl"
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-base-300 px-3">
          <Link
            to={DASHBOARD_PATH}
            onClick={handleNavigate}
            aria-label="Nexus Admin dashboard"
            className="flex min-w-0 items-center gap-3 rounded-control focus-visible:outline-offset-4"
          >
            <img
              src={nexusMark}
              alt=""
              width="36"
              height="36"
              className="size-9 shrink-0 rounded-control shadow-sm"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-base-content">
                Nexus Admin
              </span>
              <span className="block truncate text-xs text-base-content/55">
                Administration console
              </span>
            </span>
          </Link>

          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Close navigation menu"
            onClick={onClose}
            className="shrink-0"
          >
            <X />
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <SidebarNavigation onNavigate={handleNavigate} />
          <div className="mt-auto">
            <SidebarFooter showCollapseControl={false} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
