import { db } from "../prisma/db.js";

interface CreatePostInput {
  profileId: number;
  sourceId?: number;
  externalId?: string;
  authorName?: string;
  authorHandle?: string;
  content?: string;
  url?: string;
  postType?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  sentiment?: string;
  sentimentScore?: number;
  publishedAt?: string;
}

export async function createPost(input: CreatePostInput) {
  const profile = await db.orm.public.MonitoringProfile.first({
    id: input.profileId,
  });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  if (input.sourceId) {
    const source = await db.orm.public.DataSource.first({
      id: input.sourceId,
    });

    if (!source) {
      throw new Error("Data source not found.");
    }
  }

  return db.orm.public.Post.create({
    profileId: input.profileId,
    sourceId: input.sourceId ?? null,
    externalId: input.externalId ?? null,
    authorName: input.authorName ?? null,
    authorHandle: input.authorHandle ?? null,
    content: input.content ?? null,
    url: input.url ?? null,
    postType: input.postType ?? "POST",
    likes: input.likes ?? 0,
    comments: input.comments ?? 0,
    shares: input.shares ?? 0,
    views: input.views ?? 0,
    sentiment: input.sentiment ?? "NEUTRAL",
    sentimentScore: input.sentimentScore ?? null,
    publishedAt: input.publishedAt
      ? new Date(input.publishedAt)
      : null,
  });
}

export async function getPosts(profileId: number) {
  return db.orm.public.Post
    .where({ profileId })
    .all();
}

export async function getPostById(id: number) {
  return db.orm.public.Post.first({
    id,
  });
}

export async function updatePost(
  id: number,
  data: Record<string, unknown>
) {
  const post = await getPostById(id);

  if (!post) {
    throw new Error("Post not found.");
  }

  return db.orm.public.Post
    .where({ id })
    .update(data);
}

export async function deletePost(id: number) {
  const post = await getPostById(id);

  if (!post) {
    throw new Error("Post not found.");
  }

  return db.orm.public.Post
    .where({ id })
    .delete();
}