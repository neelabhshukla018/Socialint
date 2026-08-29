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

const app = express();

// Clerk authentication
app.use(clerkMiddleware());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "SocialIntel API is running 🚀",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

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

export default app;