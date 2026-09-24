import { db } from "../prisma/db.js";
import { mlClient } from "./mlClient.service.js";
export async function createPost(input) {
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
    let sentiment = input.sentiment;
    let sentimentScore = input.sentimentScore;
    // If sentiment was not provided, invoke Python ML microservice
    if (!sentiment && input.content && input.content.trim()) {
        try {
            const mlResults = await mlClient.analyzeSentiment([
                { id: "post_create", text: input.content.trim() }
            ]);
            if (mlResults.length > 0) {
                sentiment = mlResults[0].label;
                sentimentScore = mlResults[0].score;
            }
        }
        catch (err) {
            console.warn("ML sentiment inference skipped, using default NEUTRAL:", err);
            sentiment = "NEUTRAL";
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
        sentiment: sentiment ?? "NEUTRAL",
        sentimentScore: sentimentScore ?? null,
        publishedAt: input.publishedAt
            ? new Date(input.publishedAt).toISOString()
            : null,
    });
}
export async function enrichPostsWithML(profileId) {
    const posts = await db.orm.public.Post.where({ profileId }).all();
    if (!posts.length) {
        return { updated: 0, posts: [] };
    }
    const postsToEnrich = posts.filter((p) => p.content && p.content.trim());
    if (!postsToEnrich.length) {
        return { updated: 0, posts: [] };
    }
    const batch = postsToEnrich.map((p) => ({
        id: String(p.id),
        text: p.content || "",
    }));
    const [sentiments, emotions] = await Promise.all([
        mlClient.analyzeSentiment(batch),
        mlClient.analyzeEmotion(batch),
    ]);
    const sentMap = new Map(sentiments.map((s) => [s.id, s]));
    const emoMap = new Map(emotions.map((e) => [e.id, e]));
    const updatedPosts = [];
    for (const post of postsToEnrich) {
        const s = sentMap.get(String(post.id));
        if (s) {
            const updated = await db.orm.public.Post.where({ id: post.id }).update({
                sentiment: s.label,
                sentimentScore: s.score,
            });
            updatedPosts.push({
                ...updated,
                sentimentResult: s,
                emotionResult: emoMap.get(String(post.id)),
            });
        }
    }
    return {
        updated: updatedPosts.length,
        posts: updatedPosts,
    };
}
export async function getPosts(profileId) {
    return db.orm.public.Post
        .where({ profileId })
        .all();
}
export async function getPostById(id) {
    return db.orm.public.Post.first({
        id,
    });
}
export async function updatePost(id, data) {
    const post = await getPostById(id);
    if (!post) {
        throw new Error("Post not found.");
    }
    return db.orm.public.Post
        .where({ id })
        .update(data);
}
export async function deletePost(id) {
    const post = await getPostById(id);
    if (!post) {
        throw new Error("Post not found.");
    }
    return db.orm.public.Post
        .where({ id })
        .delete();
}
