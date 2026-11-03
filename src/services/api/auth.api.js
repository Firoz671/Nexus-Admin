import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export async function loginRequest(credentials) {
  const response = await apiClient.post(ENDPOINTS.auth.login, credentials);

  return response.data?.data;
}

export async function getCurrentUserRequest() {
  const response = await apiClient.get(ENDPOINTS.auth.me);

  return response.data?.data;
}

export async function logoutRequest() {
  await apiClient.post(ENDPOINTS.auth.logout);
}
