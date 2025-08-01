import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // Added title
    type: { type: String, enum: ["image", "video"], required: true }, // Added type
    fileUrl: { type: String, required: true },
    gear: {
      camera: { type: String, required: true },
      lens: { type: String, required: true },
      gimbal: { type: String },
    },
    aiSuggestions: {
      angles: String,
      settings: {
        aperture: String,
        ISO: String,
        shutter: String,
      },
      shotPlan: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
