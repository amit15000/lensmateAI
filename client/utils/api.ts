import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
})

// Upload file to Cloudinary
export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Analyze image
export const analyzeImage = async (data: {
  fileUrl: string
  gear: {
    camera: string
    lens: string
    gimbal?: string
  }
}) => {
  const response = await api.post("/analyze/image", data)
  return response.data
}

// Analyze video
export const analyzeVideo = async (data: {
  fileUrl: string
  gear: {
    camera: string
    lens: string
    gimbal?: string
  }
}) => {
  const response = await api.post("/analyze/video", data)
  return response.data
}

// Get all projects
export const getProjects = async () => {
  const response = await api.get("/analyze/projects")
  return response.data
}

// Get single project
export const getProject = async (id: string) => {
  const response = await api.get(`/analyze/${id}`)
  return response.data
}

// Save project
export const saveProject = async (project: any) => {
  const response = await api.post("/analyze/save", project)
  return response.data
}

export default api
