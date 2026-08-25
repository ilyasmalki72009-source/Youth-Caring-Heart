import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  console.log("AI FUNCTION CALLED");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

    const { message } = req.body || {};

    console.log("MESSAGE:", message);

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message.trim().slice(0, 2000)
    });

    console.log("GEMINI RESPONSE RECEIVED");

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("GEMINI FULL ERROR:", error);

    return res.status(500).json({
      error: error.message || "AI service failed."
    });
  }
}

 
