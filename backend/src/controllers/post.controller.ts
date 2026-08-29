import type { Request, Response } from "express";

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../services/post.service.js";

export async function createPostController(
  req: Request,
  res: Response
) {
  try {
    const {
      profileId,
      sourceId,
      externalId,
      authorName,
      authorHandle,
      content,
      url,
      postType,
      likes,
      comments,
      shares,
      views,
      sentiment,
      sentimentScore,
      publishedAt,
    } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    const allowedPostTypes = [
      "POST",
      "REPLY",
      "COMMENT",
      "VIDEO",
      "ARTICLE",
    ];

    if (postType && !allowedPostTypes.includes(postType)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid postType. Use POST, REPLY, COMMENT, VIDEO or ARTICLE.",
      });
    }

    const allowedSentiments = [
      "POSITIVE",
      "NEGATIVE",
      "NEUTRAL",
    ];

    if (
      sentiment &&
      !allowedSentiments.includes(sentiment)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid sentiment. Use POSITIVE, NEGATIVE or NEUTRAL.",
      });
    }

    const post = await createPost({
      profileId: Number(profileId),
      sourceId: sourceId ? Number(sourceId) : undefined,
      externalId,
      authorName,
      authorHandle,
      content,
      url,
      postType,
      likes,
      comments,
      shares,
      views,
      sentiment,
      sentimentScore,
      publishedAt,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create post.",
    });
  }
}

export async function getPostsController(
  req: Request,
  res: Response
) {
  try {
    const profileId = Number(req.query.profileId);

    if (!profileId || Number.isNaN(profileId)) {
      return res.status(400).json({
        success: false,
        message: "profileId is required.",
      });
    }

    const posts = await getPosts(profileId);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
    });
  }
}

export async function getPostController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post.",
    });
  }
}

export async function updatePostController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await updatePost(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update post.",
    });
  }
}

export async function deletePostController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    await deletePost(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post.",
    });
  }
}