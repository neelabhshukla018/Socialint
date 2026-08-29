import { Router } from "express";

import {
  getPostAnalysisController,
} from "../controllers/postAnalysis.controller.js";

const router = Router();

// Get post analysis for a profile
// GET /api/post-analysis?profileId=1
router.get("/", getPostAnalysisController);

export default router;