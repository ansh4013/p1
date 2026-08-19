import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  try {
    // Key comes ONLY from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on Vercel"
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: "Gemini API request failed"
    });
  }
}