import bonjour from "bonjour";

const SERVICE_TYPES = ["simrelay", "smsbridge"];

function isIPv4(address) {
  return typeof address === "string" && /^\d{1,3}(\.\d{1,3}){3}$/.test(address);
}

function getServiceHost(service) {
  const ipv4FromAddresses = service.addresses?.find((address) => isIPv4(address));
  if (ipv4FromAddresses) {
    return ipv4FromAddresses;
  }

  if (isIPv4(service.referer?.address)) {
    return service.referer.address;
  }

  if (typeof service.host === "string" && service.host.trim()) {
    return service.host.replace(/\.$/, "");
  }

  return "";
}

export function discoverDevices(timeout = 3000) {
  return new Promise((resolve) => {
    const discovered = new Map();
    const bonjourInstance = bonjour();
    const browsers = [];

    const onServiceUp = (service) => {
      const host = getServiceHost(service);

      if (!host || !service.port) {
        return;
      }

      const key = `${host}:${service.port}`;
      discovered.set(key, {
        name: service.name,
        host: key
      });
    };

    SERVICE_TYPES.forEach((type) => {
      const browser = bonjourInstance.find({ type });
      browser.on("up", onServiceUp);
      browsers.push(browser);
    });

    setTimeout(() => {
      browsers.forEach((browser) => browser.stop());
      bonjourInstance.destroy();
      resolve(Array.from(discovered.values()));
    }, timeout);
  });
}