# uhmm.link Webhook Plugin

Receives review completion webhooks from uhmm.link. Use when integrating uhmm.link card review sessions with OpenClaw for notifications, logging, or downstream workflows.

## Quick Setup

1. **Install** (extensions directory):

   ```bash
   cd ~/.openclaw/extensions
   git clone https://github.com/uhmm-link/openclaw-plugin.git uhmm-link
   ```

2. **Gateway on LAN** (required if uhmm.link is not on the same host as OpenClaw):

   ```bash
   openclaw config set gateway.bind lan
   openclaw gateway restart
   ```

   Use bind **modes** (`lan`, etc.), not raw IPs like `0.0.0.0` — legacy host values are rejected.

3. **uhmm.link → OpenClaw:** In **uhmm.link** (hosted or local), not in OpenClaw, set **Callback URL** or **Webhook URL** in account/project settings to your gateway endpoint, e.g. `http://<gateway-host>:<gateway-port>/uhmm-webhook`. Port is often **18789** but confirm with your OpenClaw gateway config; path must match `webhookPath` (default `/uhmm-webhook`).

## Payload Format

When a reviewer completes a session, uhmm.link POSTs:

```json
{
  "event": "review.completed",
  "completedAt": "2026-03-22T...",
  "projectId": "...",
  "stackId": "...",
  "reviewerName": "...",
  "sessionId": "...",
  "scoresUrl": "http://...",
  "decisionsCount": 42,
  "approved": 30,
  "rejected": 12,
  "scores": [{ "cardId": "...", "content": "...", "decision": "approved", ... }]
}
```

## Config

- `webhookPath` — default `/uhmm-webhook`
- `webhookAuth` — `plugin` or `gateway`
- `enabled` — set to `false` to disable
