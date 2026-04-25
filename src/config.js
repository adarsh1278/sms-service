import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_FILE = path.join(os.homedir(), ".sms-bridge.json");
const DEFAULT_API_KEY = "sk_test_simrelay_8f92";

function readRawConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }

  const raw = fs.readFileSync(CONFIG_FILE, "utf8");
  return JSON.parse(raw);
}

export function getConfigPath() {
  return CONFIG_FILE;
}

export function getDefaultApiKey() {
  const envApiKey = process.env.SMS_BRIDGE_API_KEY?.trim();
  return envApiKey || DEFAULT_API_KEY;
}

export function saveConfig(config) {
  const normalized = {
    ...config,
    apiKey: config?.apiKey?.trim() || getDefaultApiKey()
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(normalized, null, 2), "utf8");
}

export function updateConfig(partial) {
  const current = readRawConfig();
  const merged = {
    ...current,
    ...partial
  };
  saveConfig(merged);
  return merged;
}

export function readConfig() {
  const config = readRawConfig();

  if (!config.host) {
    throw new Error(
      "No device configured. Run 'sms-bridge connect' before sending SMS."
    );
  }

  return config;
}

export function getApiKey(config) {
  return config?.apiKey?.trim() || getDefaultApiKey();
}