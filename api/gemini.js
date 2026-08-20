import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {

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

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel"
      });
    }

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    const response =
      await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: message

      });

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {

    console.error(
      "GEMINI ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message || "Gemini API failed"
    });

  }

}