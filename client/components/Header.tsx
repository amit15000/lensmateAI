"use client";

import { FileText, Download, Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/useProjectStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { currentProject, exportShotPlan, updateProjectTitle } =
    useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentProject?.title || "Untitled");
  const router = useRouter();

  // ✅ Sync title with store updates
  useEffect(() => {
    setTitle(currentProject?.title || "Untitled");
  }, [currentProject?.title]);

  const handleTitleSave = () => {
    updateProjectTitle(title.trim() || "Untitled");
    setIsEditing(false);
  };

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lensmate AI</h1>
            <p className="text-xs text-gray-400">Cinematic Assistant</p>
          </div>
        </div>

        {/* Project Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FileText className="w-4 h-4" />

          {/* ✅ New Project just routes to '/' */}
          <button
            onClick={() => router.push("/")}
            className="hover:text-white transition-colors"
          >
            New Project
          </button>

          <span className="text-gray-600">|</span>

          {/* Editable Title */}
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm w-40 focus:outline-none"
                autoFocus
              />
            ) : (
              <span
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <span>Project: {title}</span>
                <Pencil className="w-3 h-3 text-gray-500 hover:text-gray-300" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportShotPlan}
          disabled={
            !currentProject?.animation?.shotPlan &&
            !currentProject?.animation?.scenes
          }
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Shot Plan
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
          JD
        </div>
      </div>
    </header>
  );
}
