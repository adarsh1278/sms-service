# Running This Repository

This guide explains how to run and test the `sms-bridge` package locally.

## 1. Install dependencies

```bash
npm install
```

## 2. Run CLI directly

```bash
node ./bin/cli.js
node ./bin/cli.js connect
node ./bin/cli.js status
node ./bin/cli.js send --to "+91..." --msg "Hello"
```

Local shortcut via npm script:

```bash
npm run sms -- connect
npm run sms -- status
npm run sms -- send --to "+91..." --msg "Hello"
npm run sms -- secret set "sk_your_key"
```

## 3. Use command as `sms-bridge`

Link the package globally in your local machine:

```bash
npm link
```

Then run:

```bash
sms-bridge connect
sms-bridge status
sms-bridge send --to "+91..." --msg "Hello"

# short alias (added):
sms connect
sms status
sms send --to "+91..." --msg "Hello"
sms secret set "sk_your_key"
```

## 4. Run tests

```bash
npm test
```

## 5. Publish and use via npx (optional)

After publishing to npm:

```bash
npx sms-bridge connect
npx sms-bridge status
npx sms-bridge send --to "+91..." --msg "Hello"
npx sms-bridge secret set "sk_your_key"
```

## 6. Publish to npm

```bash
npm login
npm version patch
npm publish --access public
```

If package name is already taken, update the `name` field in `package.json` first.

## 7. Android app

- Download app/source: https://github.com/YadavYashvant/Simrelay

## Android app checklist

- Phone and laptop are on the same Wi-Fi.
- Android foreground service is running.
- mDNS service type is `_smsbridge._tcp` on port `3000`.
- APIs exist: `POST /send-sms`, `GET /health`.