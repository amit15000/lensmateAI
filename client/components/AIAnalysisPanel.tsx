"use client";

import { useState } from "react";
import { Play, Pause, Maximize, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShotPlanAnimation } from "@/components/ShotPlanAnimation";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "react-hot-toast"; // ✅ For success/error feedback

export function AIAnalysisPanel() {
  const { currentProject, isAnalyzing, saveCurrentSuggestion } =
    useProjectStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (isAnalyzing) {
    return <AnalysisLoader />;
  }

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

  return (
    <div className="space-y-6">
      {/* AI Analysis Results */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <p className="text-gray-300">
            Welcome to Lensmate AI! I've analyzed your {currentProject.type}{" "}
            scene and gear setup. Here are my cinematic suggestions:
          </p>
        </div>

        {/* Camera Angle & Framing */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs">📷</span>
            </div>
            <h3 className="font-semibold">Camera Angle & Framing</h3>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            {currentProject.analysis?.framing ||
              "For this scene, I recommend a low-angle shot with the 24-70mm lens at around 35mm. This will emphasize the height and grandeur while maintaining context with the foreground."}
          </p>
        </div>

        {/* Camera Settings */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs">⚙️</span>
            </div>
            <h3 className="font-semibold">Camera Settings</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Aperture</p>
              <p className="text-lg font-mono text-blue-400">
                {currentProject.analysis?.settings?.aperture || "f/8.0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">ISO</p>
              <p className="text-lg font-mono text-blue-400">
                {currentProject.analysis?.settings?.iso || "100"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Shutter</p>
              <p className="text-lg font-mono text-blue-400">
                {currentProject.analysis?.settings?.shutter || "1/125"}
              </p>
            </div>
          </div>
        </div>

        {/* Shot Plan Animation */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Shot Plan Animation</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
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

          <div
            className={`relative ${
              isFullscreen ? "fixed inset-0 z-50 bg-black" : "h-64"
            } rounded-lg overflow-hidden`}
          >
            <ShotPlanAnimation
              shotPlan={currentProject.shotPlan}
              isPlaying={isPlaying}
              isFullscreen={isFullscreen}
            />
          </div>
        </div>

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
    </div>
  );
}

function AnalysisLoader() {
  return (
    <div className="space-y-6">
      {/* Loader content */}
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
