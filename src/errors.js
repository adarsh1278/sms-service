const NETWORK_ERROR_CODES = new Set([
  "ECONNABORTED",
  "ECONNREFUSED",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH"
]);

export function shouldRetryRequest(error) {
  if (NETWORK_ERROR_CODES.has(error?.code)) {
    return true;
  }

  const status = error?.response?.status;
  return typeof status === "number" && status >= 500;
}

export function mapRequestError(error, action = "perform request", host = "configured device") {
  const status = error?.response?.status;
  const apiError = error?.response?.data?.error;
  const apiErrorSuffix = typeof apiError === "string" && apiError.trim().length > 0
    ? ` Details: ${apiError.trim()}`
    : "";

  if (NETWORK_ERROR_CODES.has(error?.code)) {
    return new Error(`Network timeout/reachability issue while trying to ${action} on ${host}.`);
  }

  if (status === 401 || status === 403) {
    return new Error(`Authentication failed while trying to ${action}. Check API key on Android app.${apiErrorSuffix}`);
  }

  if (status === 404) {
    return new Error(`Endpoint not found while trying to ${action}. Verify Android app routes and port.${apiErrorSuffix}`);
  }

  if (typeof status === "number") {
    return new Error(`Device responded with HTTP ${status} while trying to ${action}.${apiErrorSuffix}`);
  }

  if (error?.message?.includes("No device configured")) {
    return new Error("No device configured. Run 'sms-bridge connect' first.");
  }

  return new Error(`Failed to ${action}: ${error?.message || "Unknown error"}`);
}