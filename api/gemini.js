import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {

  // =========================
  // CORS
  // =========================
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

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "NEXORA: This request method is not supported."
    });
  }

  try {

    // =========================
    // API KEY
    // =========================
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("NEXORA CONFIG ERROR: API key missing");

      return res.status(500).json({
        error:
          "NEXORA is temporarily unavailable. Please try again later."
      });
    }

    // =========================
    // MESSAGE
    // =========================
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "NEXORA: Please enter a message."
      });
    }

    const ai = new GoogleGenAI({
      apiKey
    });

    let lastError = null;

    // =========================
    // MAXIMUM 5 ATTEMPTS
    // 2 SECOND DELAY BETWEEN
    // FAILED ATTEMPTS
    // =========================
    for (let attempt = 1; attempt <= 5; attempt++) {

      try {

        console.log(
          `NEXORA request attempt ${attempt}/5`
        );

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: message
        });

        console.log(
          `NEXORA request succeeded on attempt ${attempt}`
        );

        return res.status(200).json({
          reply:
            response.text ||
            "NEXORA couldn't generate a response."
        });

      } catch (error) {

        lastError = error;

        console.error(
          `NEXORA internal attempt ${attempt}/5 failed:`,
          error?.message || error
        );

        // Don't wait after the final attempt
        if (attempt < 5) {
          await new Promise(resolve =>
            setTimeout(resolve, 2000)
          );
        }
      }
    }

    // =========================
    // ALL 5 ATTEMPTS FAILED
    // =========================
    console.error(
      "NEXORA INTERNAL ERROR: All 5 attempts failed",
      lastError?.message || lastError
    );

    return res.status(503).json({
      error:
        "NEXORA is temporarily unable to process your request. Please try again."
    });

  } catch (error) {

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