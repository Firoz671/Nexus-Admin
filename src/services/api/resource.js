import { toDateRangeQueryParams } from "@/utils/dateRange";
import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";

export async function getDateRangeResource(path, range, fallbackMessage) {
  try {
    const response = await apiClient.get(path, {
      params: toDateRangeQueryParams(range),
    });
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
