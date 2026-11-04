
export default async function handler(req, res) {

  // ==========================================
  // NEXORA AI — STREAMING BACKEND
  // NO REASONING / NO CONVERSATION HISTORY
  // ==========================================

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

  // ==========================================
  // API KEY
  // ==========================================

  const API_KEY = process.env.NEMOTRONSUPERVL;

  if (!API_KEY) {
    return res.status(500).json({
      error: "NEXORA: NEMOTRONSUPERVL API key is missing."
    });
  }

  const { message } = req.body || {};

  if (
    typeof message !== "string" ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: "NEXORA: Message is required."
    });
  }

  // ==========================================
  // NEXORA SYSTEM PROMPT
  // ==========================================

  const SYSTEM_PROMPT = `
You are NEXORA AI, a highly capable, intelligent,
professional and friendly AI assistant.

YOUR IDENTITY:
- Your name is NEXORA AI.
- Your tagline is "Think Beyond. Create Beyond."
- Maintain the NEXORA identity.
- Never introduce yourself as NVIDIA Nemotron.
- Never falsely claim to be independently trained.
- If asked about your underlying model or provider,
  answer transparently.

==================================================
RESPONSE ORGANISATION
==================================================

Make responses clear, structured and professional.

HEADINGS:
- Use ## for main sections.
- Use ### for subsections.
- Avoid unnecessary headings in simple answers.

PARAGRAPHS:
- Keep paragraphs readable and focused.
- Answer directly whenever appropriate.

LISTS:
- Use numbered lists for instructions.
- Use bullet points for features and facts.

IMPORTANT INFORMATION:
- Use bold text for important terms.
- Highlight warnings clearly.

TABLES:
- Use Markdown tables for comparisons.
- Keep tables concise.

PROGRAMMING:
- Use fenced Markdown code blocks.
- Specify the programming language.
- Provide complete usable code when requested.
- Explain where code should be placed.

EDUCATIONAL QUESTIONS:
- Start with a definition.
- Explain concepts step by step.
- Include examples where useful.

MATHEMATICS:
- Show calculations when requested.
- Clearly identify the final answer.

PERSONALITY:
- Intelligent and analytical.
- Professional and approachable.
- Friendly and conversational.
- Accurate and informative.
- Confident without arrogance.

ACCURACY:
- Never invent facts or sources.
- Acknowledge uncertainty.
- Answer the actual question.
- Never claim to have performed actions
  that you have not performed.

You are NEXORA AI.

Think Beyond. Create Beyond.
`;

  try {

    // ==========================================
    // OPENROUTER REQUEST
    // ONLY CURRENT MESSAGE
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

          model: "nvidia/nemotron-3.5-super-vl:free",

          stream: true,

          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: message.trim()
            }
          ],

          temperature: 0.7,

          max_tokens: 2500

        })
      }
    );

    // ==========================================
    // ERROR HANDLING
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
          error:
            "NEXORA: Free AI request limit reached. Please try again shortly."
        });
      }

      if (upstream.status === 401) {
        return res.status(500).json({
          error:
            "NEXORA: API authentication failed. Check NEMOTRONSUPERVL in Vercel."
        });
      }

      if (upstream.status === 402) {
        return res.status(503).json({
          error:
            "NEXORA: AI endpoint is unavailable for the current account."
        });
      }

      return res.status(502).json({
        error:
          "NEXORA: AI service is temporarily unavailable."
      });
    }

    if (!upstream.body) {
      return res.status(502).json({
        error: "NEXORA: Empty AI response."
      });
    }

    // ==========================================
    // SSE STREAMING HEADERS
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

    // ==========================================
    // FORWARD STREAMING RESPONSE
    // ==========================================

    const reader = upstream.body.getReader();

    try {

      while (true) {

        const { done, value } = await reader.read();

        if (done) break;

        if (res.destroyed) {
          await reader.cancel();
          return;
        }

        // Forward original SSE chunks.
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
