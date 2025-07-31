import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import axios from "axios";

// ✅ Always use local FFmpeg binary
const localFfmpegPath = path.resolve("bin", "ffmpeg.exe");
ffmpeg.setFfmpegPath(localFfmpegPath);

console.log("🎯 Using FFmpeg binary from:", localFfmpegPath);

/**
 * Extract frames from a video using scene cut detection or fixed interval.
 * @param {string} videoUrl - Video URL or local path
 * @param {string} outputDir - Directory to save frames
 * @param {boolean} sceneCut - Enable scene detection (true) or fixed interval (false)
 * @param {number} threshold - Scene detection threshold (0.1-1.0)
 * @param {number} intervalSec - Interval in seconds for fixed frame extraction
 */
export const extractFrames = async (
  videoUrl,
  outputDir,
  sceneCut = true,
  threshold = 0.4,
  intervalSec = 2
) => {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const localVideoPath = path.join(outputDir, "temp_video.mp4");

    // ✅ Download video locally if remote URL
    if (videoUrl.startsWith("http")) {
      console.log("⬇️ Downloading video for processing...");
      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "arraybuffer",
      });
      fs.writeFileSync(localVideoPath, Buffer.from(response.data));
    } else {
      fs.copyFileSync(videoUrl, localVideoPath);
    }

    return new Promise((resolve, reject) => {
      console.log("🎬 Starting frame extraction...");
      const command = ffmpeg(localVideoPath)
        .setFfmpegPath(localFfmpegPath)
        .output(path.join(outputDir, "frame-%04d.jpg"));

      if (sceneCut) {
        command
          .addOption(`-vf`, `select='gt(scene,${threshold})',showinfo`)
          .addOption(`-vsync`, `vfr`);
      } else {
        command.outputOptions([`-vf`, `fps=1/${intervalSec}`]);
      }

      // ✅ Handle events
      command
        .on("start", (cmd) => console.log("▶ FFmpeg command:", cmd))
        .on("stderr", (stderr) => {
          if (stderr.includes("Parsed_showinfo"))
            console.log("ℹ Scene Info:", stderr);
        })
        .on("end", () => {
          console.log("✅ Frame extraction complete.");
          const frames = fs
            .readdirSync(outputDir)
            .filter((f) => f.endsWith(".jpg"))
            .map((f) => path.join(outputDir, f));

          console.log(`📸 Extracted ${frames.length} frames:`, frames);
          resolve(frames);
        })
        .on("error", (err) => {
          console.error("❌ FFmpeg error:", err);
          reject(err);
        })
        .run();
    });
  } catch (err) {
    console.error("❌ Frame extraction failed:", err.message);
    throw err;
  }
};
