import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_FILE = path.join(os.homedir(), ".sms-bridge.json");

export function getConfigPath() {
  return CONFIG_FILE;
}

export function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

export function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error(
      "No device configured. Run 'sms-bridge connect' before sending SMS."
    );
  }

  const raw = fs.readFileSync(CONFIG_FILE, "utf8");
  return JSON.parse(raw);
}