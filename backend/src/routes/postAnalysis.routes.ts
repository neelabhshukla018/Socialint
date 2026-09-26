import { Router } from "express";

import {
  getPostAnalysisController,
  analyzePostController,
  proxyImageController,
} from "../controllers/postAnalysis.controller.js";

const router = Router();

/**
 * Proxy social-media image to prevent CORS / Referer restrictions.
 *
 * GET /api/post-analysis/proxy-image?url=...
 */
router.get("/proxy-image", proxyImageController);

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