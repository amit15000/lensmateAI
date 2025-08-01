import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, gear } = await request.json();

    // Validate input
    if (!fileUrl || !gear?.camera || !gear?.lens) {
      return NextResponse.json(
        { error: "fileUrl, camera, and lens are required" },
        { status: 400 }
      );
    }

    // Call backend API (image analysis)
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/image/analyze`,
      { fileUrl, gear }
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Backend returned an error");
    }

    // Return AI suggestions (backend returns project with aiSuggestions)
    return NextResponse.json(res.data.data.aiSuggestions);
  } catch (error) {
    console.error("Analysis error:", error.message || error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
