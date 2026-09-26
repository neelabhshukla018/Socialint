import { getPostAnalysis, analyzePostWithAI, } from "../services/postAnalysis.service.js";
import { db } from "../prisma/db.js";
/**
 * GET /api/post-analysis?profileId=1
 *
 * Returns calculated analysis for all posts
 * belonging to a monitoring profile.
 */
export async function getPostAnalysisController(req, res) {
    try {
        const profileId = Number(req.query.profileId);
        /* =====================================================
           VALIDATE PROFILE ID
           ===================================================== */
        if (!profileId ||
            Number.isNaN(profileId)) {
            return res.status(400).json({
                success: false,
                message: "profileId is required.",
            });
        }
        /* =====================================================
           GET POST ANALYSIS
           ===================================================== */
        const analysis = await getPostAnalysis(profileId);
        return res.status(200).json({
            success: true,
            data: analysis,
        });
    }
    catch (error) {
        console.error("Get post analysis error:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch post analysis.";
        /* =====================================================
           PROFILE NOT FOUND
           ===================================================== */
        if (message ===
            "Monitoring profile not found.") {
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
export async function analyzePostController(req, res) {
    try {
        const { url, profileId, } = req.body;
        /* =====================================================
           VALIDATE URL
           ===================================================== */
        if (typeof url !== "string" ||
            !url.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post URL is required.",
            });
        }
        const postUrl = url.trim();
        /* =====================================================
           VALIDATE PROFILE & DATA SOURCE (IF PROFILE ID PROVIDED)
           ===================================================== */
        const pId = profileId ? Number(profileId) : undefined;
        if (pId && !Number.isNaN(pId)) {
            const profile = await db.orm.public.MonitoringProfile.first({
                id: pId,
            });
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Monitoring profile not found.",
                });
            }
            const connectedSources = await db.orm.public.DataSource
                .where({
                profileId: pId,
                status: "CONNECTED",
            })
                .all();
            const urlLower = postUrl.toLowerCase();
            let targetPlatform = "INSTAGRAM";
            let platformName = "Instagram";
            if (urlLower.includes("facebook.com") || urlLower.includes("fb.com") || urlLower.includes("fb.watch")) {
                targetPlatform = "FACEBOOK";
                platformName = "Facebook";
            }
            else if (urlLower.includes("instagram.com") || urlLower.includes("instagr.am")) {
                targetPlatform = "INSTAGRAM";
                platformName = "Instagram";
            }
            else if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
                targetPlatform = "YOUTUBE";
                platformName = "YouTube";
            }
            else if (urlLower.includes("x.com") || urlLower.includes("twitter.com")) {
                targetPlatform = "X";
                platformName = "X / Twitter";
            }
            const hasMatchingSource = connectedSources.some((s) => s.platform.toUpperCase() === targetPlatform);
            if (!hasMatchingSource) {
                return res.status(400).json({
                    success: false,
                    message: `No connected ${platformName} data source found for profile "${profile.name}". Please connect your ${platformName} account in Data Sources first before analyzing.`,
                });
            }
        }
        /* =====================================================
           ANALYZE POST
           ===================================================== */
        const analysis = await analyzePostWithAI(postUrl, pId);
        /* =====================================================
           SUCCESS RESPONSE
           ===================================================== */
        return res.status(200).json({
            success: true,
            message: "Post analyzed successfully.",
            data: analysis,
        });
    }
    catch (error) {
        console.error("AI post analysis error:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to analyze post.";
        /* =====================================================
           CLIENT ERRORS
           ===================================================== */
        if (message ===
            "Post URL is required." ||
            message ===
                "Invalid post URL." ||
            message.startsWith("Unsupported platform.") ||
            message.startsWith("Invalid Instagram post URL.") ||
            message.startsWith("Invalid X / Twitter post URL.") ||
            message.startsWith("Invalid Facebook post URL.")) {
            return res.status(400).json({
                success: false,
                message,
            });
        }
        /* =====================================================
           APIFY CONFIGURATION
           ===================================================== */
        if (message.includes("APIFY_API_TOKEN") ||
            message.includes("Instagram data service is not configured")) {
            return res.status(500).json({
                success: false,
                message,
            });
        }
        /* =====================================================
           APIFY RETRIEVAL ERROR
           ===================================================== */
        if (message.includes("Instagram data retrieval failed") ||
            message.includes("Instagram post could not be retrieved")) {
            return res.status(502).json({
                success: false,
                message,
            });
        }
        /* =====================================================
           NO ANALYZABLE CONTENT
           ===================================================== */
        if (message.includes("no analyzable text or media content")) {
            return res.status(422).json({
                success: false,
                message,
            });
        }
        /* =====================================================
           GEMINI CONFIGURATION
           ===================================================== */
        if (message.includes("Gemini AI is not configured")) {
            return res.status(500).json({
                success: false,
                message,
            });
        }
        /* =====================================================
           GEMINI ERROR
           ===================================================== */
        if (message.includes("Gemini AI analysis failed") ||
            message.includes("Gemini returned")) {
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
