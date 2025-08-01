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

// 🔹 (Optional) Fetch single project (if backend supports)
export const getProject = async (id: string) => {
  try {
    const response = await api.get(`/analyze/${id}`);
    return response.data;
  } catch (err: any) {
    console.error("Get Project Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to fetch project");
  }
};

export const saveProject = async (project: any) => {
  const response = await api.post("/analyze/saveAnalysis", project);
  return response.data;
};

export default api;
