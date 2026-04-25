import axios from "axios";

import { getApiKey, readConfig } from "./config.js";
import { mapRequestError, shouldRetryRequest } from "./errors.js";
import { withRetries } from "./retry.js";

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
  const apiKey = getApiKey(activeConfig);
  try {
    const response = await withRetries(
      () =>
        httpClient.post(
          `http://${activeConfig.host}/send-sms`,
          {
            to,
            message,
            apiKey
          },
          {
            headers: {
              "x-api-key": apiKey
            },
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