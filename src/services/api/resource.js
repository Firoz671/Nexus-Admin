import { toDateRangeQueryParams } from "@/utils/dateRange";
import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";

async function resolveResource(request, fallbackMessage) {
  try {
    const response = await request;
    const payload = response.data;

    if (!payload?.success || payload?.data == null) {
      throw new Error("The server returned an incomplete response.");
    }

    return payload.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, fallbackMessage), {
      cause: error,
    });
  }
}

export function getResource(path, params, fallbackMessage) {
  return resolveResource(
    apiClient.get(path, { params }),
    fallbackMessage,
  );
}

export function createResource(path, payload, fallbackMessage) {
  return resolveResource(
    apiClient.post(path, payload),
    fallbackMessage,
  );
}

export function updateResource(path, payload, fallbackMessage) {
  return resolveResource(
    apiClient.patch(path, payload),
    fallbackMessage,
  );
}

export function deleteResource(path, fallbackMessage) {
  return resolveResource(
    apiClient.delete(path),
    fallbackMessage,
  );
}

export async function getDateRangeResource(path, range, fallbackMessage) {
  return resolveResource(
    apiClient.get(path, {
      params: toDateRangeQueryParams(range),
    }),
    fallbackMessage,
  );
}
