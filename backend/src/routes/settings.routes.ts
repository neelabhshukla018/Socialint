import { Router } from "express";

import {
  getUserSettings,
  updateUserSettings,
} from "../controllers/settings.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getUserSettings);

router.patch("/", authMiddleware, updateUserSettings);

export default router;