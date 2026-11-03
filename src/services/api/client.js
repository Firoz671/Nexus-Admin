import axios from "axios";
import { AUTH_UNAUTHORIZED_EVENT } from "@/constants/auth";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";
import { getApiErrorMessage } from "./errors";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  const isLoginRequest = config.url?.endsWith(ENDPOINTS.auth.login);

  if (
    !isLoginRequest &&
    typeof accessToken === "string" &&
    accessToken.trim()
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";
    const isLoginRequest = requestUrl.endsWith(ENDPOINTS.auth.login);

    if (status === 401 && !isLoginRequest) {
      const { accessToken, clearAuth } = useAuthStore.getState();

      if (accessToken) {
        clearAuth();
        useAuthStore.persist.clearStorage();
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    error.userMessage = getApiErrorMessage(error);

    return Promise.reject(error);
  },
);
