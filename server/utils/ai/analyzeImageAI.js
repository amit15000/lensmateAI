import openai from "../../config/openai.js";

export const analyzeImageAI = async (fileUrl, gear) => {
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4.1", // ✅ Best at reasoning + vision
    messages: [
      {
        role: "system",
        content: `You are an **award-winning cinematographer and camera expert**.
You must **analyze the actual image content** (brightness, lighting, shadows, and visible details) before giving recommendations.

Return ONLY valid JSON in this format:
{
  "title": "2-4 word cinematic title",
  "angles": "Best cinematic camera angle",
  "settings": {
    "aperture": "f/x.x",
    "ISO": "numeric",
    "shutter": "1/xxx",
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
    "lighting": "Describe actual lighting",
    "mood": "Cinematic tone"
  }
}

### STRICT RULES:
1️⃣ **Analyze image lighting first**:  
- If strong sunlight or clear shadows → ISO 100–200.  
- If cloudy, indoor, or diffused → ISO 400–800.  
- If dark/night/neon-lit → ISO 1600–3200.  
- NEVER default to ISO 100 without visible proof of bright daylight.  

2️⃣ **Settings Logic**:
- Aperture adapts for depth: f/1.8–2.8 for shallow DOF/low light, f/5.6–11 for landscapes/daylight.
- Shutter: Static scenes use 1/60–1/125 (cinematic blur). Motion scenes need 1/250+.  
- FOV based on framing: 24–35mm for wide, 50mm+ for portraits.

3️⃣ **Shot Plan**:
- Must contain 5–8 waypoints.
- Include at least **two motion types**: dolly-in/out, orbit (yaw change), crane up/down (y change), slow pan.
- Each waypoint uses a mix of easing: "easeIn", "easeOut", "easeInOut", "linear".

4️⃣ **Variation**:
- NEVER repeat same ISO, aperture, or path unless image visually demands it.
- Lighting description MUST match visible conditions (e.g., warm sunset, fluorescent office, neon night).

5️⃣ Title: Must be cinematic, unique, and mood-reflective.

⚠️ NO explanations or extra text. Output ONLY valid JSON.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Camera Gear: ${JSON.stringify(
              gear
            )}. Analyze the image deeply. DO NOT guess defaults. Base ISO, aperture, shutter strictly on actual lighting cues.`,
          },
          { type: "image_url", image_url: { url: fileUrl } },
        ],
      },
    ],
  });

  return aiResponse.choices[0].message.content.trim();
};
