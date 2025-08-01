"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useProjectStore } from "@/store/useProjectStore";
import axios from "axios";

export function UploadPanel() {
  const { setUploadedFile, setIsUploading } = useProjectStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);

  // ✅ Handle Cloudinary upload
  const uploadFileToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log(process.env.NEXT_PUBLIC_API_BASE);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setUploaded(true);

        // ✅ Update Zustand store with Cloudinary URL
        setUploadedFile({
          url: res.data.url,
          type: file.type.startsWith("video") ? "video" : "image",
          name: file.name,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError("Failed to upload. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Handle file drop or selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadError(null);
    setUploaded(false);

    // Instant preview
    setPreview(URL.createObjectURL(selectedFile));

    // Store metadata in Zustand (URL added after upload)
    setUploadedFile({
      url: "",
      type: selectedFile.type.startsWith("video") ? "video" : "image",
      name: selectedFile.name,
    });

    // Background upload
    uploadFileToCloudinary(selectedFile);
  }, []);

  // ✅ Configure drag-and-drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
        ${
          isDragActive
            ? "border-blue-400 bg-gray-800"
            : "border-gray-600 bg-gray-900"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="mt-2">
            {file?.type.startsWith("video") ? (
              <video src={preview} controls className="rounded-lg w-full" />
            ) : (
              <img src={preview} alt="Preview" className="rounded-lg w-full" />
            )}
          </div>
        ) : (
          <p className="text-gray-400">
            Drag & drop an image or video, or click to browse
          </p>
        )}
      </div>

      {/* Upload Status */}
      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      {uploaded && (
        <p className="text-green-500 text-sm">✅ Uploaded successfully!</p>
      )}
    </div>
  );
}
