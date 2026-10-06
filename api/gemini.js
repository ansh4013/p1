import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

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
    // API KEYS
    // =========================
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openaiKey) {
      console.error(
        "NEXORA ERROR: No AI provider API keys configured."
      );

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

    // =========================
    // INITIALIZE PROVIDERS
    // =========================
    const gemini = geminiKey
      ? new GoogleGenAI({
          apiKey: geminiKey
        })
      : null;

    const openai = openaiKey
      ? new OpenAI({
          apiKey: openaiKey
        })
      : null;

    // =========================
    // ALTERNATING PROVIDERS
    // 1 = Gemini
    // 2 = OpenAI
    // 3 = Gemini
    // 4 = OpenAI
    // 5 = Gemini
    // =========================
    const providers = [
      "gemini",
      "openai",
      "gemini",
      "openai",
      "gemini"
    ];

    let lastError = null;

    for (let attempt = 0; attempt < providers.length; attempt++) {

      const provider = providers[attempt];

      try {

        console.log(
          `NEXORA attempt ${attempt + 1}/5 → ${provider}`
        );

        // =========================
        // GEMINI
        // =========================
        if (provider === "gemini") {

          if (!gemini) {
            throw new Error(
              "Gemini API key is not configured."
            );
          }

          const response =
            await gemini.models.generateContent({

              model: "gemini-3.8-flash",

              contents: message

            });

          const reply = response.text || "";

          if (!reply.trim()) {
            throw new Error(
              "Gemini returned an empty response."
            );
          }

          console.log(
            `NEXORA succeeded using Gemini on attempt ${attempt + 1}`
          );

          return res.status(200).json({
            reply
          });
        }

        // =========================
        // OPENAI
        // =========================
        if (provider === "openai") {

          if (!openai) {
            throw new Error(
              "OpenAI API key is not configured."
            );
          }

          const response =
            await openai.responses.create({

              model: "gpt-5-mini",

              input: message

            });

          const reply = response.output_text || "";

          if (!reply.trim()) {
            throw new Error(
              "OpenAI returned an empty response."
            );
          }

          console.log(
            `NEXORA succeeded using OpenAI on attempt ${attempt + 1}`
          );

          return res.status(200).json({
            reply
          });
        }

      } catch (error) {

        lastError = error;

        // Technical information stays in Vercel logs.
        console.error(
          `NEXORA attempt ${attempt + 1}/5 (${provider}) failed:`,
          error?.message || error
        );

        // =========================
        // WAIT 1 SECOND
        // BEFORE NEXT PROVIDER
        // =========================
        if (attempt < providers.length - 1) {

          await new Promise(resolve =>
            setTimeout(resolve, 1000)
          );
        }
      }
    }

    // =========================
    // ALL 5 ATTEMPTS FAILED
    // =========================
    console.error(
      "NEXORA: All 5 AI attempts failed.",
      lastError?.message || lastError
    );

    return res.status(503).json({
      error:
        "NEXORA is temporarily unable to process your request. Please try again."
    });

  } catch (error) {

    // Technical error only in Vercel logs.
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