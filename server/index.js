import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import analyzeImageRoutes from "./routes/analyzeImageRoutes.js";
import analyzeVideoRoutes from "./routes/analyzeVideoRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- IMPORTANT: Parses JSON
app.use(express.urlencoded({ extended: true }));
// app.use(express.json({ limit: "10mb" }));

// DB Connection
connectDB();

// Routes

app.use("/api/upload", uploadRoutes);
app.use("/api/analyze/image", analyzeImageRoutes);
app.use("/api/analyze/video", analyzeVideoRoutes);
// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
