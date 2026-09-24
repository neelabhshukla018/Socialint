import { db } from "../prisma/db.js";
/**
 * Create an audience insight
 */
export async function createAudienceInsight(input) {
    // Make sure the monitoring profile exists
    const profile = await db.orm.public.MonitoringProfile.first({
        id: input.profileId,
    });
    if (!profile) {
        throw new Error("Monitoring profile not found.");
    }
    return db.orm.public.AudienceInsight.create({
        profileId: input.profileId,
        category: input.category,
        value: input.value,
        percentage: input.percentage ?? null,
        description: input.description ?? null,
    });
}
/**
 * Get all audience insights for a profile
 */
export async function getAudienceInsights(profileId) {
    return db.orm.public.AudienceInsight
        .where({ profileId })
        .all();
}
/**
 * Get one audience insight
 */
export async function getAudienceInsightById(id) {
    return db.orm.public.AudienceInsight.first({
        id,
    });
}
/**
 * Update an audience insight
 */
export async function updateAudienceInsight(id, input) {
    const existing = await getAudienceInsightById(id);
    if (!existing) {
        throw new Error("Audience insight not found.");
    }
    return db.orm.public.AudienceInsight
        .where({ id })
        .update({
        ...(input.category !== undefined
            ? { category: input.category }
            : {}),
        ...(input.value !== undefined
            ? { value: input.value }
            : {}),
        ...(input.percentage !== undefined
            ? { percentage: input.percentage }
            : {}),
        ...(input.description !== undefined
            ? { description: input.description }
            : {}),
    });
}
/**
 * Delete an audience insight
 */
export async function deleteAudienceInsight(id) {
    const existing = await getAudienceInsightById(id);
    if (!existing) {
        throw new Error("Audience insight not found.");
    }
    return db.orm.public.AudienceInsight
        .where({ id })
        .delete();
}
