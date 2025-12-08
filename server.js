const express = require("express");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// For parsing multipart/form-data (file uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB per file
});

// Allow browser clients (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // for dev; later lock down
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Simple health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Body measurement API is running" });
});

// Main AI endpoint (demo)
app.post(
  "/api/measure",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "side", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "angle", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const height = parseFloat(req.body.height);
      const weight = parseFloat(req.body.weight);

      const front = req.files.front?.[0] || null;
      const side = req.files.side?.[0] || null;

      if (!front || !side) {
        return res.status(400).json({
          ok: false,
          error: "Please provide at least front and side photos."
        });
      }

      // -------- PLACEHOLDER "AI" LOGIC --------
      // This is just demo math. Later you can swap in real AI / an external API.
      let baseWaist = 90;
      if (!isNaN(height) && !isNaN(weight)) {
        baseWaist = Math.round((weight / (height || 170)) * 90);
      }

      const response = {
        ok: true,
        unit: "cm",
        confidence: 0.6, // placeholder
        chest: baseWaist + 10,
        waist: baseWaist,
        hips: baseWaist + 5,
        thigh: Math.round(baseWaist * 0.6),
        arm: Math.round(baseWaist * 0.4),
        notes:
          "Demo values only. Replace with a real AI body-measurement model or API when you're ready."
      };

      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: "Server error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Body measurement API listening on port ${port}`);
});
