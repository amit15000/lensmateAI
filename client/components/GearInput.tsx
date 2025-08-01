"use client"

import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProjectStore } from "@/store/useProjectStore"

const CAMERAS = ["Sony A7S III", "Sony A7R V", "Canon R5", "Canon R6 Mark II", "Nikon Z9", "Panasonic GH6"]

const LENSES = [
  { name: "24-70mm", subtitle: "f/2.8 Zoom" },
  { name: "50mm", subtitle: "f/1.4 Prime" },
  { name: "85mm", subtitle: "f/1.8 Prime" },
]

export function GearInput() {
  const { gear, setGear, uploadedFile, analyzeScene, isAnalyzing } = useProjectStore()
  const [showCameraDropdown, setShowCameraDropdown] = useState(false)
  const [customGimbal, setCustomGimbal] = useState("")

  const handleGenerateSuggestions = async () => {
    if (!uploadedFile) {
      return
    }

    const gearData = {
      camera: gear.camera,
      lens: gear.lens,
      ...(customGimbal && { gimbal: customGimbal }),
    }

    await analyzeScene(uploadedFile, gearData)
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-lg font-semibold text-gray-200">YOUR GEAR</h2>

      {/* Camera Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Camera</label>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between bg-gray-700 border-gray-600 hover:bg-gray-600"
            onClick={() => setShowCameraDropdown(!showCameraDropdown)}
          >
            {gear.camera}
            <ChevronDown className="w-4 h-4" />
          </Button>

          {showCameraDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
              {CAMERAS.map((camera) => (
                <button
                  key={camera}
                  className="w-full px-3 py-2 text-left hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    setGear({ ...gear, camera })
                    setShowCameraDropdown(false)
                  }}
                >
                  {camera}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lens Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Lens</label>
        <div className="grid grid-cols-2 gap-2">
          {LENSES.map((lens) => (
            <Button
              key={lens.name}
              variant={gear.lens === lens.name ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-start ${
                gear.lens === lens.name
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              }`}
              onClick={() => setGear({ ...gear, lens: lens.name })}
            >
              <span className="font-medium">{lens.name}</span>
              <span className="text-xs text-gray-400">{lens.subtitle}</span>
            </Button>
          ))}
        </div>

        <Button variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 border-dashed">
          <Plus className="w-4 h-4 mr-2" />
          Add Lens
        </Button>
      </div>

      {/* Stabilization */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Stabilization</label>
        <Input
          placeholder="e.g., DJI Ronin S, Gimbal type..."
          value={customGimbal}
          onChange={(e) => setCustomGimbal(e.target.value)}
          className="bg-gray-700 border-gray-600 focus:border-blue-500"
        />
      </div>

      {/* Generate Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
        onClick={handleGenerateSuggestions}
        disabled={!uploadedFile || isAnalyzing}
      >
        {isAnalyzing ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Analyzing...
          </div>
        ) : (
          <>
            <span className="mr-2">✨</span>
            Generate Cinematic Suggestions
          </>
        )}
      </Button>
    </div>
  )
}
