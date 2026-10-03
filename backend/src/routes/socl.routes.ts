import { Router } from "express";
import {
  chatWithSoclController,
  getSoclSuggestionsController,
} from "../controllers/socl.controller.js";

const router = Router();

router.post("/chat", chatWithSoclController);
router.get("/suggestions", getSoclSuggestionsController);

export default router;
