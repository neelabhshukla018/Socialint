import type { Request, Response } from "express";

import {
  getDataSources,
  getDataSourceById,
  connectDataSource,
  updateDataSource,
  disconnectDataSource,
  deleteDataSource,
} from "../services/dataSource.service.js";

/**
 * GET /api/data-sources?profileId=1
 */
export async function getDataSourcesController(
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

    const dataSources = await getDataSources(profileId);

    return res.status(200).json({
      success: true,
      data: dataSources,
    });
  } catch (error) {
    console.error("Get data sources error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch data sources.",
    });
  }
}

/**
 * GET /api/data-sources/:id
 */
export async function getDataSourceController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data source ID.",
      });
    }

    const dataSource = await getDataSourceById(id);

    if (!dataSource) {
      return res.status(404).json({
        success: false,
        message: "Data source not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: dataSource,
    });
  } catch (error) {
    console.error("Get data source error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch data source.",
    });
  }
}

/**
 * POST /api/data-sources
 */
export async function connectDataSourceController(
  req: Request,
  res: Response
) {
  try {
    const {
      profileId,
      platform,
      username,
      profileUrl,
      externalId,
    } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    if (!platform) {
      return res.status(400).json({
        success: false,
        message: "platform is required.",
      });
    }

    const allowedPlatforms = [
      "X",
      "INSTAGRAM",
      "TELEGRAM",
      "YOUTUBE",
    ];

    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid platform. Use X, INSTAGRAM, TELEGRAM or YOUTUBE.",
      });
    }

    const dataSource = await connectDataSource({
      profileId: Number(profileId),
      platform,
      username,
      profileUrl,
      externalId,
    });

    return res.status(201).json({
      success: true,
      message: `${platform} connected successfully.`,
      data: dataSource,
    });
  } catch (error) {
    console.error("Connect data source error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to connect data source.",
    });
  }
}

/**
 * PATCH /api/data-sources/:id
 */
export async function updateDataSourceController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data source ID.",
      });
    }

    const dataSource = await updateDataSource(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Data source updated successfully.",
      data: dataSource,
    });
  } catch (error) {
    console.error("Update data source error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update data source.",
    });
  }
}

/**
 * PATCH /api/data-sources/:id/disconnect
 */
export async function disconnectDataSourceController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data source ID.",
      });
    }

    const dataSource = await disconnectDataSource(id);

    return res.status(200).json({
      success: true,
      message: "Data source disconnected successfully.",
      data: dataSource,
    });
  } catch (error) {
    console.error("Disconnect data source error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to disconnect data source.",
    });
  }
}

/**
 * DELETE /api/data-sources/:id
 */
export async function deleteDataSourceController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data source ID.",
      });
    }

    await deleteDataSource(id);

    return res.status(200).json({
      success: true,
      message: "Data source deleted successfully.",
    });
  } catch (error) {
    console.error("Delete data source error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete data source.",
    });
  }
}