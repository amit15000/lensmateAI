"use client"

import { useState, useEffect } from "react"
import { Clock, ImageIcon, Video, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/store/useProjectStore"
import { getProjects } from "@/utils/api"

interface Project {
  id: string
  title: string
  thumbnail: string
  type: "image" | "video"
  timestamp: string
  isActive?: boolean
}

export function SuggestionsFeed() {
  const { loadProject } = useProjectStore()
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [savedSuggestions, setSavedSuggestions] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const projects = await getProjects()

      // Mock data for demonstration
      const mockRecent: Project[] = [
        {
          id: "1",
          title: "Mountain Sunrise",
          thumbnail: "/placeholder.svg?height=80&width=120",
          type: "image",
          timestamp: "Just now",
          isActive: true,
        },
        {
          id: "2",
          title: "Night City",
          thumbnail: "/placeholder.svg?height=80&width=120",
          type: "video",
          timestamp: "Yesterday",
        },
        {
          id: "3",
          title: "Beach Sunset",
          thumbnail: "/placeholder.svg?height=80&width=120",
          type: "image",
          timestamp: "2 days ago",
        },
      ]

      const mockSaved: Project[] = [
        {
          id: "4",
          title: "Drone Orbit",
          thumbnail: "/placeholder.svg?height=60&width=60",
          type: "video",
          timestamp: "1 week ago",
        },
      ]

      setRecentProjects(mockRecent)
      setSavedSuggestions(mockSaved)
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = async (projectId: string) => {
    try {
      await loadProject(projectId)
    } catch (error) {
      console.error("Failed to load project:", error)
    }
  }

  if (loading) {
    return <SuggestionsFeedSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h2 className="text-lg font-semibold text-gray-200">SUGGESTIONS FEED</h2>
      </div>

      {/* Recent Uploads */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Recent Uploads</h3>

        <div className="space-y-3">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className={`group cursor-pointer rounded-lg p-3 transition-colors ${
                project.isActive ? "bg-blue-600/20 border border-blue-600/30" : "hover:bg-gray-700/50"
              }`}
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="flex space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={project.thumbnail || "/placeholder.svg"}
                    alt={project.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="absolute top-1 right-1">
                    {project.type === "video" ? (
                      <Video className="w-3 h-3 text-white" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-white truncate">{project.title}</h4>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{project.timestamp}</span>
                  </div>
                </div>

                {project.isActive && (
                  <div className="flex-shrink-0">
                    <div className="px-2 py-1 bg-blue-600 text-xs rounded text-white">Active</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Suggestions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Saved Suggestions</h3>

        <div className="space-y-3">
          {savedSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="group cursor-pointer hover:bg-gray-700/50 rounded-lg p-3 transition-colors"
              onClick={() => handleProjectClick(suggestion.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-4 h-4 text-gray-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-white truncate">{suggestion.title}</h4>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-sm">
            <Bookmark className="w-4 h-4 mr-2" />
            Save Current Suggestion
          </Button>
        </div>
      </div>
    </div>
  )
}

function SuggestionsFeedSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-right">
        <div className="shimmer h-6 bg-gray-700 rounded w-32 ml-auto" />
      </div>

      <div className="space-y-3">
        <div className="shimmer h-4 bg-gray-700 rounded w-24" />

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3 p-3">
              <div className="shimmer w-16 h-12 bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-4 bg-gray-700 rounded w-3/4" />
                <div className="shimmer h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
