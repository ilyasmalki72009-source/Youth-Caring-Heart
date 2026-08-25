/* ==================================================
   YOUTH CARING HEART
   VERCEL API — MEMBERS
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

    // Read environment variables
    const BASEROW_TOKEN =
      process.env.BASEROW_TOKEN;

    const MEMBERS_TABLE_ID =
      process.env.MEMBERS_TABLE_ID;

    // Make sure the environment variables exist
    if (!BASEROW_TOKEN || !MEMBERS_TABLE_ID) {

      console.error(
        "Missing Baserow environment variables."
      );

      return res.status(500).json({
        error: "Server configuration error."
      });
    }

    // Read request body
    const {
      name,
      email,
      phone,
      competition
    } = req.body || {};

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !competition
    ) {

      return res.status(400).json({
        error:
          "Name, email, phone and competition are required."
      });
    }

    // Basic length protection
    if (
      name.length > 150 ||
      email.length > 200 ||
      phone.length > 50 ||
      competition.length > 200
    ) {

      return res.status(400).json({
        error: "One or more fields are too long."
      });
    }

    // Send data to Baserow
    const baserowResponse = await fetch(
      `https://api.baserow.io/api/database/rows/table/${MEMBERS_TABLE_ID}/?user_field_names=true`,
      {
        method: "POST",

        headers: {
          "Authorization":
            `Token ${BASEROW_TOKEN}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          Name: name.trim(),

          Email: email.trim(),

          Phone: phone.trim(),

          Competition:
            competition.trim()

        })
      }
    );

    // Read Baserow response
    const data =
      await baserowResponse.json()
        .catch(() => ({}));

    // Baserow returned an error
    if (!baserowResponse.ok) {

      console.error(
        "Baserow error:",
        data
      );

      return res.status(500).json({
        error:
          "Failed to save application."
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message:
        "Application submitted successfully."
    });

  } catch (error) {

    console.error(
      "Members API error:",
      error
    );

    return res.status(500).json({
      error:
        "Server error. Please try again later."
    });
  }
}
