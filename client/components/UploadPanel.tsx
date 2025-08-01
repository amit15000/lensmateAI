"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useProjectStore } from "@/store/useProjectStore";
import axios from "axios";
import { Loader2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadPanel() {
  const { setUploadedFile, setIsUploading } = useProjectStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFileToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploading(true);
    setUploadError(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setUploaded(true);
        setUploadedFile({
          url: res.data.url,
          type: file.type.startsWith("video") ? "video" : "image",
          name: file.name,
        });
      } else throw new Error("Upload failed");
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError("Failed to upload. Try again.");
    } finally {
      setUploading(false);
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadError(null);
    setUploaded(false);
    setPreview(URL.createObjectURL(selectedFile));

    setUploadedFile({
      url: "",
      type: selectedFile.type.startsWith("video") ? "video" : "image",
      name: selectedFile.name,
    });

    uploadFileToCloudinary(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center relative transition group 
          ${
            isDragActive
              ? "border-blue-400 bg-gray-800"
              : "border-gray-600 bg-gray-900"
          }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="mt-2 relative rounded-lg overflow-hidden">
            {/* Media Preview */}
            {file?.type.startsWith("video") ? (
              <video src={preview} controls className="rounded-lg w-full" />
            ) : (
              <img src={preview} alt="Preview" className="rounded-lg w-full" />
            )}

            {/* Uploading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="ml-2 text-white text-sm">Uploading...</span>
              </div>
            )}

            {/* Floating Change Button */}
            {uploaded && !uploading && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="absolute top-3 right-3 bg-black/50 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <p className="text-gray-400">
            Drag & drop an image or video, or{" "}
            <span className="text-blue-400 underline">click to browse</span>
          </p>
        )}
      </div>

      {/* Status Messages */}
      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      {uploaded && !uploading && (
        <p className="text-green-500 text-sm text-center">
          ✅ Uploaded successfully!
        </p>
      )}
    </div>
  );
}
