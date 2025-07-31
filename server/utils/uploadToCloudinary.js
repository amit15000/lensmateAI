import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: "frames", resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        fs.unlinkSync(filePath); // ✅ delete local frame after upload
        resolve(result.secure_url); // return uploaded URL
      }
    );
  });
};
