"use client";

import { create } from "zustand";
import {
  analyzeImage,
  analyzeVideo,
  getSuggestions,
  saveCurrentProject,
} from "@/utils/api";
import toast from "react-hot-toast";
import api from "@/utils/api";

// ---------------- Interfaces ----------------

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
  angles: string;
  settings: {
    aperture: string;
    ISO: string;
    shutter: string;
    fov?: string;
    focusDistance?: string;
  };
  environment: {
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
  title: string;
  description: string;
  angles: string;
  settings: { aperture: string; ISO: string; shutter: string };
  shotPlan: ShotPlan;
  environment: { lighting: string; mood: string };
}

interface Animation {
  shotPlan: ShotPlan;
  scenes?: VideoScene[];
}

interface Project {
  id?: string;
  title: string;
  type: "image" | "video";
  fileUrl: string;
  gear: Gear;
  analysis: Analysis;
  animation: Animation;
  timestamp: string;
}

interface ProjectStore {
  uploadedFile: UploadedFile | null;
  gear: Gear;
  currentProject: Project | null;
  suggestions: Project[];
  isUploading: boolean;
  isAnalyzing: boolean;
  isSaving: boolean;

  setUploadedFile: (file: UploadedFile | null) => void;
  setGear: (gear: Gear) => void;
  setIsUploading: (loading: boolean) => void;
  analyzeScene: (file: UploadedFile, gear: Gear) => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  saveCurrentSuggestion: () => Promise<void>;
  refreshSuggestions: () => Promise<void>;
  exportShotPlan: () => void;
}

// ---------------- Zustand Store ----------------

export const useProjectStore = create<ProjectStore>((set, get) => ({
  uploadedFile: null,
  gear: { camera: "Sony A7S III", lens: "24-70mm" },
  currentProject: null,
  suggestions: [],
  isUploading: false,
  isAnalyzing: false,
  isSaving: false,

  setUploadedFile: (file) => set({ uploadedFile: file }),
  setGear: (gear) => set({ gear }),
  setIsUploading: (isUploading) => set({ isUploading }),

  analyzeScene: async (file, gear) => {
    set({ isAnalyzing: true });
    try {
      const response =
        file.type === "image"
          ? await analyzeImage({ fileUrl: file.url, gear })
          : await analyzeVideo({ fileUrl: file.url, gear });

      if (!response.success || !response.data)
        throw new Error("Invalid AI response");

      const aiData = response.data.aiSuggestions || response.data;

      const project: Project = {
        title: aiData.title || file.name.split(".")[0] || "Untitled Project",
        type: file.type,
        fileUrl: file.url,
        gear,
        analysis: {
          angles: aiData.angles,
          settings: aiData.settings,
          environment: aiData.environment,
        },
        animation: {
          shotPlan: aiData.shotPlan,
          scenes: file.type === "video" ? aiData.scenes || [] : undefined,
        },
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
      const response = await api.get(`/projects/${id}`);
      set({ currentProject: response.data });
    } catch (error) {
      console.error("Failed to load project:", error);
      toast.error("Failed to load project");
    }
  },

  saveCurrentSuggestion: async () => {
    const { currentProject, refreshSuggestions } = get();
    if (!currentProject) {
      toast.error("No project to save");
      return;
    }

    set({ isSaving: true });
    try {
      // ✅ Convert analysis + animation into aiSuggestions for backend
      const payload = {
        fileUrl: currentProject.fileUrl,
        gear: currentProject.gear,
        aiSuggestions: {
          angles: currentProject.analysis.angles,
          settings: currentProject.analysis.settings,
          environment: currentProject.analysis.environment,
          shotPlan: currentProject.animation.shotPlan,
          ...(currentProject.type === "video" && {
            scenes: currentProject.animation.scenes || [],
          }),
        },
        type: currentProject.type,
        title: currentProject.title,
      };

      const savedProject = await saveCurrentProject(payload);
      set({ currentProject: { ...currentProject, id: savedProject.data.id } });

      toast.success("💾 Project saved!");
      await refreshSuggestions();
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project");
    } finally {
      set({ isSaving: false });
    }
  },

  refreshSuggestions: async () => {
    try {
      const suggestions = await getSuggestions();
      set({ suggestions });
    } catch (error) {
      console.error("Failed to refresh suggestions:", error);
      toast.error("Failed to load suggestions");
    }
  },

  exportShotPlan: () => {
    const { currentProject } = get();
    if (
      !currentProject?.animation?.shotPlan &&
      !currentProject?.animation?.scenes
    ) {
      toast.error("No shot plan or video scenes to export");
      return;
    }

    const exportData = {
      project: currentProject.title,
      type: currentProject.type,
      gear: currentProject.gear,
      analysis: currentProject.analysis,
      animation: currentProject.animation,
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

    toast.success("📤 Shot plan exported!");
  },
}));
