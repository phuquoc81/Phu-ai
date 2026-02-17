module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    name: "Phutokenvercel",
    status: "ok",
    message: "Phutokenvercel API is running on Vercel.",
    timestamp: new Date().toISOString()
  });
};
