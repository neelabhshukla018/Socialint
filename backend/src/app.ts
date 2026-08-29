import express from "express";
import cors from "cors";

import dataSourceRoutes from "./routes/dataSource.routes.js";
import postRoutes from "./routes/post.routes.js";
import trendRoutes from "./routes/trend.routes.js";
import audienceRoutes from "./routes/audience.routes.js";
import influenceRoutes from "./routes/influence.routes.js";

import reportRoutes from "./routes/report.routes.js";
const app = express();

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

//audience inshights
app.use("/api/audience", audienceRoutes);

//influence
app.use("/api/influence", influenceRoutes);

//reports
app.use("/api/reports", reportRoutes);

export default app;