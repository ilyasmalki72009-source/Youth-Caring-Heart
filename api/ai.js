import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message.trim().slice(0, 2000),
      config: {
        systemInstruction: `
You are Youth Caring Heart AI.

Youth Caring Heart is a youth community organization
focused on volunteering, helping children, community
activities, competitions, education and positive social impact.

Be friendly, helpful, concise and encouraging.

Do not invent official information about Youth Caring Heart.
If you do not know something, say that you do not know.
`,
        maxOutputTokens: 500
      }
    });

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: "AI service is temporarily unavailable."
    });
  }
}
