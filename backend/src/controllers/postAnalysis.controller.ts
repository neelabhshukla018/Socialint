import type {
  Request,
  Response,
} from "express";

import {
  getPostAnalysis,
  analyzePostWithAI,
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
    const profileId =
      Number(req.query.profileId);


    /* =====================================================
       VALIDATE PROFILE ID
       ===================================================== */

    if (
      !profileId ||
      Number.isNaN(profileId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "profileId is required.",
      });
    }


    /* =====================================================
       GET POST ANALYSIS
       ===================================================== */

    const analysis =
      await getPostAnalysis(
        profileId
      );


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


    /* =====================================================
       PROFILE NOT FOUND
       ===================================================== */

    if (
      message ===
      "Monitoring profile not found."
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       SERVER ERROR
       ===================================================== */

    return res.status(500).json({
      success: false,
      message,
    });
  }
}


/**
 * POST /api/post-analysis/analyze
 *
 * Analyze a public social-media post
 * from a pasted URL.
 *
 * Request body:
 *
 * {
 *   "url": "https://www.instagram.com/p/..."
 * }
 */
export async function analyzePostController(
  req: Request,
  res: Response
) {
  try {

    const {
      url,
    } = req.body;


    /* =====================================================
       VALIDATE URL
       ===================================================== */

    if (
      typeof url !== "string" ||
      !url.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Post URL is required.",
      });
    }


    const postUrl =
      url.trim();


    /* =====================================================
       ANALYZE POST
       ===================================================== */

    /*
     * analyzePostWithAI() handles the complete flow:
     *
     * URL
     * ↓
     * Platform detection
     * ↓
     * Apify
     * ↓
     * Instagram data
     * ↓
     * Caption / image / media
     * ↓
     * Gemini
     * ↓
     * AI analysis
     *
     * There is intentionally NO content check here.
     *
     * An Instagram post may have:
     *
     * - caption
     * - image only
     * - reel thumbnail
     * - supplemental text
     *
     * Gemini should analyze whatever data
     * is available.
     */

    const analysis =
      await analyzePostWithAI(
        postUrl
      );


    /* =====================================================
       SUCCESS RESPONSE
       ===================================================== */

    return res.status(200).json({

      success: true,

      message:
        "Post analyzed successfully.",

      data: analysis,

    });

  } catch (error) {

    console.error(
      "AI post analysis error:",
      error
    );


    const message =
      error instanceof Error
        ? error.message
        : "Failed to analyze post.";


    /* =====================================================
       CLIENT ERRORS
       ===================================================== */

    if (
      message ===
        "Post URL is required." ||

      message ===
        "Invalid post URL." ||

      message.startsWith(
        "Unsupported platform."
      ) ||

      message.startsWith(
        "Invalid Instagram post URL."
      )
    ) {

      return res.status(400).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       APIFY CONFIGURATION
       ===================================================== */

    if (
      message.includes(
        "APIFY_API_TOKEN"
      ) ||

      message.includes(
        "Instagram data service is not configured"
      )
    ) {

      return res.status(500).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       APIFY RETRIEVAL ERROR
       ===================================================== */

    if (
      message.includes(
        "Instagram data retrieval failed"
      ) ||

      message.includes(
        "Instagram post could not be retrieved"
      )
    ) {

      return res.status(502).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       NO ANALYZABLE CONTENT
       ===================================================== */

    if (
      message.includes(
        "no analyzable text or media content"
      )
    ) {

      return res.status(422).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       GEMINI CONFIGURATION
       ===================================================== */

    if (
      message.includes(
        "Gemini AI is not configured"
      )
    ) {

      return res.status(500).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       GEMINI ERROR
       ===================================================== */

    if (
      message.includes(
        "Gemini AI analysis failed"
      ) ||

      message.includes(
        "Gemini returned"
      )
    ) {

      return res.status(502).json({
        success: false,
        message,
      });
    }


    /* =====================================================
       DEFAULT SERVER ERROR
       ===================================================== */

    return res.status(500).json({
      success: false,
      message,
    });
  }
}