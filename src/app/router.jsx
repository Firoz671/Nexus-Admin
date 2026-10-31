import { Navigate, Route, Routes } from "react-router-dom";
import { AnalyticsPlaceholderPage } from "@/features/analytics/pages/AnalyticsPlaceholderPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { DesignSystemPage } from "@/features/design-system/pages/DesignSystemPage";
import { NotFoundPage } from "@/features/not-found/pages/NotFoundPage";
import { NotificationsPlaceholderPage } from "@/features/notifications/pages/NotificationsPlaceholderPage";
import { OrdersPlaceholderPage } from "@/features/orders/pages/OrdersPlaceholderPage";
import { ProductsPlaceholderPage } from "@/features/products/pages/ProductsPlaceholderPage";
import { SettingsPlaceholderPage } from "@/features/settings/pages/SettingsPlaceholderPage";
import { UsersPlaceholderPage } from "@/features/users/pages/UsersPlaceholderPage";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ShowcaseLayout } from "@/layouts/ShowcaseLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ShowcaseLayout />}>
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPlaceholderPage />} />
        <Route path="/products" element={<ProductsPlaceholderPage />} />
        <Route path="/orders" element={<OrdersPlaceholderPage />} />
        <Route path="/analytics" element={<AnalyticsPlaceholderPage />} />
        <Route
          path="/notifications"
          element={<NotificationsPlaceholderPage />}
        />
        <Route path="/settings" element={<SettingsPlaceholderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
