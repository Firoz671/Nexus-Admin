import { Navigate, Route, Routes } from "react-router-dom";
import { DesignSystemPage } from "@/features/design-system/pages/DesignSystemPage";
import { ShowcaseLayout } from "@/layouts/ShowcaseLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ShowcaseLayout />}>
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/design-system" replace />} />
      <Route path="*" element={<Navigate to="/design-system" replace />} />
    </Routes>
  );
}
