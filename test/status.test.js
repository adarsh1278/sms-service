import test from "node:test";
import assert from "node:assert/strict";

import { checkStatus } from "../src/status.js";

test("checkStatus returns true for healthy device", async () => {
  const logs = [];
  const logger = { log: (line) => logs.push(line) };
  const httpClient = {
    async get() {
      return {
        data: {
          status: "ok",
          device: "Adarsh Phone"
        }
      };
    }
  };

  const ok = await checkStatus({
    config: { host: "127.0.0.1:3000" },
    httpClient,
    logger
  });

  assert.equal(ok, true);
  assert.equal(logs.some((line) => line.includes("Connected:")), true);
});

test("checkStatus logs categorized failure and returns false", async () => {
  const logs = [];
  const logger = { log: (line) => logs.push(line) };
  const httpClient = {
    async get() {
      const error = new Error("Not Found");
      error.response = { status: 404 };
      throw error;
    }
  };

  const ok = await checkStatus({
    config: { host: "127.0.0.1:3000" },
    httpClient,
    logger
  });

  assert.equal(ok, false);
  assert.equal(logs.some((line) => line.includes("Endpoint not found")), true);
});