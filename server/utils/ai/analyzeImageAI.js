import openai from "../../config/openai.js";

export const analyzeImageAI = async (fileUrl, gear) => {
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a cinematic photography assistant.
Analyze the given image and generate a STRICT JSON:
{
  "angles": "string",
  "settings": { "aperture": "f/2.8", "ISO": "100", "shutter": "1/120", "fov": "50", "focusDistance": "2.5" },
  "shotPlan": {
    "path": [
      { "x":0,"y":2,"z":5,"pitch":0,"yaw":0,"roll":0,"duration":3,"ease":"easeInOut" }
    ],
    "lookAt": { "x":0,"y":1,"z":0 },
    "dof": { "focusDistance": 2.5, "aperture": "f/2.8" }
  },
  "environment": { "lighting": "Soft", "mood": "Cinematic" }
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Gear: ${JSON.stringify(gear)}` },
          { type: "image_url", image_url: { url: fileUrl } },
        ],
      },
    ],
  });

  return aiResponse.choices[0].message.content.trim();
};
