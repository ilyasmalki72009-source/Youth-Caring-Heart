export default async function handler(req, res) {
  console.log("AI FUNCTION WAS CALLED");
  console.log("METHOD:", req.method);

  return res.status(200).json({
    success: true,
    method: req.method,
    message: "AI endpoint is working!"
  });
}
