/* ==================================================
   YOUTH CARING HEART
   VERCEL API — POSTERS
   FRONTEND → VERCEL → BASEROW
================================================== */

export default async function handler(req, res) {

  // Only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    // Environment variables
    const BASEROW_TOKEN =
      process.env.BASEROW_TOKEN;

    const POSTER_TABLE_ID =
      process.env.POSTER_TABLE_ID;

    // Check configuration
    if (!BASEROW_TOKEN || !POSTER_TABLE_ID) {

      console.error(
        "Missing Baserow environment variables."
      );

      return res.status(500).json({
        error: "Server configuration error."
      });
    }

    // Read request body
    const {
      title,
      text,
      category
    } = req.body || {};

    // Validate required fields
    if (!title || !text || !category) {

      return res.status(400).json({
        error:
          "Title, text and category are required."
      });
    }

    // Basic length protection
    if (
      title.length > 200 ||
      text.length > 5000 ||
      category.length > 100
    ) {

      return res.status(400).json({
        error: "One or more fields are too long."
      });
    }

    // Send announcement to Baserow
    const baserowResponse = await fetch(
      `https://api.baserow.io/api/database/rows/table/${POSTER_TABLE_ID}/?user_field_names=true`,
      {
        method: "POST",

        headers: {
          "Authorization":
            `Token ${BASEROW_TOKEN}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          Title:
            title.trim(),

          Text:
            text.trim(),

          Category:
            category.trim()

        })
      }
    );

    // Read Baserow response
    const data =
      await baserowResponse.json()
        .catch(() => ({}));

    // Baserow error
    if (!baserowResponse.ok) {

      console.error(
        "Baserow poster error:",
        data
      );

      return res.status(500).json({
        error:
          "Failed to publish announcement."
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message:
        "Announcement published successfully."
    });

  } catch (error) {

    console.error(
      "Posters API error:",
      error
    );

    return res.status(500).json({
      error:
        "Server error. Please try again later."
    });
  }
}
