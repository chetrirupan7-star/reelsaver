
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/check-video", async (req, res) => {
  try {
    const { url } = req.body || {};

    if (typeof url !== "string" || url.length > 2000) {
      return res.status(400).json({
        error: "Valid video link enter karein."
      });
    }

    let videoUrl;

    try {
      videoUrl = new URL(url);
    } catch {
      return res.status(400).json({
        error: "Link sahi nahi hai."
      });
    }

    if (videoUrl.protocol !== "https:") {
      return res.status(400).json({
        error: "Sirf HTTPS video links allowed hain."
      });
    }

    if (!/\.(mp4|webm|mov)$/i.test(videoUrl.pathname)) {
      return res.status(400).json({
        error: "Yeh direct video-file link nahi lagta. MP4 ya WebM link use karein."
      });
    }

    return res.json({
      message: "Link format sahi hai. Abhi actual download feature connect karna baaki hai.",
      videoUrl: videoUrl.href
    });
  } catch {
    return res.status(500).json({
      error: "Server par problem hui."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("ReelSaver is running on port " + PORT);
});
