import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, gear } = await request.json();

    // ✅ Validate input
    if (!fileUrl || !gear?.camera || !gear?.lens) {
      return NextResponse.json(
        { error: "fileUrl, camera, and lens are required" },
        { status: 400 }
      );
    }

    // ✅ Correct backend endpoint: /api/analyze/image
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/analyze/image`,
      { fileUrl, gear }
    );

    // ✅ Check success
    if (!res.data.success) {
      throw new Error(res.data.message || "Backend returned an error");
    }

    // ✅ Return AI suggestions (backend sends { success, data: project })
    return NextResponse.json(res.data.data.aiSuggestions);
  } catch (error: any) {
    console.error(
      "Analysis error:",
      error.response?.data || error.message || error
    );
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
