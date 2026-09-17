import { Router } from "express";

import {
  createProfileController,
  getProfilesController,
  getProfileController,
  updateProfileController,
  activateProfileController,
  deleteProfileController,
} from "../controllers/profile.controller.js";

const router = Router();

// Create profile
router.post("/", createProfileController);

// Get all profiles for a user
router.get("/", getProfilesController);

// Get single profile
router.get("/:id", getProfileController);

// Update profile
router.patch("/:id", updateProfileController);

// Set profile as active
router.patch("/:id/activate", activateProfileController);

// Delete profile
router.delete("/:id", deleteProfileController);

export default router;