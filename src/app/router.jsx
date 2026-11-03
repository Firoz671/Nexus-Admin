import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PublicRoute } from "@/components/shared/PublicRoute";
import { RoleRoute } from "@/components/shared/RoleRoute";
import { NotFoundPage } from "@/features/not-found/pages/NotFoundPage";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ShowcaseLayout } from "@/layouts/ShowcaseLayout";

function lazyNamed(loader, exportName) {
  return lazy(() =>
    loader().then((module) => {
      const Component = module[exportName];

      if (!Component) {
        throw new Error(`Missing lazy export: ${exportName}`);
      }

      return { default: Component };
    }),
  );
}

const AnalyticsPage = lazyNamed(
  () => import("@/features/analytics/pages/AnalyticsPage"),
  "AnalyticsPage",
);
const DashboardPage = lazyNamed(
  () => import("@/features/dashboard/pages/DashboardPage"),
  "DashboardPage",
);
const DesignSystemPage = lazyNamed(
  () => import("@/features/design-system/pages/DesignSystemPage"),
  "DesignSystemPage",
);
const LoginPage = lazyNamed(
  () => import("@/features/auth/pages/LoginPage"),
  "LoginPage",
);
const NotificationsPlaceholderPage = lazyNamed(
  () => import("@/features/notifications/pages/NotificationsPlaceholderPage"),
  "NotificationsPlaceholderPage",
);
const OrdersPlaceholderPage = lazyNamed(
  () => import("@/features/orders/pages/OrdersPlaceholderPage"),
  "OrdersPlaceholderPage",
);
const ProductsPlaceholderPage = lazyNamed(
  () => import("@/features/products/pages/ProductsPlaceholderPage"),
  "ProductsPlaceholderPage",
);
const SettingsPlaceholderPage = lazyNamed(
  () => import("@/features/settings/pages/SettingsPlaceholderPage"),
  "SettingsPlaceholderPage",
);
const UsersPlaceholderPage = lazyNamed(
  () => import("@/features/users/pages/UsersPlaceholderPage"),
  "UsersPlaceholderPage",
);

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ShowcaseLayout />}>
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPlaceholderPage />} />
          <Route path="/products" element={<ProductsPlaceholderPage />} />
          <Route path="/orders" element={<OrdersPlaceholderPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/notifications"
            element={<NotificationsPlaceholderPage />}
          />
          <Route
            path="/settings"
            element={
              <RoleRoute path="/settings">
                <SettingsPlaceholderPage />
              </RoleRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
