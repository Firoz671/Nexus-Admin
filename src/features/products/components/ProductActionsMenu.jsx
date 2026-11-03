import {
  Eye,
  Pencil,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";

export function ProductActionsMenu({
  product,
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
}) {
  const isActive = product.status === "active";
  const nextStatus = isActive ? "inactive" : "active";
  const items = [
    {
      id: "view",
      label: "View details",
      icon: <Eye />,
      onSelect: () => onView(product),
    },
    {
      id: "edit",
      label: "Edit product",
      icon: <Pencil />,
      onSelect: () => onEdit(product),
    },
    {
      id: "status",
      label: isActive ? "Deactivate product" : "Activate product",
      icon: isActive ? <PowerOff /> : <Power />,
      onSelect: () => onChangeStatus(product, nextStatus),
    },
    { id: "separator-delete", type: "separator" },
    {
      id: "delete",
      label: "Delete product",
      icon: <Trash2 />,
      variant: "danger",
      onSelect: () => onDelete(product),
    },
  ];

  return (
    <Dropdown
      trigger="Actions"
      triggerAriaLabel={`Actions for ${product.name}`}
      triggerClassName="btn-sm"
      items={items}
    />
  );
}
