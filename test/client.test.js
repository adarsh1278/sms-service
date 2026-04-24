import test from "node:test";
import assert from "node:assert/strict";

import { sendSMS } from "../src/client.js";

test("sendSMS posts payload and returns response data", async () => {
  const calls = [];
  const httpClient = {
    async post(url, payload) {
      calls.push({ url, payload });
      return { data: { ok: true, id: "msg_1" } };
    }
  };

  const result = await sendSMS(
    { to: "+911234567890", message: "Hello" },
    {
      config: { host: "127.0.0.1:3000" },
      httpClient
    }
  );

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "http://127.0.0.1:3000/send-sms");
  assert.equal(calls[0].payload.to, "+911234567890");
  assert.equal(calls[0].payload.message, "Hello");
});

test("sendSMS retries transient network failures", async () => {
  let attempts = 0;
  const httpClient = {
    async post() {
      attempts += 1;
      if (attempts < 3) {
        const error = new Error("Connection reset");
        error.code = "ECONNREFUSED";
        throw error;
      }
      return { data: { ok: true } };
    }
  };

  const result = await sendSMS(
    { to: "+911234567890", message: "Hello" },
    {
      config: { host: "127.0.0.1:3000" },
      httpClient,
      retries: 2,
      retryDelayMs: 0
    }
  );

  assert.equal(result.ok, true);
  assert.equal(attempts, 3);
});

test("sendSMS maps auth error with clear message", async () => {
  const httpClient = {
    async post() {
      const error = new Error("Forbidden");
      error.response = { status: 403 };
      throw error;
    }
  };

  await assert.rejects(
    () =>
      sendSMS(
        { to: "+911234567890", message: "Hello" },
        {
          config: { host: "127.0.0.1:3000" },
          httpClient,
          retries: 0
        }
      ),
    /Authentication failed/
  );
});