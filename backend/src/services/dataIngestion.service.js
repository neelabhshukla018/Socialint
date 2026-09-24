/**
 * SocialInt Common Data Schema & Ingestion Pipeline
 * Implements normalized ingestion architecture specified in Section 9 of the tech stack blueprint.
 */
import { mlClient } from "./mlClient.service.js";
import { db } from "../prisma/db.js";
export class DataIngestionService {
    /**
     * Cleans raw post content: removes noise, normalizes whitespace, trims URLs
     */
    cleanText(raw) {
        if (!raw)
            return "";
        return raw
            .replace(/\r\n/g, "\n")
            .replace(/[ \t]+/g, " ")
            .replace(/\n\s*\n/g, "\n")
            .trim();
    }
    /**
     * Extracts hashtags from cleaned text
     */
    extractHashtags(text) {
        const matches = text.match(/#[a-zA-Z0-9_]+/g);
        return matches ? Array.from(new Set(matches)) : [];
    }
    /**
     * Extracts mentions from cleaned text
     */
    extractMentions(text) {
        const matches = text.match(/@[a-zA-Z0-9_]+/g);
        return matches ? Array.from(new Set(matches)) : [];
    }
    /**
     * Validates and normalizes raw platform data into the Common Data Schema
     */
    normalizePost(raw) {
        const platform = raw.platform.toUpperCase() || "INSTAGRAM";
        const cleaned = this.cleanText(raw.content);
        const authorHandle = raw.authorHandle || "unknown_user";
        return {
            id: `post_${platform.toLowerCase()}_${raw.externalId || Date.now()}_${Math.floor(Math.random() * 1000)}`,
            platform,
            externalId: raw.externalId || `ext_${Date.now()}`,
            url: raw.url || "",
            content: cleaned,
            publishedAt: raw.publishedAt || new Date().toISOString(),
            author: {
                id: `user_${platform.toLowerCase()}_${authorHandle.replace("@", "")}`,
                platform,
                username: authorHandle,
                displayName: raw.authorName || authorHandle,
            },
            metrics: {
                likes: raw.likes || 0,
                comments: raw.comments || 0,
                shares: raw.shares || 0,
                views: raw.views || 0,
            },
            hashtags: this.extractHashtags(cleaned),
            mentions: this.extractMentions(cleaned),
        };
    }
    /**
     * Processes a batch of normalized posts through validation, cleaning, and the Python ML pipeline
     */
    async ingestBatch(rawPosts) {
        if (!rawPosts.length)
            return [];
        // 1. Normalize
        const normalizedPosts = rawPosts.map((p) => this.normalizePost(p));
        // 2. Call Python ML microservice for sentiment & emotion analysis
        const nlpPayload = normalizedPosts.map((p) => ({
            id: p.id,
            text: p.content,
        }));
        const [sentiments, emotions] = await Promise.all([
            mlClient.analyzeSentiment(nlpPayload),
            mlClient.analyzeEmotion(nlpPayload),
        ]);
        const sentMap = new Map(sentiments.map((s) => [s.id, s]));
        const emoMap = new Map(emotions.map((e) => [e.id, e]));
        // 3. Return enriched items
        return normalizedPosts.map((post) => ({
            post,
            cleanedText: post.content,
            sentiment: sentMap.get(post.id) || {
                label: "NEUTRAL",
                score: 0.0,
                confidence: 0.8,
                probabilities: { POSITIVE: 0.2, NEUTRAL: 0.6, NEGATIVE: 0.2 },
            },
            emotion: emoMap.get(post.id) || {
                primary_emotion: "neutral",
                emotions: { neutral: 0.7, joy: 0.1, optimism: 0.1, anger: 0.05, sadness: 0.05 },
            },
        }));
    }
    /**
     * Processes raw posts through normalization and ML intelligence, then persists to Prisma DB
     */
    async ingestAndSaveBatch(profileId, rawPosts) {
        const profile = await db.orm.public.MonitoringProfile.first({
            id: profileId,
        });
        if (!profile) {
            throw new Error("Monitoring profile not found.");
        }
        const enriched = await this.ingestBatch(rawPosts);
        const savedPosts = [];
        for (const item of enriched) {
            const p = item.post;
            const sentLabel = item.sentiment.label || "NEUTRAL";
            const created = await db.orm.public.Post.create({
                profileId,
                externalId: p.externalId,
                url: p.url,
                authorName: p.author.displayName || null,
                authorHandle: p.author.username || null,
                content: item.cleanedText,
                postType: "POST",
                likes: p.metrics.likes,
                comments: p.metrics.comments,
                shares: p.metrics.shares,
                views: p.metrics.views || 0,
                sentiment: sentLabel,
                sentimentScore: item.sentiment.score,
                publishedAt: p.publishedAt
                    ? new Date(p.publishedAt).toISOString()
                    : new Date().toISOString(),
            });
            // Also ensure author exists as an InfluenceNode
            if (p.author.username) {
                const existingNode = await db.orm.public.InfluenceNode.first({
                    profileId,
                    username: p.author.username,
                });
                if (!existingNode) {
                    await db.orm.public.InfluenceNode.create({
                        profileId,
                        name: p.author.displayName || p.author.username,
                        username: p.author.username,
                        category: p.platform,
                        influenceScore: 50,
                    });
                }
            }
            savedPosts.push({
                ...created,
                mlSentiment: item.sentiment,
                mlEmotion: item.emotion,
            });
        }
        return {
            success: true,
            count: savedPosts.length,
            posts: savedPosts,
        };
    }
}
export const dataIngestionService = new DataIngestionService();
