import express from "express";
import cors from "cors";

import dataSourceRoutes from "./routes/dataSource.routes.js";
import postRoutes from "./routes/post.routes.js";
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

export default app;