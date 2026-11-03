import { ArrowRight, Ban, Eye } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { getOrderStatusActions } from "@/constants/management";

export function OrderActionsMenu({ order, onView, onChangeStatus }) {
  const statusActions = getOrderStatusActions(order.status);
  const items = [
    {
      id: "view",
      label: "View order",
      icon: <Eye />,
      onSelect: () => onView(order),
    },
  ];

  if (statusActions.length > 0) {
    items.push({ id: "separator-status", type: "separator" });

    statusActions.forEach((action) => {
      const isCancellation = action.status === "cancelled";

      items.push({
        id: `status-${action.status}`,
        label: action.label,
        icon: isCancellation ? <Ban /> : <ArrowRight />,
        variant: isCancellation ? "danger" : undefined,
        onSelect: () => onChangeStatus(order, action.status),
      });
    });
  }

  return (
    <Dropdown
      trigger="Actions"
      triggerAriaLabel={`Actions for ${order.id}`}
      triggerClassName="btn-sm"
      items={items}
    />
  );
}
