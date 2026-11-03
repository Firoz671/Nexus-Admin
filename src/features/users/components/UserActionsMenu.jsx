import {
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";

export function UserActionsMenu({
  user,
  isSelf,
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
}) {
  const nextStatus = user.status === "active" ? "inactive" : "active";
  const statusLabel =
    nextStatus === "inactive" ? "Deactivate user" : "Activate user";
  const StatusIcon = nextStatus === "inactive" ? UserX : UserCheck;
  const items = [
    {
      id: "view",
      label: "View details",
      icon: <Eye />,
      onSelect: () => onView(user),
    },
    {
      id: "edit",
      label: "Edit user",
      icon: <Pencil />,
      onSelect: () => onEdit(user),
    },
    {
      id: "status",
      label: statusLabel,
      icon: <StatusIcon />,
      disabled: isSelf,
      onSelect: () => onChangeStatus(user, nextStatus),
    },
    { id: "separator-delete", type: "separator" },
    {
      id: "delete",
      label: "Delete user",
      icon: <Trash2 />,
      variant: "danger",
      disabled: isSelf,
      onSelect: () => onDelete(user),
    },
  ];

  return (
    <Dropdown
      trigger="Actions"
      triggerAriaLabel={`Actions for ${user.name}`}
      triggerClassName="btn-sm"
      items={items}
    />
  );
}
