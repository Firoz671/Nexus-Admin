const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. Please try again in a moment.";

export function getApiErrorMessage(error, fallback = DEFAULT_ERROR_MESSAGE) {
  if (!error) {
    return fallback;
  }

  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  const status = error.response?.status;

  if (status === 400) {
    return "The request could not be completed. Check your details and try again.";
  }

  if (status === 401) {
    return "Your session is invalid or has expired. Please sign in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource could not be found.";
  }

  if (status >= 500) {
    return "The server could not complete the request. Please try again.";
  }

  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (error.isAxiosError) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  return fallback;
}
