# sms-bridge

Send SMS directly from Node.js using your own Android phone over local Wi-Fi — no third-party SMS APIs, no cost, full control.

---
### NPM
https://www.npmjs.com/package/sms-bridge

## 🚀 Overview

`sms-bridge` is a CLI + SDK that allows you to send SMS messages through your Android device over a local network.

Instead of using paid services like Twilio, this tool:
- Uses your phone's SIM card
- Communicates over local Wi-Fi
- Requires a lightweight Android app running on your device

---

## ✨ Features

- Zero-cost SMS (uses your SIM)
- Works over local network (LAN)
- Automatic device discovery via mDNS (`_smsbridge._tcp`)
- CLI + SDK support
- API key authentication
- Persistent device connection
- No internet required

---

## 🏗 Architecture

```
Node.js CLI / SDK
        ↓ (HTTP over LAN)
Android App (Local Server)
        ↓
Android SmsManager → Sends SMS
```

---

## 📲 Android App (Required)

You must install and run the Android companion app.

### Download APK
https://github.com/adarsh1278/sms-service/releases

### Android App Source Code
https://github.com/YadavYashvant/Simrelay

---

## 📦 Installation

### Global install (recommended)

```bash
npm install -g sms-bridge
```

### Or use with npx

```bash
npx sms-bridge connect
```

---

## ⚡ Quick Start

### 1. Connect to your Android device

```bash
sms-bridge connect
```

### 2. Check connection status

```bash
sms-bridge status
```

### 3. Send an SMS

```bash
sms-bridge send --to "+919876543210" --msg "Hello from Node.js"
```

### 4. Set API key (required)

```bash
sms-bridge secret set "sk_your_key"
```

---

## 🔐 API Key Management

### Set key

```bash
sms-bridge secret set "sk_your_key"
```

### Show key

```bash
sms-bridge secret show
```

### Reset key

```bash
sms-bridge secret reset
```

### Environment Variable (Preferred)

```bash
SMS_BRIDGE_API_KEY="sk_your_key"
```

### Windows PowerShell

```powershell
$env:SMS_BRIDGE_API_KEY="sk_your_key"
```

---

## 💻 CLI Commands

* `sms-bridge connect` → Discover and connect to device
* `sms-bridge status` → Check device health
* `sms-bridge send` → Send SMS
* `sms-bridge secret set` → Set API key
* `sms-bridge secret show` → Show API key
* `sms-bridge secret reset` → Reset API key

---

## 🧠 How It Works

1. CLI scans network using mDNS (`_smsbridge._tcp`)
2. User selects a device
3. Device details are stored locally
4. CLI sends HTTP request to Android app
5. Android app sends SMS using native `SmsManager`

---

## 🔌 SDK Usage (Programmatic)

```js
import { sendSMS } from "sms-bridge";

await sendSMS({
  to: "+91xxxxxxx",
  message: "Hello from code"
});
```

---

## 📡 Android App Requirements

If you are building your own Android app:

### 1. mDNS Service

* Type: `_smsbridge._tcp`
* Port: `3000`
* Name: Device name

### 2. API Endpoints

#### POST `/send-sms`

```json
{
  "to": "+919876543210",
  "message": "Hello",
  "apiKey": "sk_your_key"
}
```

#### GET `/health`

```json
{
  "status": "ok",
  "device": "My Android Phone"
}
```

---

## 🧪 Local Development

Clone the repo:

```bash
git clone https://github.com/adarsh1278/sms-service
cd sms-service
npm install
```

### Run CLI locally

```bash
npm link
sms-bridge connect
```

### Run mock Android server

```bash
npm run mock
```

---

## ⚠️ Troubleshooting

### Device not found

* Ensure phone and laptop are on same Wi-Fi
* Restart router if needed
* Check mDNS is not blocked

### SMS not sending

* Check SMS permissions on Android
* Ensure app is running
* Verify API key

### Connection issues

* Ensure port `3000` is open
* Disable firewall if needed

---

## 📌 Limitations

* Only works on local network
* Requires Android device
* Depends on network reliability

---

## 🚀 Future Improvements

* Auto APK install via CLI
* QR-based pairing
* Multi-device support
* Web dashboard

---

## 👨‍💻 Developers

* Adarsh portfolio: [adarsh1278.vercel.app](https://adarsh1278.vercel.app/)
* Yashvant portfolio: [yashvant.tech](https://www.yashvant.tech/)
* Cloud fallback

---

## 👨‍💻 Author

Adarsh Tiwari
[https://github.com/adarsh1278](https://github.com/adarsh1278)

---

## 🤝 Credits

Android App Base:
[https://github.com/YadavYashvant/Simrelay](https://github.com/YadavYashvant/Simrelay)

---

## 📄 License

MIT License
