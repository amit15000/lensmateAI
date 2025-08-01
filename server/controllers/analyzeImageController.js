import { analyzeImageAI } from "../utils/ai/analyzeImageAI.js";
import Project from "../models/Project.js";

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
    const project = await Project.create({
      fileUrl,
      gear,
      aiSuggestions: suggestions,
    });
    console.log(project);
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
