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

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only POST is allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed"
    });
  }

  try {

    // =========================
    // CHECK API KEY
    // =========================
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel"
      });
    }

    // =========================
    // GET MESSAGE
    // =========================
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // =========================
    // INITIALIZE GEMINI
    // =========================
    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    // =========================
    // GENERATE RESPONSE
    // =========================
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message
    });

    // =========================
    // SEND RESPONSE
    // =========================
    return res.status(200).json({
      reply: response.text || "I couldn't generate a response."
    });

  } catch (error) {

    console.error("GEMINI ERROR:", error);

    return res.status(500).json({
      error: error?.message || "Gemini API failed"
    });
  }
}