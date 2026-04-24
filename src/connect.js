import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

import { saveConfig, getConfigPath } from "./config.js";
import { discoverDevices } from "./discovery.js";

export async function connectDevice() {
  console.log("Scanning local network for SMS bridge devices...");
  const devices = await discoverDevices();

  if (!devices.length) {
    console.log("No devices found. Make sure the Android app is running on the same Wi-Fi.");
    return;
  }

  console.log("\nAvailable devices:\n");
  devices.forEach((device, index) => {
    console.log(`${index + 1}. ${device.name} (${device.host})`);
  });

  const rl = readline.createInterface({ input, output });

  try {
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