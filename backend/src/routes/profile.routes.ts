import { Router } from "express";

import {
  createProfileController,
  getProfilesController,
} from "../controllers/profile.controller.js";

const router = Router();

router.post("/", createProfileController);

router.get("/", getProfilesController);

export default router;