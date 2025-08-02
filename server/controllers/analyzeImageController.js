import { analyzeImageAI } from "../utils/ai/analyzeImageAI.js";

export const analyzeImage = async (req, res) => {
  try {
    const { fileUrl, gear } = req.body;
    if (!fileUrl || !gear?.camera || !gear?.lens) {
      return res.status(400).json({
        success: false,
        message: "fileUrl, camera, and lens required",
      });
    }

    const aiContent = await analyzeImageAI(fileUrl, gear);
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");

    const suggestions = JSON.parse(jsonMatch[0]);

    const title =
      suggestions.title ||
      `Cinematic Shot - ${new Date().toLocaleDateString()}`;

    res.status(200).json({
      success: true,
      data: {
        fileUrl,
        gear,
        aiSuggestions: suggestions,
        type: "image",
        title,
      },
    });
  } catch (err) {
    console.error("Analyze Image Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
