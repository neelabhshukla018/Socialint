import type { Request, Response } from "express";

import {
  createAudienceInsight,
  getAudienceInsights,
  getAudienceInsightById,
  updateAudienceInsight,
  deleteAudienceInsight,
} from "../services/audience.service.js";

/**
 * POST /api/audience
 * Create an audience insight
 */
export async function createAudienceInsightController(
  req: Request,
  res: Response
) {
  try {
    const {
      profileId,
      category,
      value,
      percentage,
      description,
    } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "category is required.",
      });
    }

    if (!value || typeof value !== "string") {
      return res.status(400).json({
        success: false,
        message: "value is required.",
      });
    }

    if (
      percentage !== undefined &&
      (typeof percentage !== "number" ||
        percentage < 0 ||
        percentage > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "percentage must be a number between 0 and 100.",
      });
    }

    const insight = await createAudienceInsight({
      profileId: Number(profileId),
      category,
      value,
      percentage,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Audience insight created successfully.",
      data: insight,
    });
  } catch (error) {
    console.error(
      "Create audience insight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create audience insight.",
    });
  }
}

/**
 * GET /api/audience?profileId=1
 * Get all audience insights for a profile
 */
export async function getAudienceInsightsController(
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

    const insights =
      await getAudienceInsights(profileId);

    return res.status(200).json({
      success: true,
      count: insights.length,
      data: insights,
    });
  } catch (error) {
    console.error(
      "Get audience insights error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audience insights.",
    });
  }
}

/**
 * GET /api/audience/:id
 * Get one audience insight
 */
export async function getAudienceInsightController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience insight ID.",
      });
    }

    const insight =
      await getAudienceInsightById(id);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Audience insight not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: insight,
    });
  } catch (error) {
    console.error(
      "Get audience insight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audience insight.",
    });
  }
}

/**
 * PATCH /api/audience/:id
 * Update an audience insight
 */
export async function updateAudienceInsightController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience insight ID.",
      });
    }

    const {
      category,
      value,
      percentage,
      description,
    } = req.body;

    if (
      category !== undefined &&
      typeof category !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "category must be a string.",
      });
    }

    if (
      value !== undefined &&
      typeof value !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "value must be a string.",
      });
    }

    if (
      percentage !== undefined &&
      percentage !== null &&
      (typeof percentage !== "number" ||
        percentage < 0 ||
        percentage > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "percentage must be between 0 and 100.",
      });
    }

    const insight =
      await updateAudienceInsight(id, {
        category,
        value,
        percentage,
        description,
      });

    return res.status(200).json({
      success: true,
      message: "Audience insight updated successfully.",
      data: insight,
    });
  } catch (error) {
    console.error(
      "Update audience insight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update audience insight.",
    });
  }
}

/**
 * DELETE /api/audience/:id
 * Delete an audience insight
 */
export async function deleteAudienceInsightController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience insight ID.",
      });
    }

    await deleteAudienceInsight(id);

    return res.status(200).json({
      success: true,
      message: "Audience insight deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete audience insight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete audience insight.",
    });
  }
}