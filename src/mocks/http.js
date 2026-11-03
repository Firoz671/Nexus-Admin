import { HttpResponse } from "msw";
import { findAccountByToken } from "./data/users";

export const MOCK_DELAY = import.meta.env.MODE === "test" ? 0 : 300;

export function errorResponse(status, message) {
  return HttpResponse.json(
    {
      success: false,
      message,
      data: null,
    },
    { status },
  );
}

export function successResponse(message, data, status = 200) {
  return HttpResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function getBearerToken(request) {
  const header = request.headers.get("Authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export function getAuthenticatedAccount(request) {
  const token = getBearerToken(request);

  return token ? findAccountByToken(token) : null;
}
