import { extractFrames } from "../utils/frameExtractor.js";
import { analyzeVideoAI } from "../utils/ai/analyzeVideoAI.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const analyzeVideo = async (req, res) => {
  try {
    const { fileUrl, gear } = req.body;
    if (!fileUrl || !gear) {
      return res
        .status(400)
        .json({ success: false, message: "fileUrl and gear are required" });
    }

    console.log("🎬 Starting video analysis for:", fileUrl);

    // ✅ Step 1: Extract frames (limit to 8 for diversity)
    const frames = await extractFrames(fileUrl, "temp/frames", true);
    console.log(`✅ Frame extraction complete. Total frames: ${frames.length}`);

    // ✅ Step 2: Pick a subset of 5 frames for AI (avoid overload)
    const selectedFrames = frames.slice(0, 5);
    console.log("📸 Selected frames:", selectedFrames);

    // ✅ Step 3: Upload selected frames to Cloudinary (with compression)
    const uploadedFrameUrls = [];
    for (const frame of selectedFrames) {
      const url = await uploadToCloudinary(frame, {
        transformation: { width: 640, quality: "auto" }, // Reduce size for speed
      });
      uploadedFrameUrls.push(url);
    }

    console.log("☁️ Uploaded frame URLs:", uploadedFrameUrls);

    // ✅ Step 4: Analyze frames using OpenAI Vision
    const aiSuggestions = await analyzeVideoAI(uploadedFrameUrls, gear);

    // ✅ Step 5: Generate dynamic title (from AI or fallback)
    const title =
      aiSuggestions.title ||
      `Cinematic Video - ${new Date().toLocaleDateString()}`;

    // ✅ Step 6: Return response (aiSuggestions only for saving)
    res.status(200).json({
      success: true,
      data: {
        fileUrl,
        gear,
        aiSuggestions, // Store this in DB for video projects
        type: "video",
        title,
      },
    });
  } catch (err) {
    console.error("❌ Analyze Video Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during video analysis",
      error: err.message,
    });
  }
};
