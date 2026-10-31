import {
  Bell,
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

export const NAV_ITEMS = Object.freeze([
  {
    id: "overview",
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    id: "products",
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
]);

export const DASHBOARD_PATH = "/dashboard";

export function getNavItemForPath(pathname) {
  return (
    NAV_ITEMS.find(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
    ) ?? null
  );
}
