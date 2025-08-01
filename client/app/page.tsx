"use client";
import { Header } from "@/components/Header";
import { UploadPanel } from "@/components/UploadPanel";
import { GearInput } from "@/components/GearInput";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { SuggestionsFeed } from "@/components/SuggestionsFeed";
import { useProjectStore } from "@/store/useProjectStore";

export default function Home() {
  const { currentProject, isAnalyzing } = useProjectStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto scrollbar-hide">
          <UploadPanel />
          <GearInput />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          <AIAnalysisPanel />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto scrollbar-hide">
          <SuggestionsFeed />
        </div>
      </div>
    </div>
  );
}
