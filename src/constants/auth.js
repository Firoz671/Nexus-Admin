export const AUTH_STORAGE_KEY = "nexus-auth";

export const AUTH_UNAUTHORIZED_EVENT = "nexus:auth:unauthorized";

export const AUTH_STATUS = Object.freeze({
  IDLE: "idle",
  INITIALIZING: "initializing",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
});

export const LOGIN_PATH = "/login";
