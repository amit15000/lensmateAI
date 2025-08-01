import express from "express";
import { saveAnalysis } from "../controllers/saveAnalysisController.js";

const router = express.Router();

router.post("/", saveAnalysis);

export default router;
