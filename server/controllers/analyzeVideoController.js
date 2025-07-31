import { extractFrames } from "../utils/frameExtractor.js";
import { analyzeVideoAI } from "../utils/ai/analyzeVideoAI.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import Project from "../models/Project.js";

export const analyzeVideo = async (req, res) => {
  try {
    const { fileUrl, gear } = req.body;
    if (!fileUrl || !gear) {
      return res
        .status(400)
        .json({ success: false, message: "fileUrl and gear are required" });
    }

    // ✅ Step 1: Extract frames locally
    const frames = await extractFrames(fileUrl, "temp/frames", true);

    // ✅ Step 2: Upload frames to Cloudinary
    const uploadedFrameUrls = [];
    for (const frame of frames) {
      const url = await uploadToCloudinary(frame); // upload each frame
      uploadedFrameUrls.push(url);
    }

    // ✅ Step 3: Analyze via OpenAI Vision using URLs
    const aiSuggestions = await analyzeVideoAI(uploadedFrameUrls, gear);

    // ✅ Step 4: Save to DB
    const project = await Project.create({ fileUrl, gear, aiSuggestions });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error("Analyze Video Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
