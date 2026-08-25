export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: "TEST API WORKS",
    method: req.method
  });
}
