import type { Request, Response } from "express";

import {
  createProfile,
  getProfiles,
} from "../services/profile.service.js";

export async function createProfileController(
  req: Request,
  res: Response
) {
  try {
    const {
      clerkId,
      email,
      name,
      username,
      profileType,
      profileName,
      identifier,
    } = req.body;

    if (
      !clerkId ||
      !email ||
      !profileType ||
      !profileName ||
      !identifier
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required profile information.",
      });
    }

    if (
      !["PERSON", "BRAND", "CAMPAIGN"].includes(
        profileType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile type.",
      });
    }

    const result = await createProfile({
      clerkId,
      email,
      name,
      username,
      profileType,
      profileName,
      identifier,
    });

    return res.status(201).json({
      success: true,
      message: "Monitoring profile created successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Create profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create monitoring profile.",
    });
  }
}

export async function getProfilesController(
  req: Request,
  res: Response
) {
  try {
    const clerkId = req.query.clerkId as string;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId is required.",
      });
    }

    const profiles = await getProfiles(clerkId);

    return res.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    console.error("Get profiles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profiles.",
    });
  }
}