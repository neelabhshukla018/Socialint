import type { Request, Response } from "express";

import {
  createTrend,
  getTrends,
  getTrendById,
  updateTrend,
  deleteTrend,
} from "../services/trend.service.js";

export async function createTrendController(
  req: Request,
  res: Response
) {
  try {
    const {
      profileId,
      name,
      hashtag,
      mentions,
      growth,
      momentum,
      rank,
      periodStart,
      periodEnd,
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

    const trend = await createTrend({
      profileId: Number(profileId),
      name,
      hashtag,
      mentions:
        mentions !== undefined ? Number(mentions) : undefined,
      growth:
        growth !== undefined ? Number(growth) : undefined,
      momentum:
        momentum !== undefined ? Number(momentum) : undefined,
      rank:
        rank !== undefined ? Number(rank) : undefined,
      periodStart,
      periodEnd,
    });

    return res.status(201).json({
      success: true,
      message: "Trend created successfully.",
      data: trend,
    });
  } catch (error) {
    console.error("Create trend error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create trend.",
    });
  }
}

export async function getTrendsController(
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

    const trends = await getTrends(profileId);

    return res.status(200).json({
      success: true,
      count: trends.length,
      data: trends,
    });
  } catch (error) {
    console.error("Get trends error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trends.",
    });
  }
}

export async function getTrendController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trend ID.",
      });
    }

    const trend = await getTrendById(id);

    if (!trend) {
      return res.status(404).json({
        success: false,
        message: "Trend not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: trend,
    });
  } catch (error) {
    console.error("Get trend error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trend.",
    });
  }
}

export async function updateTrendController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trend ID.",
      });
    }

    const trend = await updateTrend(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Trend updated successfully.",
      data: trend,
    });
  } catch (error) {
    console.error("Update trend error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update trend.",
    });
  }
}

export async function deleteTrendController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trend ID.",
      });
    }

    await deleteTrend(id);

    return res.status(200).json({
      success: true,
      message: "Trend deleted successfully.",
    });
  } catch (error) {
    console.error("Delete trend error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete trend.",
    });
  }
}