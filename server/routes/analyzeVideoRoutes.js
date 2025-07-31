import express from "express";
import { analyzeVideo } from "../controllers/analyzeVideoController.js";

const router = express.Router();
router.post("/", analyzeVideo);
export default router;
