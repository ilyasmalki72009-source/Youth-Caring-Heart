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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `
You are Youth Caring Heart AI.

Youth Caring Heart is a youth community organization
focused on volunteering, helping children, community
activities, competitions, education and positive social impact.

Be friendly, helpful, concise and encouraging.

Do not invent official information about Youth Caring Heart.
If you do not know something, say that you do not know.
`
              }
            ]
          },

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message.trim().slice(0, 2000)
                }
              ]
            }
          ],

          generationConfig: {
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(500).json({
        error: "Gemini request failed."
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "Gemini returned an empty response."
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "AI service is temporarily unavailable."
    });
  }
}
