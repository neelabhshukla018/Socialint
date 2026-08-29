import type { Request, Response } from "express";

import {
  getPostAnalysis,
} from "../services/postAnalysis.service.js";

/**
 * GET /api/post-analysis?profileId=1
 *
 * Returns calculated analysis for all posts
 * belonging to a monitoring profile.
 */
export async function getPostAnalysisController(
  req: Request,
  res: Response
) {
  try {
    const profileId = Number(req.query.profileId);

    // Validate profileId
    if (!profileId || Number.isNaN(profileId)) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    // Get calculated post analysis
    const analysis = await getPostAnalysis(profileId);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error(
      "Get post analysis error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch post analysis.";

    // Profile doesn't exist
    if (
      message === "Monitoring profile not found."
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
}