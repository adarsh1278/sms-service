# sms-bridge

Send SMS from Node.js through your own Android phone over local Wi-Fi.

See [RUNNING.md](./RUNNING.md) for complete local run and test instructions.

## Features

- CLI commands: `connect`, `status`, `send`, `secret`
- mDNS discovery (`_smsbridge._tcp`)
- Local config persistence for reconnect-free usage
- SDK exports for programmatic integration

## Android App Download

- GitHub: https://github.com/YadavYashvant/Simrelay

## Install

```bash
npm install
npm test
```

For local CLI testing:

```bash
npm link
```

Then run:

```bash
sms-bridge connect
sms-bridge status
sms-bridge send --to "+91..." --msg "Hello"
sms-bridge secret set "sk_your_key"
```

Or via npx after publish:

```bash
npx sms-bridge connect
npx sms-bridge status
npx sms-bridge send --to "+91..." --msg "Hello"
npx sms-bridge secret set "sk_your_key"
```

## Change Secret (API Key)

```bash
sms-bridge secret set "sk_your_key"
sms-bridge secret show
sms-bridge secret reset
```

You can also set it from environment variable (highest priority):

```bash
SMS_BRIDGE_API_KEY="sk_your_key"
```

On Windows PowerShell:

```powershell
$env:SMS_BRIDGE_API_KEY="sk_your_key"
```

## Android App Requirements

1. Publish mDNS service:
- Type: `_smsbridge._tcp`
- Name: device name
- Port: `3000`

2. Expose APIs:

`POST /send-sms`

```json
{
  "to": "+91...",
  "message": "Hello",
  "apiKey": "abc123"
}
```

`GET /health`

```json
{
  "status": "ok",
  "device": "Adarsh Phone"
}
```

## Flow

1. `sms-bridge connect` scans local network and stores the selected device.
2. `sms-bridge status` checks health of the configured Android device.
3. `sms-bridge send` sends HTTP payload to Android app, which sends SMS using `SmsManager`.

## Troubleshooting

- Phone and laptop must be on the same network.
- Android app must be running foreground service.
- Port and mDNS type must match (`3000`, `_smsbridge._tcp`).
- Some networks block multicast/mDNS traffic.