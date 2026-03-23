import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";

interface UhmmLinkPayload {
  event: string;
  completedAt: string;
  projectId?: string;
  projectLabel?: string;
  stackId: string;
  stackLabel?: string;
  reviewerId: string;
  sessionId: string;
  reviewerName: string;
  scoresUrl: string;
  decisionsCount: number;
  approved: number;
  rejected: number;
  scores: Array<{
    cardId: string;
    content?: string;
    imageUrl?: string;
    decision: "approved" | "rejected";
    decidedAt: string;
    swipeTimeMs?: number | null;
  }>;
}

const uhmmLinkPlugin = {
  id: "uhmm-link",
  name: "uhmm.link",
  description: "Receives review.completed webhooks from uhmm.link",
  configSchema: {
    parse(value: unknown) {
      const raw =
        value && typeof value === "object" && !Array.isArray(value)
          ? (value as Record<string, unknown>)
          : {};
      return {
        enabled: typeof raw.enabled === "boolean" ? raw.enabled : true,
        webhookPath:
          typeof raw.webhookPath === "string"
            ? raw.webhookPath
            : "/uhmm-webhook",
        webhookAuth: raw.webhookAuth === "gateway" ? "gateway" : "plugin",
      };
    },
  },
  register(api: OpenClawPluginApi) {
    const config = uhmmLinkPlugin.configSchema.parse(api.pluginConfig);

    if (!config.enabled) {
      api.logger.info("[uhmm-link] plugin disabled");
      return;
    }

    api.registerHttpRoute({
      path: config.webhookPath,
      auth: config.webhookAuth as "plugin" | "gateway",
      match: "exact",
      handler: async (req, res) => {
        try {
          const body = await readRequestBody(req);

          const payload: UhmmLinkPayload = JSON.parse(body);

          if (payload.event !== "review.completed") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: "Expected event: review.completed" })
            );
            return true;
          }

          api.logger.info(
            `[uhmm-link] Review completed: ${payload.stackLabel || payload.stackId} by ${payload.reviewerName}`
          );
          api.logger.info(
            `[uhmm-link] Score: ${payload.approved}/${payload.approved + payload.rejected} approved`
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
          return true;
        } catch (err) {
          api.logger.error(
            `[uhmm-link] webhook error: ${err instanceof Error ? err.message : String(err)}`
          );
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal error" }));
          return true;
        }
      },
    });

    api.logger.info(
      `[uhmm-link] webhook registered at ${config.webhookPath}`
    );
  },
};

export default uhmmLinkPlugin;

async function readRequestBody(req: {
  [Symbol.asyncIterator]?: () => AsyncIterableIterator<Buffer | Uint8Array>;
}): Promise<string> {
  const chunks: Buffer[] = [];
  if (req[Symbol.asyncIterator]) {
    for await (const chunk of req as AsyncIterable<Buffer | Uint8Array>) {
      chunks.push(Buffer.from(chunk));
    }
  }
  return Buffer.concat(chunks).toString("utf-8");
}
