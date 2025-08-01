import openai from "../../config/openai.js";

export const analyzeVideoAI = async (frameUrls, gear) => {
  console.log("Analyzing frames:", frameUrls.length);

  const messages = [
    {
      role: "system",
      content: `You are an **award-winning cinematographer and video director**.
Analyze a sequence of frames and return cinematic camera suggestions.

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
    "path": [{ "x":0, "y":2, "z":5, "pitch":0, "yaw":0, "roll":0, "duration":3 }],
    "lookAt": { "x":0, "y":1, "z":0 }
  },
  "environment": {
    "lighting": "Describe scene lighting",
    "mood": "Cinematic mood tone"
  },
  "scenes": [
    {
      "sceneId": 1,
      "title": "Scene title",
      "description": "Brief cinematic description",
      "angles": "Best angle",
      "settings": { "aperture": "f/x.x", "ISO": "xxx", "shutter": "1/xxx" },
      "shotPlan": {
        "path": [{ "x":0,"y":2,"z":5,"pitch":0,"yaw":0,"roll":0,"duration":3 }],
        "lookAt": { "x":0,"y":1,"z":0 }
      },
      "environment": { "lighting": "Scene lighting", "mood": "Scene mood" }
    }
  ]
}`,
    },
    {
      role: "user",
      content: [
        { type: "text", text: `Camera Gear: ${JSON.stringify(gear)}` },
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

  console.log("Raw AI Output:", content);

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI did not return valid JSON");

  return JSON.parse(jsonMatch[0]); // ✅ Returns aiSuggestions structured like image
};
