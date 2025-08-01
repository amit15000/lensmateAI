import express from "express";
import { getSuggestions } from "../controllers/projectController.js";
import { saveProject } from "../controllers/projectController.js";
const router = express.Router();

router.get("/suggestions", getSuggestions);
router.post("/save", saveProject);
export default router;
