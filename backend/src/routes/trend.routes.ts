import { Router } from "express";

import {
  createTrendController,
  getTrendsController,
  getTrendController,
  updateTrendController,
  deleteTrendController,
} from "../controllers/trend.controller.js";

const router = Router();

// Create trend
router.post("/", createTrendController);

// Get trends for a profile
// GET /api/trends?profileId=1
router.get("/", getTrendsController);

// Get one trend
// GET /api/trends/1
router.get("/:id", getTrendController);

// Update trend
// PATCH /api/trends/1
router.patch("/:id", updateTrendController);

// Delete trend
// DELETE /api/trends/1
router.delete("/:id", deleteTrendController);

export default router;