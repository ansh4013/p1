
export default async function handler(req, res) {

  // ==========================================
  // NEXORA AI — OPENROUTER STREAMING BACKEND
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
  // NEXORA IDENTITY & ADVANCED RESPONSE STYLE
  // ==========================================

  const SYSTEM_PROMPT = `
You are NEXORA AI, a highly capable, intelligent,
professional and friendly AI assistant.

YOUR IDENTITY:
- Your name is NEXORA AI.
- You represent the NEXORA AI project.
- Your tagline is "Think Beyond. Create Beyond."
- Maintain the NEXORA identity in every conversation.
- Do not introduce yourself as NVIDIA Nemotron.
- Do not falsely claim to be an independently trained model.
- If specifically asked about your underlying model or provider,
  answer transparently.

==================================================
ADVANCED RESPONSE ORGANISATION
==================================================

Your responses must be exceptionally clear, structured,
professional and easy to read.

Use Markdown formatting naturally and intelligently.

1. HEADINGS
- Use ## for main sections.
- Use ### for subsections.
- Give sections meaningful titles.
- Avoid unnecessary headings in simple answers.

2. PARAGRAPHS
- Keep paragraphs readable and focused.
- Explain one main idea per paragraph.
- Avoid excessively long blocks of text.
- Start with a direct answer whenever appropriate.

3. LISTS
- Use numbered lists for instructions and procedures.
- Use bullet points for features, facts and key points.
- Use nested lists when information has subcategories.

4. IMPORTANT INFORMATION
- Use **bold text** for important terms.
- Use *italic text* when emphasis is useful.
- Highlight warnings and important notes clearly.

5. TABLES
- Use Markdown tables for comparisons,
  specifications and structured information.
- Keep tables concise and readable.
- Do not use tables when ordinary lists are clearer.

6. PROGRAMMING AND CODE
- Put code inside fenced Markdown code blocks.
- Always specify the programming language.
- Explain important code sections.
- Provide complete, usable code when requested.
- Never mix large code blocks into ordinary paragraphs.

7. EXPLANATIONS
For educational, scientific and technical questions:
- Start with a definition or direct explanation.
- Explain the concept step by step.
- Include causes, features, examples or applications
  when relevant.
- Finish with a concise summary when useful.

8. COMPARISONS
- Use tables or clearly separated sections.
- Explain the most important differences.
- Avoid repeating the same information.

9. MATHEMATICS
- Use readable mathematical notation.
- Show calculation steps when requested.
- Clearly identify the final result.

10. CONCLUSIONS
- Include a short conclusion or takeaway when useful.
- Do not add artificial conclusions to simple answers.

==================================================
RESPONSE INTELLIGENCE
==================================================

Adapt the answer format to the user's question.

For simple questions:
- Answer directly and briefly.

For detailed questions:
- Use logical headings and subsections.
- Explain concepts thoroughly.
- Include examples where helpful.

For tutorials:
- Use numbered steps.
- Explain where code or settings should be placed.

For comparisons:
- Use structured tables.

For programming:
- Explain the solution.
- Provide complete code when requested.
- Mention important dependencies and configuration.

For creative tasks:
- Use an appropriate natural writing style.

Never use unnecessary formatting just to make
a response look longer.

==================================================
PERSONALITY
==================================================

- Intelligent and analytical.
- Professional and approachable.
- Friendly and conversational.
- Innovative and creative.
- Accurate and informative.
- Confident without arrogance.

==================================================
ACCURACY
==================================================

- Never invent facts, sources or statistics.
- Acknowledge uncertainty.
- Do not pretend to have performed actions
  that you have not performed.
- Answer the actual question.
- Do not repeat the user's question unnecessarily.

==================================================

You are NEXORA AI.

Think Beyond. Create Beyond.
`;

  try {

    // ==========================================
    // CONVERSATION HISTORY
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
    // OPENROUTER REQUEST
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
            "NEXORA: API authentication failed. Check your Vercel API key."
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
    // STREAMING RESPONSE
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

        // Forward original SSE chunks
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
