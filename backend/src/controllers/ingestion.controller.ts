import type { Request, Response } from "express";
import { dataIngestionService } from "../services/dataIngestion.service.js";

/**
 * POST /api/ingestion/posts
 * Ingests, cleans, normalizes, runs Python ML sentiment & emotion, and persists to DB.
 */
export async function ingestPostsController(req: Request, res: Response) {
  try {
    const profileId = Number(req.query.profileId || req.body.profileId);
    const rawPosts = req.body.posts || req.body;

    if (!profileId || Number.isNaN(profileId)) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    const postsArray = Array.isArray(rawPosts) ? rawPosts : [rawPosts];

    if (!postsArray.length) {
      return res.status(400).json({
        success: false,
        message: "posts array is required.",
      });
    }

    const result = await dataIngestionService.ingestAndSaveBatch(
      profileId,
      postsArray
    );

    return res.status(201).json({
      success: true,
      message: `Successfully ingested and analyzed ${result.count} posts.`,
      data: result,
    });
  } catch (error) {
    console.error("Ingest posts error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to ingest posts.",
    });
  }
}

/**
 * POST /api/ingestion/preview
 * Ingests, cleans, normalizes, and runs Python ML sentiment & emotion without persisting to DB.
 */
export async function previewIngestionController(req: Request, res: Response) {
  try {
    const rawPosts = req.body.posts || req.body;
    const postsArray = Array.isArray(rawPosts) ? rawPosts : [rawPosts];

    if (!postsArray.length) {
      return res.status(400).json({
        success: false,
        message: "posts array is required.",
      });
    }

    const result = await dataIngestionService.ingestBatch(postsArray);

    return res.status(200).json({
      success: true,
      message: `Successfully parsed and enriched ${result.length} posts.`,
      data: result,
    });
  } catch (error) {
    console.error("Preview ingestion error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to preview ingestion.",
    });
  }
}
