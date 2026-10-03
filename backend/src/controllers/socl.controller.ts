import type { Request, Response } from "express";
import { chatWithSocl, getSuggestionsForContext } from "../services/socl.service.js";

/**
 * POST /api/socl/chat
 * Process a message from the user and return SOCL's response.
 */
export async function chatWithSoclController(req: Request, res: Response) {
  try {
    const { message, history, pageContext } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message string is required.",
      });
    }

    const response = await chatWithSocl(
      message,
      Array.isArray(history) ? history : [],
      typeof pageContext === "string" ? pageContext : undefined
    );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Error in chatWithSoclController:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to process chat with SOCL.",
    });
  }
}

/**
 * GET /api/socl/suggestions?pageContext=/posts-analysis
 * Return starter prompts tailored to the user's current page context.
 */
export async function getSoclSuggestionsController(req: Request, res: Response) {
  try {
    const pageContext = typeof req.query.pageContext === "string" ? req.query.pageContext : "";
    const suggestions = getSuggestionsForContext(pageContext);

    return res.status(200).json({
      success: true,
      data: {
        suggestions,
        pageContext,
      },
    });
  } catch (error: any) {
    console.error("Error in getSoclSuggestionsController:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to get suggestions.",
    });
  }
}
