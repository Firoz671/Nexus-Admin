import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import {
  createCustomDateRange,
  createDateRange,
  CUSTOM_DATE_RANGE_PRESET,
  DATE_RANGE_PRESETS,
  formatDateRangeLabel,
  getRangeDayCount,
} from "@/utils/dateRange";

const rangeButtonBase =
  "inline-flex h-8 items-center justify-center gap-1 rounded-control px-2.5 text-xs font-semibold transition-colors focus-visible:outline-offset-2";

function getRangeButtonClassName(active) {
  return cn(
    rangeButtonBase,
    active
      ? "bg-primary text-primary-content shadow-sm"
      : "text-base-content/65 hover:bg-base-200 hover:text-base-content",
  );
}

export function DateRangeFilter({ value, onChange, className }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.start);
  const [customEnd, setCustomEnd] = useState(value.end);
  const [customError, setCustomError] = useState("");
  const panelId = useId();
  const errorId = `${panelId}-error`;
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const startInputRef = useRef(null);

  useEffect(() => {
    if (!customOpen) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      startInputRef.current?.focus();
    }, 0);

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setCustomOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setCustomOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [customOpen]);

  const handlePresetSelect = (preset) => {
    setCustomOpen(false);
    setCustomError("");
    onChange(createDateRange(preset));
  };

  const openCustomRange = () => {
    if (customOpen) {
      setCustomOpen(false);
      return;
    }

    setCustomStart(value.start);
    setCustomEnd(value.end);
    setCustomError("");
    setCustomOpen(true);
  };

  const closeCustomRange = () => {
    setCustomOpen(false);
    triggerRef.current?.focus();
  };

  const applyCustomRange = () => {
    try {
      const nextRange = createCustomDateRange(customStart, customEnd);

      setCustomError("");
      setCustomOpen(false);
      triggerRef.current?.focus();
      onChange(nextRange);
    } catch (error) {
      setCustomError(error.message);
    }
  };

  const isCustomActive = value.preset === CUSTOM_DATE_RANGE_PRESET;
  const rangeDays = getRangeDayCount(value);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex w-full flex-col gap-2 sm:w-auto sm:items-end", className)}
    >
      <div
        role="group"
        aria-label="Date range"
        className="flex w-full flex-wrap items-center gap-1 rounded-card border border-base-300 bg-base-100 p-1 sm:w-auto"
      >
        {DATE_RANGE_PRESETS.map((preset) => {
          const active = value.preset === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              aria-label={preset.label}
              aria-pressed={active}
              onClick={() => handlePresetSelect(preset.id)}
              className={getRangeButtonClassName(active)}
            >
              <span className="sm:hidden">{preset.shortLabel}</span>
              <span className="hidden sm:inline">{preset.label}</span>
            </button>
          );
        })}

        <button
          ref={triggerRef}
          type="button"
          aria-label="Custom date range"
          aria-expanded={customOpen}
          aria-controls={customOpen ? panelId : undefined}
          aria-pressed={isCustomActive}
          onClick={openCustomRange}
          className={getRangeButtonClassName(isCustomActive)}
        >
          <CalendarDays className="size-3.5" aria-hidden="true" />
          <span>Custom</span>
        </button>
      </div>

      <p
        aria-live="polite"
        className="flex items-center gap-1.5 text-xs text-base-content/60"
      >
        <span
          className="size-1.5 shrink-0 rounded-full bg-primary"
          aria-hidden="true"
        />
        {formatDateRangeLabel(value)} · {rangeDays}{" "}
        {rangeDays === 1 ? "day" : "days"}
      </p>

      {customOpen ? (
        <div
          id={panelId}
          role="group"
          aria-label="Custom date range"
          className="nexus-panel-enter absolute right-0 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-card border border-base-300 bg-base-100 p-4 shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-base-content">
                Custom range
              </p>
              <p className="mt-0.5 text-xs leading-5 text-base-content/60">
                Choose up to 366 days.
              </p>
            </div>
            <button
              type="button"
              onClick={closeCustomRange}
              aria-label="Close custom date range"
              className="flex size-7 shrink-0 items-center justify-center rounded-control text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-offset-2"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-base-content/70">
                Start date
              </span>
              <input
                ref={startInputRef}
                type="date"
                value={customStart}
                max={customEnd || undefined}
                aria-invalid={customError ? true : undefined}
                aria-describedby={customError ? errorId : undefined}
                onChange={(event) => setCustomStart(event.target.value)}
                className="input input-sm w-full border-base-300 bg-base-100 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-base-content/70">
                End date
              </span>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                aria-invalid={customError ? true : undefined}
                aria-describedby={customError ? errorId : undefined}
                onChange={(event) => setCustomEnd(event.target.value)}
                className="input input-sm w-full border-base-300 bg-base-100 text-sm"
              />
            </label>
          </div>

          {customError ? (
            <p id={errorId} role="alert" className="mt-2.5 text-xs text-error">
              {customError}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCustomRange}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              leftIcon={<Check />}
              onClick={applyCustomRange}
            >
              Apply range
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
