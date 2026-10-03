import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dataSourceRoutes from "./routes/dataSource.routes.js";
import postRoutes from "./routes/post.routes.js";
import trendRoutes from "./routes/trend.routes.js";
import audienceRoutes from "./routes/audience.routes.js";
import influenceRoutes from "./routes/influence.routes.js";
import reportRoutes from "./routes/report.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import postAnalysisRoutes from "./routes/postAnalysis.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import ingestionRoutes from "./routes/ingestion.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import soclRoutes from "./routes/socl.routes.js";
const app = express();
/* ================================================== */
/* CORS                                               */
/* ================================================== */
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests or same-origin requests without an Origin header
        if (!origin)
            return callback(null, true);
        // Local development (localhost and 127.0.0.1 on any port, e.g., 3000, 5000)
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        // Production & Preview Netlify domains via environment variable FRONTEND_URL
        // Supports comma-separated domains (e.g., "https://my-site.netlify.app")
        const frontendUrlEnv = process.env.FRONTEND_URL;
        if (frontendUrlEnv) {
            const allowedUrls = frontendUrlEnv
                .split(",")
                .map((u) => u.trim().replace(/\/$/, ""));
            if (allowedUrls.includes(origin.replace(/\/$/, ""))) {
                return callback(null, true);
            }
        }
        // Also allow any Netlify preview or production subdomain
        if (/^https:\/\/[a-zA-Z0-9_.-]+\.netlify\.app$/i.test(origin)) {
            return callback(null, true);
        }
        // In non-production mode, allow for local testing flexibility
        if (process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }
        // Block unrecognized origins in production
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));
/* ================================================== */
/* BODY PARSER                                        */
/* ================================================== */
app.use(express.json());
/* ================================================== */
/* CLERK AUTHENTICATION                               */
/* ================================================== */
app.use(clerkMiddleware());
/* ================================================== */
/* HEALTH / ROOT                                      */
/* ================================================== */
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "SocialIntel API is running",
    });
});
app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "Backend is healthy",
    });
});
/* ================================================== */
/* API ROUTES                                         */
/* ================================================== */
// Monitoring Profiles
app.use("/api/profiles", profileRoutes);
// Data Sources
app.use("/api/data-sources", dataSourceRoutes);
// Posts
app.use("/api/posts", postRoutes);
// Trends & Topics
app.use("/api/trends", trendRoutes);
// Audience Insights
app.use("/api/audience", audienceRoutes);
// Influence
app.use("/api/influence", influenceRoutes);
// Reports
app.use("/api/reports", reportRoutes);
// Analytics
app.use("/api/analytics", analyticsRoutes);
// Post Analytics
app.use("/api/post-analysis", postAnalysisRoutes);
// Settings
app.use("/api/settings", settingsRoutes);
// Data Ingestion Pipeline
app.use("/api/ingestion", ingestionRoutes);
// SOCL AI Assistant
app.use("/api/socl", soclRoutes);
/* ================================================== */
/* EXPORT                                             */
/* ================================================== */
export default app;
