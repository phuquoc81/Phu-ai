// phu-ai-app.js
// PHU AI – Build the Face of the Future on Earth
// Simple Node/Express API skeleton

import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// In-memory "database" for demo
const userProfiles = new Map();

/**
 * POST /api/future-face
 * Body: multipart/form-data
 *  - image: user selfie
 *  - theme: "ocean", "city", "forest", "space", etc.
 *
 * Response:
 *  - futureFaceUrl: URL to generated hybrid face (placeholder here)
 *  - earthMessage: short message about Earth's future
 *  - profileId: id to fetch later
 */
app.post("/api/future-face", upload.single("image"), (req, res) => {
  try {
    const { theme = "future" } = req.body;
    const imageBuffer = req.file?.buffer;

    if (!imageBuffer) {
      return res.status(400).json({ error: "Image is required" });
    }

    // TODO: send imageBuffer + theme to your AI image generator
    // For now, we mock a generated URL:
    const profileId = `phu-${Date.now()}`;
    const futureFaceUrl = `https://cdn.phu-ai.com/future-faces/${profileId}.png`;

    // Simple Earth-future message generator
    const earthMessage = buildEarthMessage(theme);

    userProfiles.set(profileId, {
      id: profileId,
      theme,
      futureFaceUrl,
      earthMessage,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      profileId,
      futureFaceUrl,
      earthMessage,
    });
  } catch (err) {
    console.error("Error in /api/future-face:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/profile/:id
 * Fetch a saved PHU AI future profile
 */
app.get("/api/profile/:id", (req, res) => {
  const profile = userProfiles.get(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  return res.json(profile);
});

/**
 * Tiny "Earth future" copy engine
 */
function buildEarthMessage(theme) {
  switch (theme.toLowerCase()) {
    case "ocean":
      return "In your future, PHU AI sees oceans restored, coral alive, and you helping protect blue Earth.";
    case "city":
      return "PHU AI sees you in luminous green cities, where technology and nature finally move as one.";
    case "forest":
      return "Your future face stands under tall forests, where Earth breathes easier because of choices you made.";
    case "space":
      return "PHU AI sees you as a bridge between Earth and the stars, carrying home with you wherever you go.";
    default:
      return "PHU AI sees a future where human and AI work together to heal Earth and build what comes next.";
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PHU AI backend running on http://localhost:${PORT}`);
});
