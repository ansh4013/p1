
export default async function handler(req, res) {
  // ==========================================
  // NEXORA AI — OPENROUTER STREAMING BACKEND
  // ==========================================

  // CORS configuration
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

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "NEXORA: Method not allowed."
    });
  }

  // Get secret API key from Vercel
  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "NEXORA: OpenRouter API key is missing."
    });
  }

  const { message, history } = req.body || {};

  if (
    typeof message !== "string" ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: "NEXORA: Message is required."
    });
  }

  // ==========================================
  // NEXORA IDENTITY AND PERSONALITY
  // ==========================================

  const SYSTEM_PROMPT = `
You are NEXORA AI, an intelligent AI assistant
presented under the NEXORA brand.

BRAND IDENTITY:
- Your name is NEXORA AI.
- Your tagline is "Think Beyond. Create Beyond."
- You represent the NEXORA AI project.
- Communicate as NEXORA, not as NVIDIA Nemotron.
- Do not introduce yourself as NVIDIA or Nemotron.
- Do not falsely claim that you are an independently
  trained foundation model.
- If asked about your underlying model or provider,
  answer transparently and accurately.

PERSONALITY:
- Intelligent, professional, friendly and innovative.
- Natural and conversational.
- Confident without being arrogant.
- Explain difficult topics in simple language.
- Give accurate and useful answers.
- Avoid unnecessary repetition.

CAPABILITIES:
- Programming and software development.
- Education and learning.
- Research and explanations.
- Creative writing and brainstorming.
- Technology and general knowledge.
- Problem solving and productivity.

RESPONSE RULES:
- Answer the user's actual question.
- Use headings and lists when helpful.
- Provide complete code when requested.
- Never invent facts.
- If uncertain, say so.
- Never advertise the underlying model provider.
- Maintain the NEXORA AI identity throughout the conversation.

You are NEXORA AI.
Think Beyond. Create Beyond.
`;

  try {
    // ==========================================
    // PREPARE CONVERSATION HISTORY
    // ==========================================

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            item =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string"
          )
          .slice(-20)
          .map(item => ({
            role: item.role,
            content: item.content.slice(0, 12000)
          }))
      : [];

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      ...safeHistory,
      {
        role: "user",
        content: message.trim()
      }
    ];

    // ==========================================
    // OPENROUTER API REQUEST
    // ==========================================

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
          messages,
          temperature: 0.7,
          max_tokens: 1500
        })
      }
    );

    // ==========================================
    // HANDLE API ERRORS
    // ==========================================

    if (!upstream.ok) {
      const errorText = await upstream.text();

      console.error(
        "NEXORA OpenRouter Error:",
        upstream.status,
        errorText
      );

      if (upstream.status === 429) {
        return res.status(503).json({
          error: "NEXORA: Free AI request limit reached. Please try again shortly."
        });
      }

      if (upstream.status === 401) {
        return res.status(500).json({
          error: "NEXORA: API authentication failed. Check your Vercel API key."
        });
      }

      return res.status(502).json({
        error: "NEXORA: AI service is temporarily unavailable."
      });
    }

    if (!upstream.body) {
      return res.status(502).json({
        error: "NEXORA: Empty AI response."
      });
    }

    // ==========================================
    // STREAM RESPONSE TO FRONTEND
    // ==========================================

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

    const reader = upstream.body.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        if (res.destroyed) {
          await reader.cancel();
          return;
        }

        // Forward original OpenRouter SSE chunks
        res.write(Buffer.from(value));
      }

      if (!res.destroyed) {
        res.end();
      }

    } catch (streamError) {
      console.error(
        "NEXORA Streaming Error:",
        streamError
      );

      if (!res.destroyed) {
        res.write(
          'data: {"error":{"message":"NEXORA: Streaming interrupted."}}\n\n'
        );

        res.end();
      }

    } finally {
      reader.releaseLock();
    }

  } catch (error) {
    console.error(
      "NEXORA Internal Error:",
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
