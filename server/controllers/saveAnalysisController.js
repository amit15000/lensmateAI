import Project from "../models/Project.js";

export const saveAnalysis = async (req, res) => {
  try {
    const projectData = req.body;

    if (!projectData.title || !projectData.type || !projectData.fileUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let project;
    if (projectData.id) {
      // Update existing project
      project = await Project.findByIdAndUpdate(projectData.id, projectData, {
        new: true,
      });
    } else {
      // Create new project
      project = await Project.create(projectData);
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Save Analysis Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save analysis" });
  }
};
