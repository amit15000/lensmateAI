import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock project data - replace with actual database query
    const mockProject = {
      id,
      title: "Mountain Sunrise",
      type: "image",
      fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/mountain.jpg",
      gear: {
        camera: "Sony A7S III",
        lens: "24-70mm",
      },
      analysis: {
        framing: "For this mountain scene, I recommend a low-angle shot with the 24-70mm lens at around 35mm.",
        settings: {
          aperture: "f/8.0",
          iso: "100",
          shutter: "1/125",
        },
        angles: ["Rule of Thirds", "Wide Establishing Shot"],
      },
      shotPlan: {
        path: [
          { x: -5, y: 2, z: 8 },
          { x: -2, y: 3, z: 6 },
          { x: 0, y: 4, z: 4 },
          { x: 2, y: 3, z: 6 },
          { x: 5, y: 2, z: 8 },
        ],
        lookAt: { x: 0, y: 0, z: -5 },
      },
      timestamp: "2024-01-15T10:30:00Z",
    }

    return NextResponse.json(mockProject)
  } catch (error) {
    console.error("Failed to fetch project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
