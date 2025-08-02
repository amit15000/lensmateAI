"use client";

import { useState, useEffect } from "react";
import { Clock, ImageIcon, Video, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/useProjectStore";
import { getSuggestions, saveCurrentProject } from "@/utils/api";
import { toast } from "react-hot-toast";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns"; // ✅ Import

interface Project {
  id: string;
  title: string;
  thumbnail: string;
  type: "image" | "video";
  timestamp: string;
  fileUrl?: string;
  gear?: any;
  aiSuggestions?: any; // <-- Added this property
}

export function SuggestionsFeed() {
  const { loadProject, currentProject } = useProjectStore();
  const [suggestions, setSuggestions] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, [currentProject]);

  const loadSuggestions = async () => {
    try {
      const result = await getSuggestions(currentProject?.id);
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    try {
      await loadProject(projectId);
    } catch (error) {
      console.error("Failed to load project:", error);
    }
  };

  // ✅ Save Current Project
  const handleSave = async () => {
    if (!currentProject) {
      toast.error("No project to save!");
      return;
    }

    try {
      setSaving(true);
      await saveCurrentProject({
        fileUrl: currentProject.fileUrl,
        gear: currentProject.gear,
        aiSuggestions: currentProject.aiSuggestions,
        type: currentProject.type,
        title: currentProject.title,
      });
      toast.success("Project saved successfully!");
      loadSuggestions();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Human-readable timestamp formatter
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return `Today`; // e.g. Today at 4:30 PM
    }
    if (isYesterday(date)) {
      return `Yesterday`;
    }
    return formatDistanceToNow(date, { addSuffix: true }); // e.g. "3 days ago"
  };

  if (loading) return <SuggestionsFeedSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-right">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Suggestions Feed
        </h2>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {suggestions.map((project) => (
          <div
            key={project.id}
            className={`group cursor-pointer rounded-xl overflow-hidden shadow-md border border-gray-700 transition-all duration-200 ${
              currentProject?.id === project.id
                ? "ring-2 ring-blue-500"
                : "hover:border-gray-600 hover:shadow-lg"
            }`}
            onClick={() => handleProjectClick(project.id)}
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={project.thumbnail || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                {project.type === "video" ? (
                  <Video className="w-4 h-4 text-white" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-white" />
                )}
              </div>
              {currentProject?.id === project.id && (
                <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                  Active
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3 bg-gray-800">
              <h4 className="font-medium text-white text-sm truncate">
                {project.title}
              </h4>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {formatTimestamp(project.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionsFeedSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-right">
        <div className="h-4 bg-gray-700 rounded w-32 ml-auto" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden shadow-md border border-gray-700"
        >
          <div className="h-32 bg-gray-700" />
          <div className="p-3 space-y-2 bg-gray-800">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
