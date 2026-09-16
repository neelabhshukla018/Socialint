import { Router } from "express";
import {
  ingestPostsController,
  previewIngestionController,
} from "../controllers/ingestion.controller.js";

const router = Router();

// Ingest and persist posts with Python ML sentiment & emotion
// POST /api/ingestion/posts?profileId=1
router.post("/posts", ingestPostsController);

// Preview/dry-run ingestion without saving to DB
// POST /api/ingestion/preview
router.post("/preview", previewIngestionController);

export default router;
