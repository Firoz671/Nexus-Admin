import { isRoleAllowedForPath } from "@/constants/permissions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UnauthorizedPage } from "./UnauthorizedPage";

export function RoleRoute({ path, children }) {
  const { user } = useAuth();

  if (!isRoleAllowedForPath(user?.role, path)) {
    return <UnauthorizedPage />;
  }

  return children;
}
