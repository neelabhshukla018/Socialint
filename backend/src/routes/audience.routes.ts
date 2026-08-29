import { Router } from "express";

import {
  createAudienceInsightController,
  getAudienceInsightsController,
  getAudienceInsightController,
  updateAudienceInsightController,
  deleteAudienceInsightController,
} from "../controllers/audience.controller.js";

const router = Router();

// Create audience insight
// POST /api/audience
router.post("/", createAudienceInsightController);

// Get all audience insights for a profile
// GET /api/audience?profileId=1
router.get("/", getAudienceInsightsController);

// Get one audience insight
// GET /api/audience/1
router.get("/:id", getAudienceInsightController);

// Update audience insight
// PATCH /api/audience/1
router.patch("/:id", updateAudienceInsightController);

// Delete audience insight
// DELETE /api/audience/1
router.delete("/:id", deleteAudienceInsightController);

export default router;