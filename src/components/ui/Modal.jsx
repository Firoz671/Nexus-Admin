import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  className,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const firstFocusable = panelRef.current?.querySelector(FOCUSABLE_SELECTOR);

      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      } else {
        panelRef.current?.focus();
      }
    }, 0);

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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="nexus-overlay-enter fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && closeOnBackdrop) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
        className={cn(
          "nexus-panel-enter relative my-auto w-full rounded-card border border-base-300 bg-base-100 shadow-2xl outline-none",
          sizeClasses[size] ?? sizeClasses.md,
          className,
        )}
      >
        {title || description || showCloseButton ? (
          <div className="flex items-start justify-between gap-4 border-b border-base-300 p-5 sm:p-6">
            <div className="min-w-0">
              {title ? (
                <h2
                  id={titleId}
                  className="text-heading-3 font-semibold text-base-content"
                >
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p
                  id={descriptionId}
                  className="mt-1.5 text-sm text-base-content/60"
                >
                  {description}
                </p>
              ) : null}
            </div>

            {showCloseButton ? (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Close dialog"
                onClick={onClose}
                className="-mr-1 -mt-1 shrink-0"
              >
                <X />
              </Button>
            ) : null}
          </div>
        ) : null}

        {children ? (
          <div className="p-5 sm:p-6">{children}</div>
        ) : null}

        {footer ? (
          <div className="flex flex-col-reverse gap-2 border-t border-base-300 p-5 sm:flex-row sm:justify-end sm:p-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
