import type { Request, Response } from "express";

import {
  getPostAnalysis,
  analyzePostWithAI,
} from "../services/postAnalysis.service.js";

import {
  collectPostFromUrl,
} from "../services/socialMediaCollector.service.js";


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
    const profileId = Number(
      req.query.profileId
    );

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

    if (
      message ===
      "Monitoring profile not found."
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


/**
 * POST /api/post-analysis/analyze
 *
 * Analyzes a social-media post from
 * a pasted URL.
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
    const { url } =
      req.body;


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
       COLLECT POST
       ===================================================== */

    let collectedPost;

    try {
      collectedPost =
        await collectPostFromUrl(
          postUrl
        );
    } catch (error) {
      console.error(
        "Post collection error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to retrieve post.";

      return res.status(422).json({
        success: false,
        message,
        data: {
          url: postUrl,
        },
      });
    }


    /* =====================================================
       CHECK CONTENT
       ===================================================== */

    if (
      !collectedPost.content
    ) {
      return res.status(422).json({
        success: false,
        message:
          "The post was retrieved, but no analyzable text content was found.",
        data: {
          post: collectedPost,
        },
      });
    }


    /* =====================================================
       SEND TO GEMINI
       ===================================================== */

    /*
     * analyzePostWithAI currently accepts
     * the URL and uses Gemini URL Context.
     *
     * The next step will update that function
     * so it can also receive collectedPost.content.
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
        "Post collected and analyzed successfully.",

      data: {
        collectedPost,
        analysis,
      },
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
      )
    ) {
      return res.status(400).json({
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
        "Gemini API error"
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
       DEFAULT
       ===================================================== */

    return res.status(500).json({
      success: false,
      message,
    });
  }
}