import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

export function Dropdown({
  trigger,
  triggerAriaLabel,
  items = [],
  align = "end",
  disabled = false,
  className,
  triggerClassName,
  menuClassName,
}) {
  const [open, setOpen] = useState(false);
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

  const handleSelect = (item) => {
    if (item.disabled) {
      return;
    }

    item.onSelect?.();
    closeMenu({ restoreFocus: true });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={cn("btn btn-outline", triggerClassName)}
        aria-label={triggerAriaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={cn(
            "nexus-panel-enter absolute z-40 mt-2 min-w-52 rounded-card border border-base-300 bg-base-100 p-1.5 shadow-xl",
            align === "start" ? "left-0" : "right-0",
            menuClassName,
          )}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => {
            if (item.type === "separator") {
              return (
                <div
                  key={item.id ?? `separator-${index}`}
                  role="separator"
                  className="my-1 h-px bg-base-300"
                />
              );
            }

            return (
              <button
                key={item.id ?? item.label ?? index}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleSelect(item)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-left text-sm font-medium transition-colors",
                  "focus-visible:bg-base-200 focus-visible:outline-none",
                  item.variant === "danger"
                    ? "text-error hover:bg-error/10"
                    : "text-base-content hover:bg-base-200",
                  item.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {item.icon ? (
                  <span className="shrink-0 [&_svg]:size-4" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                <span className="flex-1 truncate">{item.label}</span>
                {item.shortcut ? (
                  <kbd className="rounded border border-base-300 bg-base-200 px-1.5 py-0.5 text-[0.6875rem] font-medium text-base-content/50">
                    {item.shortcut}
                  </kbd>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
