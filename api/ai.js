import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  console.log("=== AI FUNCTION START ===");
  console.log("Method:", req.method);
  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    console.log("Message received:", !!message);

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    console.log("Calling Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message.trim().slice(0, 2000),
      config: {
        systemInstruction:
          "You are Youth Caring Heart AI. Be friendly, helpful and concise.",
        maxOutputTokens: 500
      }
    });

    console.log("Gemini response received.");

    const reply = response.text;

    console.log("Reply exists:", !!reply);

    if (!reply) {
      return res.status(500).json({
        error: "Gemini returned an empty response."
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {

    console.error("=== GEMINI ERROR ===");
    console.error(error);

    return res.status(500).json({
      error:
        error?.message ||
        "Unknown Gemini error."
    });
  }
}
