import { Router } from "express";

import {
  createReportController,
  getReportsController,
  getReportController,
  updateReportController,
  deleteReportController,
} from "../controllers/report.controller.js";

const router = Router();

/* =========================================================
   REPORTS
   ========================================================= */

// Create a report
// POST /api/reports
router.post("/", createReportController);

// Get all reports for a profile
// GET /api/reports?profileId=1
router.get("/", getReportsController);

// Get one report
// GET /api/reports/1
router.get("/:id", getReportController);

// Update report
// PATCH /api/reports/1
router.patch("/:id", updateReportController);

// Delete report
// DELETE /api/reports/1
router.delete("/:id", deleteReportController);

export default router;