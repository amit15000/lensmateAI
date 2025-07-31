import openai from "../../config/openai.js";

export const analyzeVideoAI = async (frameUrls, gear) => {
  console.log("Analyzing frames:", frameUrls.length);

  const messages = [
    {
      role: "system",
      content: `You are a cinematic assistant. Analyze multiple frames from a video and return STRICT JSON ONLY:
{
  "scenes": [
    {
      "sceneId": 1,
      "description": "string",
      "angles": "string",
      "settings": { "aperture": "f/2.8", "ISO": "100", "shutter": "1/120" },
      "shotPlan": {
        "path": [{ "x":0, "y":2, "z":5, "pitch":0, "yaw":0, "roll":0, "duration":3 }],
        "lookAt": { "x":0, "y":1, "z":0 }
      }
    }
  ]
}`,
    },
    {
      role: "user",
      content: [
        { type: "text", text: `Gear: ${JSON.stringify(gear)}` },
        ...frameUrls.map((url) => ({ type: "image_url", image_url: { url } })),
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  let content = response.choices[0].message.content.trim();

  // ✅ Remove Markdown fences if present
  content = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  console.log("Raw AI Output:", content); // Debugging log

  // ✅ Extract JSON inside braces
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI did not return valid JSON");

  return JSON.parse(jsonMatch[0]);
};
