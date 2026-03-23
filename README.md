# uhmm.link OpenClaw Plugin

OpenClaw plugin that receives `review.completed` webhooks from [uhmm.link](https://uhmm.link). When a reviewer finishes a card stack session, uhmm.link POSTs the results to your OpenClaw gateway.

## Installation

1. Install the plugin in your OpenClaw workspace (or clone this repo into your plugins directory).
2. Configure the gateway to accept external webhooks:
   ```bash
   openclaw config set gateway.bind 0.0.0.0
   openclaw gateway restart
   ```

3. In uhmm.link, set your **Callback URL** to:
   ```
   http://<openclaw-ip>:18789/uhmm-webhook
   ```
   Replace `<openclaw-ip>` with your machine's IP address.

## Config

| Option       | Default           | Description                          |
| ------------ | ----------------- | ------------------------------------ |
| `webhookPath`| `/uhmm-webhook`   | HTTP path for the webhook endpoint   |
| `webhookAuth`| `plugin`          | Auth mode: `plugin` or `gateway`     |
| `enabled`    | `true`            | Enable or disable the plugin         |

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
