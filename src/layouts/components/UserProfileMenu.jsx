import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

const PROFILE = Object.freeze({
  name: "Alex Morgan",
  role: "Administrator",
  email: "alex.morgan@nexus.example",
});

function showPlaceholder(message) {
  toast(message);
}

export function UserProfileMenu({ className }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const triggerId = useId();
  const menuId = useId();
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = useCallback(({ restoreFocus = false } = {}) => {
    setOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleDocumentKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
      } else if (event.key === "Tab") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    const firstItem = menuRef.current?.querySelector(MENU_ITEM_SELECTOR);

    if (firstItem instanceof HTMLElement) {
      firstItem.focus();
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [open, closeMenu]);

  const handleTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event) => {
    if (!menuRef.current) {
      return;
    }

    const menuItems = Array.from(
      menuRef.current.querySelectorAll(MENU_ITEM_SELECTOR),
    );

    if (menuItems.length === 0) {
      return;
    }

    const currentIndex = menuItems.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      menuItems[(currentIndex + 1) % menuItems.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      menuItems[
        (currentIndex - 1 + menuItems.length) % menuItems.length
      ].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      menuItems[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      menuItems[menuItems.length - 1].focus();
    }
  };

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      onSelect: () =>
        showPlaceholder("My Profile is a UI placeholder in this phase."),
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
      onSelect: () => navigate("/settings"),
    },
    {
      id: "help",
      label: "Help Center",
      icon: CircleHelp,
      onSelect: () =>
        showPlaceholder("Help Center is not available in this preview."),
    },
    { type: "separator" },
    {
      id: "sign-out",
      label: "Sign Out",
      icon: LogOut,
      variant: "danger",
      onSelect: () =>
        showPlaceholder(
          "Sign out is unavailable in this preview. Authentication arrives in a later phase.",
        ),
    },
  ];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={`Open user menu for ${PROFILE.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex h-10 items-center gap-2 rounded-control border border-transparent px-1 transition-colors hover:bg-base-200 focus-visible:outline-offset-2",
          open && "bg-base-200",
        )}
      >
        <Avatar name={PROFILE.name} size="sm" />
        <span className="hidden min-w-0 text-left md:block">
          <span className="block truncate text-sm font-medium leading-tight text-base-content">
            {PROFILE.name}
          </span>
          <span className="block truncate text-[0.6875rem] leading-tight text-base-content/55">
            {PROFILE.role}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "hidden size-3.5 shrink-0 text-base-content/50 transition-transform duration-200 md:block",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="nexus-panel-enter absolute right-0 top-full z-50 mt-2 w-64 rounded-card border border-base-300 bg-base-100 p-1.5 shadow-xl">
          <div className="border-b border-base-300 px-3 pb-3 pt-2">
            <p className="text-label font-semibold uppercase text-base-content/45">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-base-content">
              {PROFILE.name}
            </p>
            <p className="truncate text-xs text-base-content/55">
              {PROFILE.email}
            </p>
            <Badge variant="neutral" size="sm" className="mt-2">
              Demo account
            </Badge>
          </div>

          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={handleMenuKeyDown}
            className="pt-1.5"
          >
            {menuItems.map((item, index) => {
              if (item.type === "separator") {
                return (
                  <div
                    key={`separator-${index}`}
                    role="separator"
                    className="my-1 h-px bg-base-300"
                  />
                );
              }

              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeMenu({ restoreFocus: true });
                    item.onSelect?.();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-left text-sm font-medium transition-colors",
                    "focus-visible:bg-base-200 focus-visible:outline-none",
                    item.variant === "danger"
                      ? "text-error hover:bg-error/10"
                      : "text-base-content hover:bg-base-200",
                  )}
                >
                  <Icon
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
