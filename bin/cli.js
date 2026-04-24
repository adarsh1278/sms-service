#!/usr/bin/env node

import { connectDevice } from "../src/connect.js";
import { sendSMS } from "../src/client.js";
import { checkStatus } from "../src/status.js";

function printUsage() {
  console.log(`
Usage:
  sms-bridge connect
  sms-bridge status
  sms-bridge send --to "+91..." --msg "Hello"

Also supported:
  sms-bridge send <number> <message>
`);
}

function parseSendArgs(args) {
  if (args.length >= 2 && !args[0].startsWith("-")) {
    return { to: args[0], message: args.slice(1).join(" ") };
  }

  let to = "";
  let message = "";

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--to") {
      to = args[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--msg") {
      message = args[i + 1] || "";
      i += 1;
    }
  }

  return { to, message };
}

const cmd = process.argv[2];

try {
  if (cmd === "connect") {
    await connectDevice();
    process.exit(0);
  }

  if (cmd === "status") {
    await checkStatus();
    process.exit(0);
  }

  if (cmd === "send") {
    const { to, message } = parseSendArgs(process.argv.slice(3));

    if (!to || !message) {
      console.log("Usage: sms-bridge send --to \"+91...\" --msg \"Hello\"");
      console.log("Or: sms-bridge send <number> <message>");
      process.exit(1);
    }

    const response = await sendSMS({ to, message });
    console.log("SMS response:", response);
    process.exit(0);
  }

  printUsage();
  process.exit(1);
} catch (error) {
  const message = error?.message || "Unknown error";
  console.error("Error:", message);
  process.exit(1);
}