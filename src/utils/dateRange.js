import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfYear,
  subDays,
} from "date-fns";

export const DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULT_DATE_RANGE_PRESET = "30d";
export const CUSTOM_DATE_RANGE_PRESET = "custom";
export const MAX_CUSTOM_RANGE_DAYS = 366;

export const DATE_RANGE_PRESETS = Object.freeze([
  Object.freeze({
    id: "7d",
    label: "Last 7 days",
    shortLabel: "7D",
    days: 7,
  }),
  Object.freeze({
    id: "30d",
    label: "Last 30 days",
    shortLabel: "30D",
    days: 30,
  }),
  Object.freeze({
    id: "90d",
    label: "Last 90 days",
    shortLabel: "90D",
    days: 90,
  }),
  Object.freeze({
    id: "year",
    label: "This year",
    shortLabel: "YTD",
  }),
]);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const KNOWN_PRESETS = new Set([
  ...DATE_RANGE_PRESETS.map((preset) => preset.id),
  CUSTOM_DATE_RANGE_PRESET,
]);

function readParam(searchParams, key) {
  if (typeof searchParams?.get === "function") {
    return searchParams.get(key);
  }

  return searchParams?.[key] ?? null;
}

export function formatDateKey(date) {
  return format(date, DATE_FORMAT);
}

export function parseDateKey(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    return null;
  }

  const date = parseISO(value);

  return isValid(date) ? startOfDay(date) : null;
}

export function createDateRange(preset = DEFAULT_DATE_RANGE_PRESET, now = new Date()) {
  const normalizedPreset = KNOWN_PRESETS.has(preset)
    ? preset
    : DEFAULT_DATE_RANGE_PRESET;

  if (normalizedPreset === CUSTOM_DATE_RANGE_PRESET) {
    throw new Error("Custom ranges require explicit start and end dates.");
  }

  const presetConfig = DATE_RANGE_PRESETS.find(
    (item) => item.id === normalizedPreset,
  );

  const end = startOfDay(now);
  const start =
    normalizedPreset === "year"
      ? startOfYear(end)
      : subDays(end, Math.max(0, (presetConfig?.days ?? 30) - 1));

  return {
    preset: normalizedPreset,
    start: formatDateKey(start),
    end: formatDateKey(end),
  };
}

export function createCustomDateRange(startValue, endValue) {
  const start = parseDateKey(startValue);
  const end = parseDateKey(endValue);

  if (!start || !end) {
    throw new Error("Choose a valid start and end date.");
  }

  if (start > end) {
    throw new Error("The start date must be on or before the end date.");
  }

  const days = differenceInCalendarDays(end, start) + 1;

  if (days > MAX_CUSTOM_RANGE_DAYS) {
    throw new Error(
      `Custom date ranges can cover up to ${MAX_CUSTOM_RANGE_DAYS} days.`,
    );
  }

  return {
    preset: CUSTOM_DATE_RANGE_PRESET,
    start: formatDateKey(start),
    end: formatDateKey(end),
  };
}

export function resolveDateRangeParams(searchParams, now = new Date()) {
  const requestedPreset =
    readParam(searchParams, "range") || DEFAULT_DATE_RANGE_PRESET;

  if (!KNOWN_PRESETS.has(requestedPreset)) {
    throw new Error(
      "Unknown date range. Use 7d, 30d, 90d, year, or custom.",
    );
  }

  if (requestedPreset === CUSTOM_DATE_RANGE_PRESET) {
    return createCustomDateRange(
      readParam(searchParams, "start"),
      readParam(searchParams, "end"),
    );
  }

  const requestedStart = readParam(searchParams, "start");
  const requestedEnd = readParam(searchParams, "end");

  if (requestedStart || requestedEnd) {
    if (!requestedStart || !requestedEnd) {
      throw new Error("Both start and end dates are required.");
    }

    const range = createCustomDateRange(requestedStart, requestedEnd);

    return {
      ...range,
      preset: requestedPreset,
    };
  }

  return createDateRange(requestedPreset, now);
}

export function getRangeDayCount(range) {
  const start = parseDateKey(range?.start);
  const end = parseDateKey(range?.end);

  if (!start || !end || start > end) {
    return 0;
  }

  return differenceInCalendarDays(end, start) + 1;
}

export function getPreviousDateRange(range) {
  const start = parseDateKey(range?.start);
  const days = getRangeDayCount(range);

  if (!start || days === 0) {
    return null;
  }

  return {
    preset: CUSTOM_DATE_RANGE_PRESET,
    start: formatDateKey(subDays(start, days)),
    end: formatDateKey(subDays(start, 1)),
  };
}

export function toDateRangeQueryParams(range) {
  return {
    range: range?.preset ?? DEFAULT_DATE_RANGE_PRESET,
    start: range?.start,
    end: range?.end,
  };
}

export function formatDateRangeLabel(range) {
  const start = parseDateKey(range?.start);
  const end = parseDateKey(range?.end);

  if (!start || !end) {
    return "Selected period";
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }

  return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
}
