import { Router } from "express";

import {
  getUserSettings,
  updateUserSettings,
} from "../controllers/settings.controller.js";

const router = Router();

// Get user settings
// GET /api/settings
router.get("/", getUserSettings);

// Update user settings
// PATCH /api/settings
router.patch("/", updateUserSettings);

export default router;