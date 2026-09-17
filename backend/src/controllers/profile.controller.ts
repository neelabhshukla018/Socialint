import type { Request, Response } from "express";

import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  setActiveProfile,
  deleteProfile,
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
      description,
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
        message: "Missing required profile information (clerkId, email, profileType, profileName, identifier).",
      });
    }

    if (
      !["PERSON", "BRAND", "CAMPAIGN"].includes(
        profileType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile type. Must be PERSON, BRAND, or CAMPAIGN.",
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
      description,
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

export async function getProfileController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid profile id is required.",
      });
    }

    const profile = await getProfileById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
}

export async function updateProfileController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid profile id is required.",
      });
    }

    const updated = await updateProfile(id, req.body);

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
}

export async function activateProfileController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);
    const { clerkId } = req.body;

    if (!id || Number.isNaN(id) || !clerkId) {
      return res.status(400).json({
        success: false,
        message: "Valid profile id and clerkId are required.",
      });
    }

    const updated = await setActiveProfile(id, clerkId);

    return res.json({
      success: true,
      message: "Profile activated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Activate profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate profile.",
    });
  }
}

export async function deleteProfileController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid profile id is required.",
      });
    }

    await deleteProfile(id);

    return res.json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete profile.",
    });
  }
}