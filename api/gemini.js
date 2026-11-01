
export default async function handler(req, res) {

  // CORS
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://ansh4013.github.io"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "NEXORA: Method not allowed."
    });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "NEXORA: OpenRouter API key is missing."
    });
  }

  const { message } = req.body || {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "NEXORA: Message is required."
    });
  }

  try {

    // OPENROUTER STREAM REQUEST
    const upstream = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ansh4013.github.io",
          "X-Title": "NEXORA AI"
        },

        body: JSON.stringify({
          model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",

          stream: true,

          messages: [
            {
              role: "user",
              content: message.trim()
            }
          ]
        })
      }
    );

    // HANDLE UPSTREAM ERRORS
    if (!upstream.ok) {
      const errorText = await upstream.text();

      console.error(
        "NEXORA OpenRouter error:",
        upstream.status,
        errorText
      );

      return res.status(
        upstream.status === 429 ? 503 : 502
      ).json({
        error: upstream.status === 429
          ? "NEXORA: AI rate limit reached. Try again shortly."
          : "NEXORA: AI provider is temporarily unavailable."
      });
    }

    if (!upstream.body) {
      return res.status(502).json({
        error: "NEXORA: Empty streaming response."
      });
    }

    // STREAM HEADERS
    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "text/event-stream; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    res.flushHeaders?.();

    // FORWARD STREAM CHUNKS
    const reader = upstream.body.getReader();

    try {
      while (true) {

        const { done, value } = await reader.read();

        if (done) break;

        if (res.destroyed) {
          await reader.cancel();
          return;
        }

        res.write(Buffer.from(value));
      }

      if (!res.destroyed) {
        res.end();
      }

    } catch (streamError) {

      console.error(
        "NEXORA stream error:",
        streamError
      );

      if (!res.destroyed) {
        res.write(
          'data: {"error":{"message":"NEXORA stream interrupted"}}\n\n'
        );
        res.end();
      }

    } finally {
      reader.releaseLock();
    }

  } catch (error) {

    console.error(
      "NEXORA INTERNAL ERROR:",
      error
    );

    if (!res.headersSent) {
      return res.status(503).json({
        error: "NEXORA: AI temporarily unavailable."
      });
    }

    if (!res.destroyed) {
      res.end();
    }
  }
}
