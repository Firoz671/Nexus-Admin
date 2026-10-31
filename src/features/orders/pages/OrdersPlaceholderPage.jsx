import { ShoppingCart } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export function OrdersPlaceholderPage() {
  return (
    <ComingSoonPage
      icon={ShoppingCart}
      title="Orders"
      description="Order workflows, fulfillment status, and history will be managed in this module."
    />
  );
}
