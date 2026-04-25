import {
  getApiKey,
  getConfigPath,
  getDefaultApiKey,
  updateConfig
} from "./config.js";

function maskSecret(secret) {
  if (!secret || secret.length < 8) {
    return "********";
  }

  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

export function setSecret(secret) {
  const value = secret?.trim();
  if (!value) {
    throw new Error("Secret cannot be empty.");
  }

  updateConfig({ apiKey: value });
  return value;
}

export function resetSecret() {
  const value = getDefaultApiKey();
  updateConfig({ apiKey: value });
  return value;
}

export function showSecret({ masked = true } = {}) {
  const secret = getApiKey();
  return {
    path: getConfigPath(),
    secret: masked ? maskSecret(secret) : secret
  };
}