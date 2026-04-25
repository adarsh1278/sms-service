import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import axios from "axios";

import { saveConfig, getConfigPath } from "./config.js";
import { discoverDevices } from "./discovery.js";

async function verifyHost(host) {
  const response = await axios.get(`http://${host}/health`, { timeout: 3000 });
  return {
    name: response.data?.device || "Manual Device",
    host
  };
}

export async function connectDevice() {
  console.log("Scanning local network for SMS bridge devices...");
  const devices = await discoverDevices();

  const rl = readline.createInterface({ input, output });

  try {
    if (!devices.length) {
      console.log("No devices found via mDNS.");
      console.log("Tip: Make sure phone and laptop are on same Wi-Fi, and app is advertising _simrelay._tcp.");

      const hostInput = await rl.question(
        "Enter phone host as IP:port (example 192.168.1.23:3000), or press Enter to cancel: "
      );
      const host = hostInput.trim();

      if (!host) {
        console.log("Connect cancelled.");
        return;
      }

      try {
        const selected = await verifyHost(host);
        saveConfig(selected);
        console.log(`Connected to ${selected.name}`);
        console.log(`Saved config at ${getConfigPath()}`);
      } catch {
        console.log("Could not reach /health on that host. Check IP/port and ensure app server is running.");
      }

      return;
    }

    console.log("\nAvailable devices:\n");
    devices.forEach((device, index) => {
      console.log(`${index + 1}. ${device.name} (${device.host})`);
    });

    const answer = await rl.question("\nSelect device number: ");
    const selected = devices[Number(answer) - 1];

    if (!selected) {
      console.log("Invalid selection.");
      return;
    }

    saveConfig(selected);
    console.log(`Connected to ${selected.name}`);
    console.log(`Saved config at ${getConfigPath()}`);
  } finally {
    rl.close();
  }
}