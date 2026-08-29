import { Router } from "express";

import {
  getPostAnalysisController,
  analyzePostController,
} from "../controllers/postAnalysis.controller.js";

const router = Router();

/**
 * Get post analytics for a monitoring profile.
 *
 * GET /api/post-analysis?profileId=1
 */
router.get(
  "/",
  getPostAnalysisController
);

/**
 * Analyze a single post using Gemini AI.
 *
 * POST /api/post-analysis/analyze
 *
 * Body:
 * {
 *   "url": "https://x.com/..."
 * }
 */
router.post(
  "/analyze",
  analyzePostController
);

export default router;