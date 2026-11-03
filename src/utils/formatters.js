import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const preciseCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function toFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function formatCurrency(value, { compact = false, precise = false } = {}) {
  const amount = toFiniteNumber(value);

  if (compact) {
    return compactCurrencyFormatter.format(amount);
  }

  return precise
    ? preciseCurrencyFormatter.format(amount)
    : currencyFormatter.format(amount);
}

export function formatCompactCurrency(value) {
  return formatCurrency(value, { compact: true });
}

export function formatNumber(value, { compact = false } = {}) {
  const amount = toFiniteNumber(value);

  return compact
    ? compactNumberFormatter.format(amount)
    : numberFormatter.format(amount);
}

export function formatPercent(value, { signed = false, digits = 1 } = {}) {
  const amount = toFiniteNumber(value);
  const prefix = signed && amount > 0 ? "+" : "";

  return `${prefix}${amount.toFixed(digits)}%`;
}

export function formatDate(value, pattern = "MMM d, yyyy") {
  const date = typeof value === "string" ? parseISO(value) : value;

  return date && isValid(date) ? format(date, pattern) : "—";
}

export function formatDateTime(value) {
  return formatDate(value, "MMM d, yyyy, h:mm a");
}

export function formatRelativeDate(value) {
  const date = typeof value === "string" ? parseISO(value) : value;

  if (!date || !isValid(date)) {
    return "Unknown time";
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}
