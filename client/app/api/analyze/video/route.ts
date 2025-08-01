import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, gear } = await request.json()

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock AI analysis response for video
    const mockResponse = {
      framing: `For this video scene, I recommend a smooth tracking shot with the ${gear.lens} lens. ${gear.gimbal ? `Using the ${gear.gimbal} will provide excellent stabilization for this movement.` : "Consider using a gimbal for smoother motion."}`,
      settings: {
        aperture: "f/5.6",
        iso: "200",
        shutter: "1/50",
      },
      angles: ["Tracking Shot", "Dynamic Movement"],
      shotPlan: {
        path: [
          { x: -8, y: 1, z: 10 },
          { x: -4, y: 2, z: 8 },
          { x: 0, y: 3, z: 6 },
          { x: 4, y: 2, z: 8 },
          { x: 8, y: 1, z: 10 },
        ],
        lookAt: { x: 0, y: 1, z: 0 },
      },
      scenes: [
        { timestamp: "0:00", description: "Opening wide shot" },
        { timestamp: "0:05", description: "Move to medium shot" },
        { timestamp: "0:10", description: "Close-up detail" },
      ],
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Video analysis error:", error)
    return NextResponse.json({ error: "Video analysis failed" }, { status: 500 })
  }
}
