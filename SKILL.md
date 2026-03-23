# uhmm.link Webhook Plugin

Receives review completion webhooks from uhmm.link. Use when integrating uhmm.link card review sessions with OpenClaw for notifications, logging, or downstream workflows.

## Quick Setup

1. **Gateway setup** (run once):
   ```bash
   openclaw config set gateway.bind 0.0.0.0
   openclaw gateway restart
   ```

2. **Webhook URL** for your uhmm.link project:
   ```
   http://<openclaw-ip>:18789/uhmm-webhook
   ```
   Replace `<openclaw-ip>` with your machine's IP (e.g. `192.168.1.100`) so uhmm.link can reach it.

3. **Configure uhmm.link**:
   - Project settings → **Callback URL** → paste the webhook URL above
   - Or: Account settings → **Callback URL** (applies to all projects)

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
