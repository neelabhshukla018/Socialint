import { Router } from "express";

import {
  createInfluenceNodeController,
  getInfluenceNodesController,
  getInfluenceNodeController,
  updateInfluenceNodeController,
  deleteInfluenceNodeController,
  createInfluenceConnectionController,
  getInfluenceConnectionsController,
  deleteInfluenceConnectionController,
} from "../controllers/influence.controller.js";

const router = Router();

/* =========================================================
   INFLUENCE NODES
   ========================================================= */

// Create influence node
// POST /api/influence/nodes
router.post(
  "/nodes",
  createInfluenceNodeController
);

// Get all influence nodes for a profile
// GET /api/influence/nodes?profileId=1
router.get(
  "/nodes",
  getInfluenceNodesController
);

// Get one influence node
// GET /api/influence/nodes/1
router.get(
  "/nodes/:id",
  getInfluenceNodeController
);

// Update influence node
// PATCH /api/influence/nodes/1
router.patch(
  "/nodes/:id",
  updateInfluenceNodeController
);

// Delete influence node
// DELETE /api/influence/nodes/1
router.delete(
  "/nodes/:id",
  deleteInfluenceNodeController
);


/* =========================================================
   INFLUENCE CONNECTIONS
   ========================================================= */

// Create connection
// POST /api/influence/connections
router.post(
  "/connections",
  createInfluenceConnectionController
);

// Get connections for a profile
// GET /api/influence/connections?profileId=1
router.get(
  "/connections",
  getInfluenceConnectionsController
);

// Delete connection
// DELETE /api/influence/connections/1
router.delete(
  "/connections/:id",
  deleteInfluenceConnectionController
);

export default router;