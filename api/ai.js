export default function handler(req, res) {
  console.log("🔥 AI FUNCTION WAS REACHED");
  console.log("METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST is allowed",
      method: req.method
    });
  }

  return res.status(200).json({
    reply: "✅ Vercel API is working!"
  });
}
