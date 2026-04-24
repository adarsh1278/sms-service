import axios from "axios";

import { readConfig } from "./config.js";
import { mapRequestError } from "./errors.js";

export async function checkStatus({ config, httpClient = axios, logger = console } = {}) {
  try {
    const activeConfig = config || readConfig();
    const response = await httpClient.get(`http://${activeConfig.host}/health`, {
      timeout: 5000
    });

    logger.log(`Connected: ${response.data.device || "Unknown device"}`);
    logger.log(`Health: ${response.data.status || "ok"}`);
    return true;
  } catch (error) {
    const mapped = mapRequestError(error, "check device status");
    logger.log(`Status failed: ${mapped.message}`);
    return false;
  }
}