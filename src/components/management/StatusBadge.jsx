import { Badge } from "@/components/ui/Badge";

const STATUS_META = Object.freeze({
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "neutral" },
  draft: { label: "Draft", variant: "warning" },
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "neutral" },
  failed: { label: "Failed", variant: "danger" },
  in_stock: { label: "In stock", variant: "success" },
  low_stock: { label: "Low stock", variant: "warning" },
  out_of_stock: { label: "Out of stock", variant: "danger" },
});

function toTitleCase(value) {
  return String(value ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function StatusBadge({ status, label, variant, size = "sm", className }) {
  const meta = STATUS_META[status] ?? {
    label: toTitleCase(status),
    variant: "neutral",
  };

  return (
    <Badge
      variant={variant ?? meta.variant}
      size={size}
      className={className}
    >
      {label ?? meta.label}
    </Badge>
  );
}
