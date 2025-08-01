import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const project = await request.json()

    // Mock save to database - replace with actual database save
    const savedProject = {
      ...project,
      id: `project_${Date.now()}`,
      savedAt: new Date().toISOString(),
    }

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(savedProject)
  } catch (error) {
    console.error("Failed to save project:", error)
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}
