import fs from "fs";
import path from "path";
import ffmpegPath from "ffmpeg-static";

console.log("Running");
const dest = path.resolve("bin", "ffmpeg.exe");
const src = path.resolve(ffmpegPath);

if (!fs.existsSync("bin")) fs.mkdirSync("bin");

fs.copyFileSync(src, dest);
console.log("✅ FFmpeg copied to:", dest);
