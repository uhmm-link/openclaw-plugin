# uhmm.link OpenClaw Plugin

OpenClaw plugin that receives `review.completed` webhooks from [uhmm.link](https://uhmm.link). When a reviewer finishes a card stack session, uhmm.link POSTs the results to your OpenClaw gateway.

## Installation

1. **Install the plugin** in your OpenClaw extensions directory:

   ```bash
   cd ~/.openclaw/extensions
   git clone https://github.com/uhmm-link/openclaw-plugin.git uhmm-link
   ```

   Enable or register the plugin per your OpenClaw version’s extension docs (if required after clone).

2. **Let the gateway accept webhooks from other devices on your LAN** (run once):

   ```bash
   openclaw config set gateway.bind lan
   openclaw gateway restart
   ```

   By default the gateway often binds to loopback only, so uhmm.link on another machine cannot reach it. The `lan` mode listens on all interfaces so devices on your network can POST to the gateway.

   Do **not** use a raw host like `0.0.0.0` for `gateway.bind` — OpenClaw expects bind **modes** (`lan`, `loopback`, `custom`, `tailnet`, `auto`). Using a legacy host alias can error with: *gateway.bind host aliases are legacy; use bind modes*.

3. **In uhmm.link**, set your **Callback URL** to:

   ```
   http://<openclaw-host-ip>:18789/uhmm-webhook
   ```

   Replace `<openclaw-host-ip>` with the machine where OpenClaw runs (e.g. `192.168.1.70`).

## Troubleshooting

| Symptom | Likely cause | Fix |
| -------- | -------------- | ----- |
| Webhook never arrives; nothing in gateway logs | Gateway bound to localhost only | `openclaw config set gateway.bind lan` then `openclaw gateway restart` |
| Config error about “host aliases” / legacy bind | Used `0.0.0.0` or similar | Use `lan` (or another supported mode) instead |

## Config

| Option        | Default           | Description                          |
| ------------- | ----------------- | ------------------------------------ |
| `webhookPath` | `/uhmm-webhook`   | HTTP path for the webhook endpoint   |
| `webhookAuth` | `plugin`          | Auth mode: `plugin` or `gateway`     |
| `enabled`     | `true`            | Enable or disable the plugin         |

## Payload

uhmm.link sends a JSON payload like:

```json
{
  "event": "review.completed",
  "completedAt": "2026-03-22T12:00:00.000Z",
  "projectId": "abc",
  "projectLabel": "My Project",
  "stackId": "xyz",
  "stackLabel": "Stack #1",
  "reviewerId": "...",
  "sessionId": "...",
  "reviewerName": "Alice",
  "scoresUrl": "http://...",
  "decisionsCount": 42,
  "approved": 30,
  "rejected": 12,
  "scores": [
    {
      "cardId": "...",
      "content": "...",
      "decision": "approved",
      "decidedAt": "...",
      "swipeTimeMs": 1200
    }
  ]
}
```

## License

MIT
