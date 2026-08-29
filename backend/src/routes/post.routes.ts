import { Router } from "express";

import {
  createPostController,
  getPostsController,
  getPostController,
  updatePostController,
  deletePostController,
} from "../controllers/post.controller.js";

const router = Router();

// Create a post
router.post("/", createPostController);

// Get all posts for a profile
// GET /api/posts?profileId=1
router.get("/", getPostsController);

// Get one post
// GET /api/posts/1
router.get("/:id", getPostController);

// Update a post
// PATCH /api/posts/1
router.patch("/:id", updatePostController);

// Delete a post
// DELETE /api/posts/1
router.delete("/:id", deletePostController);

export default router;