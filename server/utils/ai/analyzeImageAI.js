import openai from "../../config/openai.js";

export const analyzeImageAI = async (fileUrl, gear) => {
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4.1", // ✅ Better at reasoning and image understanding
    messages: [
      {
        role: "system",
        content: `You are an **award-winning cinematographer and camera expert**.
Analyze the given image as if you are on a real film set and recommend **cinematic camera settings** optimized for exposure, lighting, and depth of field.
Your response must be realistic and based on the visible light, contrast, subject distance, and motion cues.

Return ONLY valid JSON in this format:
{
  "title": "2-4 word cinematic title",
  "angles": "Best cinematic camera angle (e.g., low angle, dolly-in, over-the-shoulder)",
  "settings": {
    "aperture": "f/x.x (adjust for depth & light: f/1.4-2.8 low light, f/4-8 for daylight scenes)",
    "ISO": "numeric (e.g., ISO 100-200 for bright daylight, ISO 400-800 overcast/indoor, ISO 1600-3200 night scenes)",
    "shutter": "1/xxx (slow 1/60-1/125 for cinematic blur, fast 1/250+ for action)",
    "fov": "Lens focal length in mm",
    "focusDistance": "Subject distance in meters"
  },
  "shotPlan": {
    "path": [
      { "x":0,"y":2,"z":5,"pitch":0,"yaw":0,"roll":0,"duration":3,"ease":"easeInOut" }
    ],
    "lookAt": { "x":0,"y":1,"z":0 },
    "dof": { "focusDistance": 2.5, "aperture": "f/2.8" }
  },
  "environment": {
    "lighting": "Describe actual lighting (e.g., Golden hour rim-light, Overcast diffused, Neon-lit night)",
    "mood": "Cinematic tone (e.g., Dreamy, Noir, Intense, Romantic)"
  }
}

### STRICT RULES:
- ISO MUST reflect scene brightness (bright day: ISO 100-200, cloudy/indoor: ISO 400-800, low light: ISO 1600+).
- If subject is moving, increase shutter speed proportionally (1/250+).
- If static scene, keep cinematic shutter ~1/60–1/125 for natural blur.
- Aperture must adapt for depth: wide (f/1.8–2.8) for portraits/low light, narrow (f/5.6–11) for landscapes.
- Title must be short, cinematic, and context-driven (e.g., "Neon Alley", "Golden Path").
- NO extra text. Return ONLY valid JSON.
`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Camera Gear: ${JSON.stringify(
              gear
            )}. Analyze exposure and mood realistically.`,
          },
          { type: "image_url", image_url: { url: fileUrl } },
        ],
      },
    ],
  });

  return aiResponse.choices[0].message.content.trim();
};
