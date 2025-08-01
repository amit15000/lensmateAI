"use client";

import { create } from "zustand";
import {
  analyzeImage,
  analyzeVideo,
  getProject,
  saveProject,
} from "@/utils/api";
import toast from "react-hot-toast";

interface UploadedFile {
  url: string;
  type: "image" | "video";
  name: string;
}

interface Gear {
  camera: string;
  lens: string;
  gimbal?: string;
}

interface Analysis {
  angles?: string;
  settings?: {
    aperture: string;
    ISO: string;
    shutter: string;
    fov?: string;
    focusDistance?: string;
  };
  environment?: {
    lighting: string;
    mood: string;
  };
}

interface ShotPlan {
  path: Array<{
    x: number;
    y: number;
    z: number;
    pitch?: number;
    yaw?: number;
    roll?: number;
    duration?: number;
    ease?: string;
  }>;
  lookAt?: { x: number; y: number; z: number };
  dof?: { focusDistance: number; aperture: string };
}

interface VideoScene {
  sceneId: number;
  description: string;
  angles: string;
  settings: { aperture: string; ISO: string; shutter: string };
  shotPlan: {
    path: Array<{
      x: number;
      y: number;
      z: number;
      pitch?: number;
      yaw?: number;
      roll?: number;
      duration?: number;
    }>;
    lookAt?: { x: number; y: number; z: number };
  };
}

interface Project {
  id?: string;
  title: string;
  type: "image" | "video";
  fileUrl: string;
  gear: Gear;
  analysis?: Analysis;
  shotPlan?: ShotPlan;
  videoScenes?: VideoScene[];
  timestamp: string;
}

interface ProjectStore {
  uploadedFile: UploadedFile | null;
  gear: Gear;
  currentProject: Project | null;
  isUploading: boolean;
  isAnalyzing: boolean;

  setUploadedFile: (file: UploadedFile | null) => void;
  setGear: (gear: Gear) => void;
  setIsUploading: (loading: boolean) => void;
  analyzeScene: (file: UploadedFile, gear: Gear) => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  saveCurrentSuggestion: () => Promise<void>;
  exportShotPlan: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  uploadedFile: null,
  gear: { camera: "Sony A7S III", lens: "24-70mm" },
  currentProject: null,
  isUploading: false,
  isAnalyzing: false,

  setUploadedFile: (file) => set({ uploadedFile: file }),
  setGear: (gear) => set({ gear }),
  setIsUploading: (isUploading) => set({ isUploading }),

  analyzeScene: async (file, gear) => {
    set({ isAnalyzing: true });
    try {
      let response;

      if (file.type === "image") {
        response = await analyzeImage({ fileUrl: file.url, gear });
      } else {
        response = await analyzeVideo({ fileUrl: file.url, gear });
      }

      if (!response.success || !response.data) {
        throw new Error("Invalid AI response");
      }

      const aiData = response.data.aiSuggestions || response.data;

      const project: Project = {
        title: file.name.split(".")[0] || "Untitled Project",
        type: file.type,
        fileUrl: file.url,
        gear,
        analysis:
          file.type === "image"
            ? {
                angles: aiData.angles,
                settings: aiData.settings,
                environment: aiData.environment,
              }
            : undefined,
        shotPlan: file.type === "image" ? aiData.shotPlan : undefined,
        videoScenes: file.type === "video" ? aiData.scenes || [] : undefined,
        timestamp: new Date().toISOString(),
      };

      set({ currentProject: project });
      toast.success("✅ Analysis complete!");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("❌ Analysis failed. Please try again.");
    } finally {
      set({ isAnalyzing: false });
    }
  },

  loadProject: async (id) => {
    try {
      const project = await getProject(id);
      set({ currentProject: project });
    } catch (error) {
      console.error("Failed to load project:", error);
      toast.error("Failed to load project");
    }
  },

  saveCurrentSuggestion: async () => {
    const { currentProject } = get();
    if (!currentProject) {
      toast.error("No project to save");
      return;
    }

    try {
      const savedProject = await saveProject(currentProject);
      set({ currentProject: { ...currentProject, id: savedProject.id } });
      toast.success("Suggestion saved!");
    } catch (error) {
      console.error("Failed to save suggestion:", error);
      toast.error("Failed to save suggestion");
    }
  },

  exportShotPlan: () => {
    const { currentProject } = get();
    if (!currentProject?.shotPlan && !currentProject?.videoScenes) {
      toast.error("No shot plan or video scenes to export");
      return;
    }

    const exportData = {
      project: currentProject.title,
      type: currentProject.type,
      gear: currentProject.gear,
      ...(currentProject.shotPlan && { shotPlan: currentProject.shotPlan }),
      ...(currentProject.videoScenes && {
        videoScenes: currentProject.videoScenes,
      }),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.title}-plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Shot plan exported!");
  },
}));
