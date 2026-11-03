export const ROLES = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMIN]: "Administrator",
  [ROLES.MANAGER]: "Manager",
});

export const ALL_ROLES = Object.freeze([ROLES.ADMIN, ROLES.MANAGER]);

export const ROUTE_PERMISSIONS = Object.freeze({
  "/dashboard": ALL_ROLES,
  "/users": ALL_ROLES,
  "/products": ALL_ROLES,
  "/orders": ALL_ROLES,
  "/analytics": ALL_ROLES,
  "/notifications": ALL_ROLES,
  "/settings": Object.freeze([ROLES.ADMIN]),
});

export function getAllowedRolesForPath(pathname) {
  const matchedPath = Object.keys(ROUTE_PERMISSIONS).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return matchedPath ? ROUTE_PERMISSIONS[matchedPath] : ALL_ROLES;
}

export function isRoleAllowedForPath(role, pathname) {
  if (!role || !ALL_ROLES.includes(role)) {
    return false;
  }

  return getAllowedRolesForPath(pathname).includes(role);
}
