import { Router } from "express";

import {
  getDataSourcesController,
  getDataSourceController,
  connectDataSourceController,
  updateDataSourceController,
  disconnectDataSourceController,
  deleteDataSourceController,
} from "../controllers/dataSource.controller.js";

const router = Router();

// Get all sources for a profile
router.get("/", getDataSourcesController);

// Get one source
router.get("/:id", getDataSourceController);

// Connect / reconnect platform
router.post("/", connectDataSourceController);

// Update source
router.patch("/:id", updateDataSourceController);

// Disconnect source
router.patch(
  "/:id/disconnect",
  disconnectDataSourceController
);

// Permanently delete source
router.delete("/:id", deleteDataSourceController);

export default router;