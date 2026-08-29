import type { Request, Response } from "express";

import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../services/report.service.js";

/**
 * POST /api/reports
 * Create a report
 */
export async function createReportController(
  req: Request,
  res: Response
) {
  try {
    const {
      userId,
      profileId,
      title,
      description,
      fileUrl,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "title is required.",
      });
    }

    const report = await createReport({
      userId: Number(userId),
      profileId: Number(profileId),
      title,
      description,
      fileUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Report created successfully.",
      data: report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create report.",
    });
  }
}

/**
 * GET /api/reports?profileId=1
 * Get all reports for a profile
 */
export async function getReportsController(
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

    const reports = await getReports(profileId);

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports.",
    });
  }
}

/**
 * GET /api/reports/:id
 * Get one report
 */
export async function getReportController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const report = await getReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
    });
  }
}

/**
 * PATCH /api/reports/:id
 * Update a report
 */
export async function updateReportController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const {
      title,
      description,
      fileUrl,
    } = req.body;

    if (
      title !== undefined &&
      typeof title !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "title must be a string.",
      });
    }

    const report = await updateReport(id, {
      title,
      description,
      fileUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Report updated successfully.",
      data: report,
    });
  } catch (error) {
    console.error("Update report error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update report.",
    });
  }
}

/**
 * DELETE /api/reports/:id
 * Delete a report
 */
export async function deleteReportController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    await deleteReport(id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report.",
    });
  }
}