
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
      error: "Only POST requests are allowed"
    });
  }

  try {

    // =========================
    // API KEY
    // =========================
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel"
      });
    }

    // =========================
    // MESSAGE
    // =========================
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // =========================
    // GEMINI
    // =========================
    const ai = new GoogleGenAI({
      apiKey
    });

    // =========================
    // RETRY FUNCTION
    // =========================
    async function generate(model) {

      const response = await ai.models.generateContent({
        model,
        contents: message
      });

      return response.text || "";
    }

    // =========================
    // FIRST MODEL
    // =========================
    try {

      const reply = await generate("gemini-3.8-flash");

      return res.status(200).json({
        reply
      });

    } catch (firstError) {

      console.error(
        "Gemini 3.8 Flash error:",
        firstError
      );

      const errorText =
        firstError?.message || "";

      // Retry only for temporary availability problems
      if (
        errorText.includes("503") ||
        errorText.includes("UNAVAILABLE") ||
        errorText.includes("high demand")
      ) {

        console.log(
          "Gemini 3.8 Flash is busy. Retrying..."
        );

        // Wait 2 seconds
        await new Promise(resolve =>
          setTimeout(resolve, 2000)
        );

        try {

          const reply =
            await generate("gemini-3.8-flash");

          return res.status(200).json({
            reply
          });

        } catch (retryError) {

          console.error(
            "Gemini retry failed:",
            retryError
          );

          return res.status(503).json({
            error:
              "Gemini is temporarily busy. Please try again in a few seconds."
          });
        }
      }

      throw firstError;
    }

  } catch (error) {

    console.error(
      "GEMINI ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Gemini API failed"
    });
  }
}