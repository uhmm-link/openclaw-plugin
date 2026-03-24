# uhmm.link OpenClaw Plugin

OpenClaw plugin that receives `review.completed` webhooks from [uhmm.link](https://uhmm.link). When a reviewer finishes a card stack session, uhmm.link POSTs the results to your OpenClaw gateway. After responding to uhmm.link, the plugin calls **`api.notifyAgent`** so the agent gets a visible message (not only gateway logs). Set `notifyAgent` to `false` in plugin config if your gateway does not implement `notifyAgent`.

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

3. **Tell uhmm.link where to send webhooks** (this is **not** set inside OpenClaw).

   OpenClaw only **listens** for POSTs; uhmm.link **calls** that URL when a review finishes. Configure that in **uhmm.link itself**—whether you use the hosted app or a **local / self-hosted** uhmm.link instance:

   - Open **account** or **project** settings in that uhmm.link deployment.
   - Find the field named **Callback URL** or **Webhook URL** (wording depends on the screen).
   - Set it to your gateway’s webhook endpoint, using the host where OpenClaw’s gateway runs and the path this plugin registers (default `/uhmm-webhook`).

   Example (replace host, port, and path if yours differ):

   ```
   http://<gateway-host>:<gateway-port>/uhmm-webhook
   ```

   **Port:** OpenClaw often defaults the gateway HTTP port to **18789**, but it is **not guaranteed**—your install may override it. Check your OpenClaw config or docs (e.g. `openclaw config` / `gateway.port` or equivalent) and use whatever port your gateway actually listens on.

   **Host:** If uhmm.link runs on another device, use the LAN IP of the machine running OpenClaw (e.g. `192.168.1.70`), not `localhost`, unless both run on the same host.

## Troubleshooting

| Symptom | Likely cause | Fix |
| -------- | -------------- | ----- |
| Webhook never arrives; nothing in gateway logs | Gateway bound to localhost only | `openclaw config set gateway.bind lan` then `openclaw gateway restart` |
| Connection refused or wrong port | Callback/Webhook URL port ≠ gateway port | Confirm gateway port in OpenClaw config; many installs use **18789** by default |
| Config error about “host aliases” / legacy bind | Used `0.0.0.0` or similar | Use `lan` (or another supported mode) instead |
| Log says `notifyAgent` unavailable | Older gateway / API mismatch | Set `notifyAgent: false` or upgrade OpenClaw; agent notification is optional |

## Config

| Option            | Default             | Description |
| ----------------- | ------------------- | ----------- |
| `webhookPath`     | `/uhmm-webhook`     | HTTP path for the webhook endpoint |
| `webhookAuth`     | `plugin`            | Auth mode: `plugin` or `gateway` |
| `enabled`         | `true`              | Enable or disable the plugin |
| `notifyAgent`     | `true`              | Call `api.notifyAgent` after each successful webhook |
| `agentSessionKey` | `agent:main:main`   | Session key for `notifyAgent` (adjust per OpenClaw docs) |

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
