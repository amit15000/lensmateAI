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

    const frames = await extractFrames(fileUrl, "temp/frames", true);

    const selectedFrames = frames.slice(0, 7);

    const uploadedFrameUrls = [];
    for (const frame of selectedFrames) {
      const url = await uploadToCloudinary(frame, {
        transformation: { width: 640, quality: "auto" },
      });
      uploadedFrameUrls.push(url);
    }

    const aiSuggestions = await analyzeVideoAI(uploadedFrameUrls, gear);

    const title =
      aiSuggestions.title ||
      `Cinematic Video - ${new Date().toLocaleDateString()}`;

    res.status(200).json({
      success: true,
      data: {
        fileUrl,
        gear,
        aiSuggestions,
        type: "video",
        title,
      },
    });
  } catch (err) {
    console.error("Analyze Video Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during video analysis",
      error: err.message,
    });
  }
};
