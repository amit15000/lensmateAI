"use client"

import { FileText, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/store/useProjectStore"

export function Header() {
  const { currentProject, exportShotPlan } = useProjectStore()

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lensmate AI</h1>
            <p className="text-xs text-gray-400">Cinematic Assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FileText className="w-4 h-4" />
          <span>New Project</span>
          <span className="text-gray-600">|</span>
          <span>Project: {currentProject?.title || "Untitled"}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportShotPlan}
          disabled={!currentProject?.shotPlan}
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Shot Plan
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">JD</div>
      </div>
    </header>
  )
}
