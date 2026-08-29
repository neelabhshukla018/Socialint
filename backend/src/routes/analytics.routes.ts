import { Router } from "express";

import {
  getAnalyticsController,
} from "../controllers/analytics.controller.js";

const router = Router();

// Get analytics for a monitoring profile
// GET /api/analytics?profileId=1
router.get("/", getAnalyticsController);

export default router;