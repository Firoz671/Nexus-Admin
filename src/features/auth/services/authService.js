import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
} from "@/services/api/auth.api";
import { getApiErrorMessage } from "@/services/api/errors";

function normalizeSession(payload) {
  if (!payload?.accessToken || !payload?.user) {
    throw new Error("The authentication response was incomplete.");
  }

  return {
    accessToken: payload.accessToken,
    user: payload.user,
  };
}

export async function login(credentials) {
  try {
    const payload = await loginRequest(credentials);

    return normalizeSession(payload);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to sign in. Please try again."),
      { cause: error },
    );
  }
}

export async function getCurrentUser() {
  try {
    const payload = await getCurrentUserRequest();

    if (!payload?.user) {
      throw new Error("The current user response was incomplete.");
    }

    return payload.user;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to restore your session."),
      { cause: error },
    );
  }
}

export async function logout() {
  try {
    await logoutRequest();
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to reach the mock logout endpoint."),
      { cause: error },
    );
  }
}
