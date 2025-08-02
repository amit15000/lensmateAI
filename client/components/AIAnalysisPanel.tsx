"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Maximize, X, Bookmark, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShotPlanAnimation } from "@/components/ShotPlanAnimation";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";

export function AIAnalysisPanel() {
  const { currentProject, isAnalyzing, saveCurrentSuggestion } =
    useProjectStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Escape key closes fullscreen
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsFullscreen(false);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen, handleEscape]);

  if (isAnalyzing) return <AnalysisLoader />;

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎬</span>
          </div>
          <p>Upload a scene and select your gear to get started</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveCurrentSuggestion();
      toast.success("Project saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const shotPlan = currentProject.animation?.shotPlan;
  const videoScenes = currentProject.animation?.scenes || [];

  return (
    <div className="space-y-6">
      {/* AI Analysis Results */}
      <div className="space-y-4">
        {/* Intro */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <p className="text-gray-300">
            Welcome to Lensmate AI! I've analyzed your {currentProject.type}{" "}
            scene and gear setup. Here are my cinematic suggestions:
          </p>
        </div>

        {/* Camera Angle */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
              📷
            </span>
            <span>Camera Angle & Framing</span>
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {currentProject.analysis?.angles ||
              "AI suggests a dynamic wide/low angle shot for cinematic impact."}
          </p>
        </div>

        {/* Camera Settings */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
              ⚙️
            </span>
            <span>Camera Settings</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {["Aperture", "ISO", "Shutter"].map((label) => {
              const value =
                label === "Aperture"
                  ? currentProject.analysis?.settings?.aperture || "f/8.0"
                  : label === "ISO"
                  ? currentProject.analysis?.settings?.ISO || "100"
                  : currentProject.analysis?.settings?.shutter || "1/125";
              return (
                <div key={label} className="text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-lg font-mono text-blue-400">{value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shot Plan Animation */}
        {(shotPlan || videoScenes.length > 0) && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Shot Plan Animation</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Inline Animation */}
            <div className="relative h-64 rounded-lg overflow-hidden">
              <ShotPlanAnimation
                shotPlan={shotPlan}
                videoScenes={videoScenes}
                isPlaying={isPlaying}
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Current Suggestion"}
          </Button>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen &&
        createPortal(
          <>
            {/* Fullscreen Animation Layer */}
            <div className="fixed inset-0 bg-black z-40">
              <ShotPlanAnimation
                shotPlan={shotPlan}
                videoScenes={videoScenes}
                isPlaying={true}
                isFullscreen={true}
              />
            </div>

            {/* Control Buttons Layer (always on top) */}
            <div className="fixed top-4 right-4 z-[100] flex space-x-3 pointer-events-auto">
              {/* Minimize Button */}
              <Button
                variant="ghost"
                size="sm"
                className="pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
              >
                <Minimize className="w-6 h-6 text-white" />
              </Button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

function AnalysisLoader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h3 className="font-semibold">AI Analysis in Progress</h3>
          <p className="text-sm text-gray-400">
            Analyzing scene and gear compatibility...
          </p>
        </div>
        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-full w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
