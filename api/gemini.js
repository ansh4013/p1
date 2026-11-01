
export default async function handler(req, res) {

  // =====================================
  // NEXORA CORS CONFIGURATION
  // =====================================

  const allowedOrigins = [
    "https://ansh4013.github.io"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "NEXORA: Method not supported."
    });
  }

  try {

    // =====================================
    // OPENROUTER CONFIGURATION
    // =====================================

    const API_KEY = process.env.OPENROUTER_API_KEY;

    const MODEL =
      "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";

    if (!API_KEY) {
      console.error("NEXORA: OpenRouter API key missing.");

      return res.status(500).json({
        error: "NEXORA: AI configuration is incomplete."
      });
    }

    // =====================================
    // VALIDATE USER MESSAGE
    // =====================================

    const { message } = req.body || {};

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "NEXORA: Please enter a message."
      });
    }

    // =====================================
    // OPENROUTER REQUEST FUNCTION
    // =====================================

    async function openRouterRequest(messages, reasoning = false) {

      const controller = new AbortController();

      const timeout = setTimeout(
        () => controller.abort(),
        60000
      );

      try {

        const response = await fetch(
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
              model: MODEL,
              messages: messages,

              ...(reasoning
                ? { reasoning: { enabled: true } }
                : {})
            }),

            signal: controller.signal
          }
        );

        const data = await response.json();

        if (!response.ok) {

          const error = new Error(
            data?.error?.message ||
            `OpenRouter error: ${response.status}`
          );

          error.status = response.status;

          throw error;
        }

        return data;

      } finally {
        clearTimeout(timeout);
      }
    }

    // =====================================
    // FIRST AI REQUEST WITH REASONING
    // =====================================

    console.log("NEXORA: Starting reasoning request.");

    const firstResult = await openRouterRequest(
      [
        {
          role: "user",
          content: message.trim()
        }
      ],
      true
    );

    const firstMessage =
      firstResult?.choices?.[0]?.message;

    if (!firstMessage) {
      throw new Error("Empty first AI response.");
    }

    // =====================================
    // PRESERVE REASONING DETAILS
    // =====================================

    const messages = [
      {
        role: "user",
        content: message.trim()
      },
      {
        role: "assistant",
        content: firstMessage.content || "",
        ...(firstMessage.reasoning_details
          ? {
              reasoning_details:
                firstMessage.reasoning_details
            }
          : {})
      },
      {
        role: "user",
        content: "Please review your answer carefully and provide the final, accurate response."
      }
    ];

    // =====================================
    // SECOND AI REQUEST
    // CONTINUE REASONING
    // =====================================

    console.log("NEXORA: Continuing reasoning.");

    const secondResult = await openRouterRequest(
      messages,
      false
    );

    const finalReply =
      secondResult?.choices?.[0]?.message?.content;

    // =====================================
    // VALIDATE FINAL RESPONSE
    // =====================================

    if (
      typeof finalReply !== "string" ||
      !finalReply.trim()
    ) {
      throw new Error("NEXORA received an empty final response.");
    }

    // =====================================
    // SUCCESS
    // =====================================

    console.log("NEXORA: AI response successful.");

    return res.status(200).json({
      reply: finalReply.trim(),
      model: MODEL,
      provider: "OpenRouter"
    });

  } catch (error) {

    // =====================================
    // ERROR HANDLING
    // =====================================

    console.error("NEXORA ERROR:", {
      status: error.status,
      message: error.message
    });

    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "NEXORA: AI response timed out. Please try again."
      });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(502).json({
        error: "NEXORA: AI authentication failed. Check API configuration."
      });
    }

    if (error.status === 429) {
      return res.status(503).json({
        error: "NEXORA: AI service is busy. Please try again shortly."
      });
    }

    return res.status(503).json({
      error: "NEXORA: AI is temporarily unavailable. Please try again."
    });

  }
}
