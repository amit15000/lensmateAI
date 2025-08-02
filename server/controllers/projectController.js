import Project from "../models/Project.js";

export const getSuggestions = async (req, res) => {
  try {
    const { currentProjectId } = req.query;

    const allImageProjects = await Project.find({ type: "image" }).sort({
      createdAt: -1,
    });

    let suggestions = [];

    if (currentProjectId) {
      const current = await Project.findById(currentProjectId);

      if (current && current.type === "image") {
        const others = allImageProjects.filter(
          (p) => p.id !== currentProjectId
        );
        const randomTwo = others.sort(() => 0.5 - Math.random()).slice(0, 2);
        suggestions = [current, ...randomTwo];
      } else {
        suggestions = allImageProjects
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      }
    } else {
      suggestions = allImageProjects
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    }

    const formatted = suggestions.map((p) => ({
      id: p._id,
      title: p.title,
      thumbnail: p.fileUrl,
      type: p.type,
      timestamp: p.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
};
export const saveProject = async (req, res) => {
  try {
    const { fileUrl, gear, aiSuggestions, type, title } = req.body;

    if (!fileUrl || !gear || !aiSuggestions || !type || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const savedProject = await Project.create({
      fileUrl,
      gear,
      aiSuggestions,
      type,
      title,
      timestamp: new Date(),
    });

    return res.json({ success: true, data: { id: savedProject._id } });
  } catch (err) {
    console.error("Save Project API Error:", err);
    res.status(500).json({ message: "Failed to save project" });
  }
};
