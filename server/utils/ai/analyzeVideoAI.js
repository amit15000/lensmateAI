import openai from "../../config/openai.js";

export const analyzeVideoAI = async (frameUrls, gear) => {
  const messages = [
    {
      role: "system",
      content: `You are an **award-winning cinematographer and video director**.
You must deeply analyze each video frame (brightness, contrast, subject motion) to provide authentic cinematic camera plans.

Return STRICT JSON ONLY in this format:
{
  "title": "2-4 word cinematic title",
  "angles": "Overall best cinematic angle",
  "settings": {
    "aperture": "f/x.x",
    "ISO": "numeric",
    "shutter": "1/xxx"
  },
  "shotPlan": {
    "path": [
      { "x":0, "y":2, "z":5, "pitch":0, "yaw":0, "roll":0, "duration":3, "ease":"easeInOut" }
    ],
    "lookAt": { "x":0, "y":1, "z":0 }
  },
  "environment": {
    "lighting": "Describe scene lighting (e.g., Golden hour, Overcast diffused, Neon night)",
    "mood": "Cinematic tone (e.g., Dreamy, Noir, Intense, Romantic)"
  },
  "scenes": [
    {
      "sceneId": 1,
      "title": "Scene title",
      "description": "Brief cinematic description of scene",
      "angles": "Best camera angle",
      "settings": { "aperture": "f/x.x", "ISO": "xxx", "shutter": "1/xxx" },
      "shotPlan": {
        "path": [
          { "x":0, "y":2, "z":5, "pitch":0, "yaw":0, "roll":0, "duration":3, "ease":"easeInOut" }
        ],
        "lookAt": { "x":0, "y":1, "z":0 }
      },
      "environment": { "lighting": "Scene lighting", "mood": "Scene mood" }
    }
  ]
}

### STRICT RULES:
1️⃣ **Lighting & ISO (Frame Analysis)**:
- Analyze frame sequence for lighting shifts.
- Daylight or strong sun → ISO 100–200.
- Overcast/indoor diffused → ISO 400–800.
- Night/neon/dark scenes → ISO 1600–3200.
- DO NOT default to ISO 100 unless scene is visibly bright daylight.

2️⃣ **Scene Splitting**:
- Identify changes in lighting, camera perspective, or motion to split video into **multiple scenes** (at least 2 if frames differ significantly).

3️⃣ **Settings Logic**:
- Aperture: f/1.8–2.8 (shallow DOF/low light), f/4–8 (daylight/mid-depth), f/8–11 (landscape).
- Shutter: 1/60–1/125 (cinematic blur for static), 1/250+ (motion/action).
- Adjust per scene based on frame analysis.

4️⃣ **Shot Plans**:
- Each scene MUST include **5–8 waypoints** (dolly, crane, orbit, pan).
- Include **easing variation** ("easeIn", "easeOut", "easeInOut", "linear").

5️⃣ **Environment & Mood**:
- Lighting must match visual cues (e.g., cool fluorescent indoor vs warm sunset).
- Mood must reflect cinematic tone inferred from frames.

⚠️ JSON ONLY. No markdown, no explanations.`,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Camera Gear: ${JSON.stringify(
            gear
          )}. Analyze lighting frame-by-frame, split scenes if visual conditions differ.`,
        },
        ...frameUrls.map((url) => ({ type: "image_url", image_url: { url } })),
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages,
  });

  let content = response.choices[0].message.content.trim();
  content = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI did not return valid JSON");

  return JSON.parse(jsonMatch[0]); // ✅ Clean parsed JSON result
};
