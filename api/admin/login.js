/* ==================================================
   YOUTH CARING HEART
   VERCEL API — ADMIN LOGIN
   ADMIN INVITE CODE
================================================== */

export default async function handler(req, res) {

  // Only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    // Get the secret admin invite code
    const ADMIN_INVITE_CODE =
      process.env.ADMIN_INVITE_CODE;

    // Make sure the environment variable exists
    if (!ADMIN_INVITE_CODE) {

      console.error(
        "ADMIN_INVITE_CODE is not configured."
      );

      return res.status(500).json({
        error: "Server configuration error."
      });
    }

    // Read submitted code
    const { code } = req.body || {};

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        error: "Admin code is required."
      });
    }

    // Compare codes
    if (code.trim() !== ADMIN_INVITE_CODE.trim()) {

      return res.status(401).json({
        success: false,
        error: "Invalid admin code."
      });
    }

    // Correct code
    return res.status(200).json({
      success: true,
      message: "Admin access granted."
    });

  } catch (error) {

    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      error:
        "Server error. Please try again later."
    });
  }
}
