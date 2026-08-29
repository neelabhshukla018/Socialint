import { db } from "../prisma/db.js";

interface CreateTrendInput {
  profileId: number;
  name: string;
  hashtag?: string;
  mentions?: number;
  growth?: number;
  momentum?: number;
  rank?: number;
  periodStart?: string;
  periodEnd?: string;
}

interface UpdateTrendInput {
  name?: string;
  hashtag?: string | null;
  mentions?: number;
  growth?: number;
  momentum?: number;
  rank?: number | null;
  periodStart?: string | null;
  periodEnd?: string | null;
}

export async function createTrend(input: CreateTrendInput) {
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
      ? new Date(input.periodStart)
      : null,
    periodEnd: input.periodEnd
      ? new Date(input.periodEnd)
      : null,
  });
}

export async function getTrends(profileId: number) {
  return db.orm.public.Trend
    .where({ profileId })
    .all();
}

export async function getTrendById(id: number) {
  return db.orm.public.Trend.first({
    id,
  });
}

export async function updateTrend(
  id: number,
  input: UpdateTrendInput
) {
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
              ? new Date(input.periodStart)
              : null,
          }
        : {}),

      ...(input.periodEnd !== undefined
        ? {
            periodEnd: input.periodEnd
              ? new Date(input.periodEnd)
              : null,
          }
        : {}),
    });
}

export async function deleteTrend(id: number) {
  const existing = await getTrendById(id);

  if (!existing) {
    throw new Error("Trend not found.");
  }

  return db.orm.public.Trend
    .where({ id })
    .delete();
}