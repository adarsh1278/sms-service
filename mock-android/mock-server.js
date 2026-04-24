import express from "express";
import bonjour from "bonjour";

const PORT = 3000;
const SERVICE_NAME = "Mock Phone";
const SERVICE_TYPE = "smsbridge";
const API_KEY = "abc123";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", device: SERVICE_NAME });
});

app.post("/send-sms", (req, res) => {
  const { to, message, apiKey } = req.body || {};

  if (!to || !message) {
    return res.status(400).json({
      ok: false,
      error: "Missing 'to' or 'message'"
    });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({
      ok: false,
      error: "Invalid apiKey"
    });
  }

  console.log("SMS REQUEST:");
  console.log("To: " + to);
  console.log("Message: " + message);

  return res.json({
    ok: true,
    queued: true,
    to,
    message
  });
});

const server = app.listen(PORT, () => {
  console.log("Mock SMS server running at http://localhost:" + PORT);
});

const bonjourInstance = bonjour();
const service = bonjourInstance.publish({
  name: SERVICE_NAME,
  type: SERVICE_TYPE,
  port: PORT
});

service.on("up", () => {
  console.log("mDNS service published: Mock Phone");
});

function shutdown() {
  service.stop(() => {
    bonjourInstance.destroy();
    server.close(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);