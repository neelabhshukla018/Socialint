import type { Request, Response } from "express";

import {
  getAnalytics,
} from "../services/analytics.service.js";

/**
 * GET /api/analytics?profileId=1
 *
 * Returns calculated analytics for a monitoring profile.
 */
export async function getAnalyticsController(
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

    // Get calculated analytics
    const analytics = await getAnalytics(profileId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get analytics error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch analytics.";

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