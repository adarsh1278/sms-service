import axios from "axios";

import { readConfig } from "./config.js";
import { mapRequestError, shouldRetryRequest } from "./errors.js";
import { withRetries } from "./retry.js";

const API_KEY = "abc123";

export async function sendSMS(
  { to, message },
  {
    config,
    httpClient = axios,
    retries = 2,
    retryDelayMs = 300
  } = {}
) {
  if (!to || !message) {
    throw new Error("Both 'to' and 'message' are required to send SMS.");
  }

  const activeConfig = config || readConfig();

  try {
    const response = await withRetries(
      () =>
        httpClient.post(
          `http://${activeConfig.host}/send-sms`,
          {
            to,
            message,
            apiKey: API_KEY
          },
          {
            timeout: 10000
          }
        ),
      {
        retries,
        delayMs: retryDelayMs,
        shouldRetry: shouldRetryRequest
      }
    );

    return response.data;
  } catch (error) {
    throw mapRequestError(error, "send SMS", activeConfig.host);
  }
}