import express from "express";
import { analyzeImage } from "../controllers/analyzeImageController.js";

const router = express.Router();
router.post("/", analyzeImage);
export default router;
