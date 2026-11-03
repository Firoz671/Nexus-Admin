import { ROLES } from "./permissions";

export const USER_STATUSES = Object.freeze(["active", "inactive"]);

export const USER_STATUS_LABELS = Object.freeze({
  active: "Active",
  inactive: "Inactive",
});

export const PRODUCT_STATUSES = Object.freeze(["active", "draft", "inactive"]);

export const PRODUCT_STATUS_LABELS = Object.freeze({
  active: "Active",
  draft: "Draft",
  inactive: "Inactive",
});

export const PRODUCT_CATEGORIES = Object.freeze([
  "Analytics",
  "Automation",
  "Integrations",
  "Operations",
  "Security",
  "Services",
]);

export const STOCK_FILTERS = Object.freeze([
  "all",
  "in_stock",
  "low_stock",
  "out_of_stock",
]);

export const STOCK_FILTER_LABELS = Object.freeze({
  all: "All stock levels",
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
});

export const LOW_STOCK_THRESHOLD = 10;

export const ORDER_STATUSES = Object.freeze([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const ORDER_STATUS_LABELS = Object.freeze({
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
});

export const ORDER_STATUS_TRANSITIONS = Object.freeze({
  pending: Object.freeze(["processing", "cancelled"]),
  processing: Object.freeze(["shipped", "cancelled"]),
  shipped: Object.freeze(["delivered"]),
  delivered: Object.freeze([]),
  cancelled: Object.freeze([]),
});

export const PAYMENT_STATUSES = Object.freeze([
  "paid",
  "pending",
  "refunded",
  "failed",
]);

export const PAYMENT_STATUS_LABELS = Object.freeze({
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
  failed: "Failed",
});

export const PAYMENT_METHODS = Object.freeze([
  "Visa •••• 4242",
  "Mastercard •••• 8810",
  "Amex •••• 3005",
  "PayPal",
  "Bank transfer",
]);

export const MANAGEMENT_PAGE_SIZE = 10;
export const MAX_MANAGEMENT_PAGE_SIZE = 100;

export const MANAGEMENT_ROLES = Object.freeze([ROLES.ADMIN, ROLES.MANAGER]);

export function canTransitionOrderStatus(currentStatus, nextStatus) {
  return (ORDER_STATUS_TRANSITIONS[currentStatus] ?? []).includes(nextStatus);
}

export function getOrderStatusActions(status) {
  return (ORDER_STATUS_TRANSITIONS[status] ?? []).map((nextStatus) => ({
    status: nextStatus,
    label:
      nextStatus === "cancelled"
        ? "Cancel order"
        : `Mark as ${ORDER_STATUS_LABELS[nextStatus].toLowerCase()}`,
  }));
}
