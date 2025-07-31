import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Configure Multer (in-memory storage for direct Cloudinary upload)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single("file");

// File upload controller
export const uploadFile = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message,
          });
        }

        // Successful upload response
        return res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          url: result.secure_url,
        });
      }
    );

    // Pipe buffer to Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
