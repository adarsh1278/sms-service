import bonjour from "bonjour";

export function discoverDevices(timeout = 3000) {
  return new Promise((resolve) => {
    const discovered = new Map();
    const bonjourInstance = bonjour();
    const browser = bonjourInstance.find({ type: "smsbridge" });

    browser.on("up", (service) => {
      const host =
        service.addresses?.find((address) => address.includes(".")) ||
        service.host ||
        "";

      if (!host || !service.port) {
        return;
      }

      const key = `${host}:${service.port}`;
      discovered.set(key, {
        name: service.name,
        host: key
      });
    });

    setTimeout(() => {
      browser.stop();
      bonjourInstance.destroy();
      resolve(Array.from(discovered.values()));
    }, timeout);
  });
}