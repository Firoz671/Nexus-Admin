import { DASHBOARD_PATH } from "@/constants/navigation";
import { LOGIN_PATH } from "@/constants/auth";

export function getSafeRedirectPath(from, fallback = DASHBOARD_PATH) {
  const candidate =
    typeof from === "string"
      ? from
      : from && typeof from === "object"
        ? `${from.pathname ?? ""}${from.search ?? ""}${from.hash ?? ""}`
        : "";

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  const pathname = candidate.split(/[?#]/)[0];

  if (pathname === LOGIN_PATH) {
    return fallback;
  }

  return candidate;
}
