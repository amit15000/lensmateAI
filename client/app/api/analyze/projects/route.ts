import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock projects data - replace with actual database query
    const mockProjects = [
      {
        id: "1",
        title: "Mountain Sunrise",
        type: "image",
        thumbnail: "/placeholder.svg?height=80&width=120",
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "Night City",
        type: "video",
        thumbnail: "/placeholder.svg?height=80&width=120",
        timestamp: "2024-01-14T15:45:00Z",
      },
      {
        id: "3",
        title: "Beach Sunset",
        type: "image",
        thumbnail: "/placeholder.svg?height=80&width=120",
        timestamp: "2024-01-13T18:20:00Z",
      },
    ]

    return NextResponse.json(mockProjects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
