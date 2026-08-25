export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: "AI API IS WORKING",
    method: req.method
  });
}
