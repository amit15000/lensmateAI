import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE, // e.g., http://localhost:5000/api
  timeout: 120000,
});

// 🔹 Upload file to Cloudinary (via backend)
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, url }
  } catch (err: any) {
    console.error("Upload Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Upload failed");
  }
};

// 🔹 Analyze Image
export const analyzeImage = async (data: {
  fileUrl: string;
  gear: { camera: string; lens: string; gimbal?: string };
}) => {
  try {
    console.log("Analyzing Image Payload:", data);
    const response = await api.post("/analyze/image", data);
    return response.data; // { success, data }
  } catch (err: any) {
    console.error("Analyze Image Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Image analysis failed");
  }
};

// 🔹 Analyze Video
export const analyzeVideo = async (data: {
  fileUrl: string;
  gear: { camera: string; lens: string; gimbal?: string };
}) => {
  try {
    console.log("Analyzing Video Payload:", data);
    const response = await api.post("/analyze/video", data);
    return response.data; // { success, data }
  } catch (err: any) {
    console.error("Analyze Video Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Video analysis failed");
  }
};

export const getSuggestions = async (currentProjectId?: string) => {
  try {
    const response = await api.get(`/projects/suggestions`, {
      params: currentProjectId ? { currentProjectId } : {},
    });
    return response.data; // returns [{id, title, thumbnail, type, timestamp}]
  } catch (err: any) {
    console.error("Get Suggestions Error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Failed to fetch suggestions"
    );
  }
};

export const saveCurrentProject = async (project: {
  fileUrl: string;
  gear: any;
  aiSuggestions: any;
  type: "image" | "video";
  title: string;
}) => {
  try {
    const response = await api.post("/projects/save", project);
    return response.data;
  } catch (err: any) {
    console.error("Save Project Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to save project");
  }
};

export default api;
