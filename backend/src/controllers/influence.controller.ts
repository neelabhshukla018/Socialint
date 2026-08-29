import type { Request, Response } from "express";

import {
  createInfluenceNode,
  getInfluenceNodes,
  getInfluenceNodeById,
  updateInfluenceNode,
  deleteInfluenceNode,
  createInfluenceConnection,
  getInfluenceConnections,
  deleteInfluenceConnection,
} from "../services/influence.service.js";

/* =========================================================
   INFLUENCE NODES
   ========================================================= */

/**
 * POST /api/influence/nodes
 * Create an influence node
 */
export async function createInfluenceNodeController(
  req: Request,
  res: Response
) {
  try {
    const {
      profileId,
      name,
      username,
      category,
      influenceScore,
      xPosition,
      yPosition,
    } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "name is required.",
      });
    }

    const node = await createInfluenceNode({
      profileId: Number(profileId),
      name,
      username,
      category,
      influenceScore:
        influenceScore !== undefined
          ? Number(influenceScore)
          : undefined,
      xPosition:
        xPosition !== undefined
          ? Number(xPosition)
          : undefined,
      yPosition:
        yPosition !== undefined
          ? Number(yPosition)
          : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Influence node created successfully.",
      data: node,
    });
  } catch (error) {
    console.error(
      "Create influence node error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create influence node.",
    });
  }
}

/**
 * GET /api/influence/nodes?profileId=1
 * Get all influence nodes for a profile
 */
export async function getInfluenceNodesController(
  req: Request,
  res: Response
) {
  try {
    const profileId = Number(req.query.profileId);

    if (!profileId || Number.isNaN(profileId)) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    const nodes = await getInfluenceNodes(profileId);

    return res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    console.error(
      "Get influence nodes error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch influence nodes.",
    });
  }
}

/**
 * GET /api/influence/nodes/:id
 * Get one influence node
 */
export async function getInfluenceNodeController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid influence node ID.",
      });
    }

    const node = await getInfluenceNodeById(id);

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Influence node not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: node,
    });
  } catch (error) {
    console.error(
      "Get influence node error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch influence node.",
    });
  }
}

/**
 * PATCH /api/influence/nodes/:id
 * Update influence node
 */
export async function updateInfluenceNodeController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid influence node ID.",
      });
    }

    const {
      name,
      username,
      category,
      influenceScore,
      xPosition,
      yPosition,
    } = req.body;

    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (username !== undefined) {
      data.username = username;
    }

    if (category !== undefined) {
      data.category = category;
    }

    if (influenceScore !== undefined) {
      data.influenceScore = Number(influenceScore);
    }

    if (xPosition !== undefined) {
      data.xPosition = Number(xPosition);
    }

    if (yPosition !== undefined) {
      data.yPosition = Number(yPosition);
    }

    const node = await updateInfluenceNode(id, data);

    return res.status(200).json({
      success: true,
      message: "Influence node updated successfully.",
      data: node,
    });
  } catch (error) {
    console.error(
      "Update influence node error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update influence node.",
    });
  }
}

/**
 * DELETE /api/influence/nodes/:id
 */
export async function deleteInfluenceNodeController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid influence node ID.",
      });
    }

    await deleteInfluenceNode(id);

    return res.status(200).json({
      success: true,
      message: "Influence node deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete influence node error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete influence node.",
    });
  }
}


/* =========================================================
   INFLUENCE CONNECTIONS
   ========================================================= */

/**
 * POST /api/influence/connections
 * Create a connection between two nodes
 */
export async function createInfluenceConnectionController(
  req: Request,
  res: Response
) {
  try {
    const {
      fromNodeId,
      toNodeId,
      strength,
      interactions,
    } = req.body;

    if (!fromNodeId || !toNodeId) {
      return res.status(400).json({
        success: false,
        message:
          "fromNodeId and toNodeId are required.",
      });
    }

    if (Number(fromNodeId) === Number(toNodeId)) {
      return res.status(400).json({
        success: false,
        message:
          "A node cannot connect to itself.",
      });
    }

    const connection =
      await createInfluenceConnection({
        fromNodeId: Number(fromNodeId),
        toNodeId: Number(toNodeId),
        strength:
          strength !== undefined
            ? Number(strength)
            : undefined,
        interactions:
          interactions !== undefined
            ? Number(interactions)
            : undefined,
      });

    return res.status(201).json({
      success: true,
      message:
        "Influence connection created successfully.",
      data: connection,
    });
  } catch (error) {
    console.error(
      "Create influence connection error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create influence connection.",
    });
  }
}

/**
 * GET /api/influence/connections?profileId=1
 * Get all connections for a profile
 */
export async function getInfluenceConnectionsController(
  req: Request,
  res: Response
) {
  try {
    const profileId = Number(req.query.profileId);

    if (!profileId || Number.isNaN(profileId)) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    const connections =
      await getInfluenceConnections(profileId);

    return res.status(200).json({
      success: true,
      count: connections.length,
      data: connections,
    });
  } catch (error) {
    console.error(
      "Get influence connections error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch influence connections.",
    });
  }
}

/**
 * DELETE /api/influence/connections/:id
 */
export async function deleteInfluenceConnectionController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid connection ID.",
      });
    }

    await deleteInfluenceConnection(id);

    return res.status(200).json({
      success: true,
      message:
        "Influence connection deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete influence connection error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete influence connection.",
    });
  }
}