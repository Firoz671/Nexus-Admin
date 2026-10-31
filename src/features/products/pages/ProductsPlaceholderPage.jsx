import { Package } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export function ProductsPlaceholderPage() {
  return (
    <ComingSoonPage
      icon={Package}
      title="Products"
      description="Product catalog management and inventory tools will be introduced here."
    />
  );
}
