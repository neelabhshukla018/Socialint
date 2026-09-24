import { db } from "../prisma/db.js";
import { mlClient } from "./mlClient.service.js";
export async function createTrend(input) {
    const profile = await db.orm.public.MonitoringProfile.first({
        id: input.profileId,
    });
    if (!profile) {
        throw new Error("Monitoring profile not found.");
    }
    return db.orm.public.Trend.create({
        profileId: input.profileId,
        name: input.name,
        hashtag: input.hashtag ?? null,
        mentions: input.mentions ?? 0,
        growth: input.growth ?? 0,
        momentum: input.momentum ?? 0,
        rank: input.rank ?? null,
        periodStart: input.periodStart
            ? new Date(input.periodStart).toISOString()
            : null,
        periodEnd: input.periodEnd
            ? new Date(input.periodEnd).toISOString()
            : null,
    });
}
export async function getTrends(profileId) {
    return db.orm.public.Trend
        .where({ profileId })
        .all();
}
export async function getTrendById(id) {
    return db.orm.public.Trend.first({
        id,
    });
}
export async function updateTrend(id, input) {
    const existing = await getTrendById(id);
    if (!existing) {
        throw new Error("Trend not found.");
    }
    return db.orm.public.Trend
        .where({ id })
        .update({
        ...(input.name !== undefined
            ? { name: input.name }
            : {}),
        ...(input.hashtag !== undefined
            ? { hashtag: input.hashtag }
            : {}),
        ...(input.mentions !== undefined
            ? { mentions: input.mentions }
            : {}),
        ...(input.growth !== undefined
            ? { growth: input.growth }
            : {}),
        ...(input.momentum !== undefined
            ? { momentum: input.momentum }
            : {}),
        ...(input.rank !== undefined
            ? { rank: input.rank }
            : {}),
        ...(input.periodStart !== undefined
            ? {
                periodStart: input.periodStart
                    ? new Date(input.periodStart).toISOString()
                    : null,
            }
            : {}),
        ...(input.periodEnd !== undefined
            ? {
                periodEnd: input.periodEnd
                    ? new Date(input.periodEnd).toISOString()
                    : null,
            }
            : {}),
    });
}
export async function deleteTrend(id) {
    const existing = await getTrendById(id);
    if (!existing) {
        throw new Error("Trend not found.");
    }
    return db.orm.public.Trend
        .where({ id })
        .delete();
}
export async function analyzeTrendsAndTopicsWithML(profileId) {
    const profile = await db.orm.public.MonitoringProfile.first({
        id: profileId,
    });
    if (!profile) {
        throw new Error("Monitoring profile not found.");
    }
    const posts = await db.orm.public.Post.where({ profileId }).all();
    if (!posts.length) {
        const existing = await getTrends(profileId);
        return {
            topics: [],
            trends: existing,
            generatedCount: 0,
        };
    }
    const validPosts = posts.filter((p) => p.content && p.content.trim().length > 5);
    // Extract topics via Python ML
    let topics = [];
    if (validPosts.length >= 2) {
        try {
            topics = await mlClient.extractTopics(validPosts.map((p) => ({ id: String(p.id), text: p.content || "" })), Math.min(5, Math.max(2, Math.floor(validPosts.length / 2))));
        }
        catch (err) {
            console.warn("Topic extraction fallback:", err);
        }
    }
    // Extract hashtags & calculate mentions
    const hashtagMap = new Map();
    for (const post of posts) {
        const text = post.content || "";
        const tags = text.match(/#[a-zA-Z0-9_]+/g) || [];
        const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
        const ts = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
        for (const tag of tags) {
            const lowerTag = tag.toLowerCase();
            const entry = hashtagMap.get(lowerTag) || { count: 0, engagements: [], timestamps: [] };
            entry.count += 1;
            entry.engagements.push(engagement);
            entry.timestamps.push(ts);
            hashtagMap.set(lowerTag, entry);
        }
    }
    const candidateTrends = Array.from(hashtagMap.entries()).map(([tag, data]) => ({
        name: tag,
        hashtag: tag,
        current_volume: data.count,
        previous_volume: Math.max(1, Math.round(data.count * 0.7)),
        total_engagement: data.engagements.reduce((a, b) => a + b, 0),
        first_seen_hours_ago: 6,
    }));
    if (candidateTrends.length < 3 && topics.length > 0) {
        for (const top of topics) {
            candidateTrends.push({
                name: top.name,
                hashtag: `#${top.name.replace(/\s+/g, "_")}`,
                current_volume: top.post_count,
                previous_volume: Math.max(1, Math.round(top.post_count * 0.8)),
                total_engagement: top.post_count * 5,
                first_seen_hours_ago: 12,
            });
        }
    }
    let scoredTrends = [];
    if (candidateTrends.length > 0) {
        try {
            scoredTrends = await mlClient.scoreTrends(candidateTrends);
        }
        catch (err) {
            console.warn("ML trend scoring fallback:", err);
            scoredTrends = candidateTrends.map((c) => ({
                name: c.name,
                hashtag: c.hashtag,
                current_volume: c.current_volume,
                velocity_rate: c.current_volume * 1.5,
                momentum_score: c.current_volume * 2.0,
                is_emerging: false,
                status: "STEADY",
            }));
        }
    }
    const existingTrends = await db.orm.public.Trend.where({ profileId }).all();
    const existingMap = new Map(existingTrends.map((t) => [t.name.toLowerCase(), t]));
    const persistedTrends = [];
    for (let i = 0; i < scoredTrends.length; i++) {
        const item = scoredTrends[i];
        const existing = existingMap.get(item.name.toLowerCase());
        if (existing) {
            const updated = await db.orm.public.Trend.where({ id: existing.id }).update({
                mentions: item.current_volume ?? existing.mentions,
                growth: Number((item.velocity_rate ?? 0).toFixed(2)),
                momentum: Number((item.momentum_score ?? 0).toFixed(2)),
                rank: i + 1,
            });
            persistedTrends.push(updated);
        }
        else {
            const created = await db.orm.public.Trend.create({
                profileId,
                name: item.name,
                hashtag: item.hashtag ?? `#${item.name.replace(/\s+/g, "_")}`,
                mentions: item.current_volume ?? 1,
                growth: Number((item.velocity_rate ?? 0).toFixed(2)),
                momentum: Number((item.momentum_score ?? 0).toFixed(2)),
                rank: i + 1,
            });
            persistedTrends.push(created);
        }
    }
    return {
        topics,
        trends: persistedTrends.length > 0 ? persistedTrends : existingTrends,
        generatedCount: persistedTrends.length,
    };
}
