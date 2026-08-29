import type { Request, Response } from "express";

import {
  getSettings,
  updateSettings,
} from "../services/settings.service.js";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

/**
 * GET /api/settings
 *
 * Returns the settings of the authenticated user.
 */
export const getUserSettings = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID is required.",
      });
    }

    const settings = await getSettings(userId);

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
    });
  }
};

/**
 * PATCH /api/settings
 *
 * Updates the authenticated user's settings.
 */
export const updateUserSettings = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID is required.",
      });
    }

    const {
      appearance,
      emailNotifications,
      pushNotifications,
      weeklyReports,
    } = req.body;

    // Validate appearance if supplied
    if (
      appearance !== undefined &&
      !["LIGHT", "DARK", "SYSTEM"].includes(appearance)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid appearance. Use LIGHT, DARK, or SYSTEM.",
      });
    }

    // Validate boolean fields if supplied
    if (
      emailNotifications !== undefined &&
      typeof emailNotifications !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "emailNotifications must be a boolean.",
      });
    }

    if (
      pushNotifications !== undefined &&
      typeof pushNotifications !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "pushNotifications must be a boolean.",
      });
    }

    if (
      weeklyReports !== undefined &&
      typeof weeklyReports !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "weeklyReports must be a boolean.",
      });
    }

    const settings = await updateSettings(userId, {
      appearance,
      emailNotifications,
      pushNotifications,
      weeklyReports,
    });

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings.",
    });
  }
};