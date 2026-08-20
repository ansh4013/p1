import { GoogleGenAI } from "@google/genai";

// ============================================================
// CONFIGURATION
// ============================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const ALLOWED_ORIGIN = "https://ansh4013.github.io";


// ============================================================
// VERCEL SERVERLESS FUNCTION
// ============================================================

export default async function handler(req, res) {

  // ----------------------------------------------------------
  // CORS
  // ----------------------------------------------------------

  res.setHeader(
    "Access-Control-Allow-Origin",
    ALLOWED_ORIGIN
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  // Browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }


  // ----------------------------------------------------------
  // POST ONLY
  // ----------------------------------------------------------

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }


  try {

    // --------------------------------------------------------
    // CHECK VERCEL API KEY
    // --------------------------------------------------------

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error:
          "GEMINI_API_KEY is not configured on Vercel"
      });
    }


    // --------------------------------------------------------
    // GET DATA FROM FRONTEND
    // --------------------------------------------------------

    const {
      message,
      personality,
      history
    } = req.body || {};


    // --------------------------------------------------------
    // VALIDATE MESSAGE
    // --------------------------------------------------------

    if (
      !message ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        error: "Message is required"
      });
    }


    // --------------------------------------------------------
    // PERSONALITY
    // --------------------------------------------------------

    const systemPrompt =
      personality ||
      "You are a helpful, friendly AI assistant. Answer clearly and concisely.";


    // --------------------------------------------------------
    // CONVERSATION HISTORY
    // --------------------------------------------------------

    const contents = [];


    if (Array.isArray(history)) {

      // Only keep the latest 20 messages
      const recentHistory =
        history.slice(-20);


      for (const item of recentHistory) {

        if (
          !item ||
          typeof item.text !== "string" ||
          !item.text.trim()
        ) {
          continue;
        }


        if (item.role === "user") {

          contents.push({
            role: "user",
            parts: [
              {
                text: item.text
              }
            ]
          });

        }


        else if (
          item.role === "ai" ||
          item.role === "model"
        ) {

          contents.push({
            role: "model",
            parts: [
              {
                text: item.text
              }
            ]
          });

        }

      }

    }


    // --------------------------------------------------------
    // CURRENT MESSAGE
    // --------------------------------------------------------

    contents.push({
      role: "user",
      parts: [
        {
          text: message
        }
      ]
    });


    // --------------------------------------------------------
    // GEMINI REQUEST
    // --------------------------------------------------------

    const response =
      await ai.models.generateContent({

        model: "gemini-2.5-flash",

        systemInstruction: {
          parts: [
            {
              text: systemPrompt
            }
          ]
        },

        contents: contents

      });


    // --------------------------------------------------------
    // GET RESPONSE TEXT
    // --------------------------------------------------------

    const reply =
      response.text;


    if (
      !reply ||
      !reply.trim()
    ) {

      return res.status(500).json({
        error:
          "Gemini returned an empty response"
      });

    }


    // --------------------------------------------------------
    // SEND RESPONSE TO FRONTEND
    // --------------------------------------------------------

    return res.status(200).json({
      reply: reply.trim()
    });


  } catch (error) {

    console.error(
      "Gemini backend error:",
      error
    );


    return res.status(500).json({
      error:
        error?.message ||
        "Gemini API request failed"
    });

  }

}