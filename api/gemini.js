import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // ==========================================
  // CORS
  // ==========================================

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

  // ==========================================
  // OPTIONS
  // ==========================================

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ==========================================
  // METHOD CHECK
  // ==========================================

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "NEXORA: This request method is not supported."
    });
  }

  try {
    // ==========================================
    // GET 5 GEMINI API KEYS
    // ==========================================

    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5
    ].filter(
      key => key && key.trim()
    );

    // ==========================================
    // CHECK KEYS
    // ==========================================

    if (apiKeys.length === 0) {
      console.error(
        "NEXORA ERROR: No Gemini API keys configured."
      );

      return res.status(500).json({
        error:
          "NEXORA is temporarily unavailable. Please try again later."
      });
    }

    console.log(
      `NEXORA: ${apiKeys.length} Gemini API key(s) configured.`
    );

    // ==========================================
    // GET MESSAGE
    // ==========================================

    const { message } = req.body || {};

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error:
          "NEXORA: Please enter a message."
      });
    }

    // ==========================================
    // SETTINGS
    // ==========================================

    const MAX_ATTEMPTS = 10;
    const DELAY_MS = 1000;

    let lastError = null;

    // ==========================================
    // RETRY LOOP
    // ==========================================

    for (
      let attempt = 1;
      attempt <= MAX_ATTEMPTS;
      attempt++
    ) {

      // Rotate through the 5 keys
      const keyIndex =
        (attempt - 1) % apiKeys.length;

      const apiKey = apiKeys[keyIndex];

      try {

        console.log(
          `NEXORA attempt ${attempt}/${MAX_ATTEMPTS}`
        );

        console.log(
          `NEXORA using Gemini key ${keyIndex + 1}`
        );

        // ======================================
        // CREATE GEMINI CLIENT
        // ======================================

        const gemini = new GoogleGenAI({
          apiKey: apiKey
        });

        // ======================================
        // GEMINI REQUEST
        // ======================================

        const response =
          await gemini.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message.trim()
          });

        // ======================================
        // GET RESPONSE
        // ======================================

        const reply =
          response.text || "";

        // ======================================
        // EMPTY RESPONSE
        // ======================================

        if (!reply.trim()) {
          throw new Error(
            "Gemini returned an empty response."
          );
        }

        // ======================================
        // SUCCESS
        // ======================================

        console.log(
          `NEXORA SUCCESS: attempt ${attempt}/${MAX_ATTEMPTS}`
        );

        return res.status(200).json({
          reply: reply.trim()
        });

      } catch (error) {

        lastError = error;

        const status =
          error?.status ||
          error?.code ||
          error?.response?.status ||
          null;

        console.error(
          `NEXORA attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
          {
            status: status,
            message:
              error?.message ||
              String(error)
          }
        );

        // ======================================
        // STOP FOR PERMANENT ERRORS
        // ======================================

        if (
          status === 400 ||
          status === 401 ||
          status === 403 ||
          status === 404
        ) {
          console.error(
            "NEXORA: Permanent Gemini error. Stopping."
          );

          break;
        }

        // ======================================
        // WAIT 1 SECOND
        // ======================================

        if (
          attempt < MAX_ATTEMPTS
        ) {

          console.log(
            "NEXORA: Waiting 1 second before retry..."
          );

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                DELAY_MS
              )
          );
        }
      }
    }

    // ==========================================
    // ALL ATTEMPTS FAILED
    // ==========================================

    console.error(
      "NEXORA: All Gemini attempts failed.",
      lastError?.message ||
      lastError
    );

    return res.status(503).json({
      error:
        "NEXORA is temporarily unable to process your request. Please try again."
    });

  } catch (error) {

    // ==========================================
    // INTERNAL ERROR
    // ==========================================

    console.error(
      "NEXORA INTERNAL ERROR:",
      error
    );

    return res.status(500).json({
      error:
        "NEXORA encountered a temporary problem. Please try again."
    });
  }
}