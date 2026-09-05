import { db } from "../prisma/db.js";

export async function getAnalytics(profileId: number) {
  // Make sure the profile exists
  const profile = await db.orm.public.MonitoringProfile.first({
    id: profileId,
  });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  // Fetch existing data
  const posts = await db.orm.public.Post
    .where({ profileId })
    .all();

  const trends = await db.orm.public.Trend
    .where({ profileId })
    .all();

  const audience = await db.orm.public.AudienceInsight
    .where({ profileId })
    .all();

  /* =========================================================
     OVERVIEW
     ========================================================= */

  const totalPosts = posts.length;

  const totalLikes = posts.reduce(
    (sum, post) => sum + post.likes,
    0
  );

  const totalComments = posts.reduce(
    (sum, post) => sum + post.comments,
    0
  );

  const totalShares = posts.reduce(
    (sum, post) => sum + post.shares,
    0
  );

  const totalViews = posts.reduce(
    (sum, post) => sum + post.views,
    0
  );

  const totalEngagement =
    totalLikes +
    totalComments +
    totalShares;

  const engagementRate =
    totalViews > 0
      ? Number(
          ((totalEngagement / totalViews) * 100).toFixed(2)
        )
      : 0;

  /* =========================================================
     SENTIMENT
     ========================================================= */

  const positivePosts = posts.filter(
    (post) => post.sentiment === "POSITIVE"
  ).length;

  const negativePosts = posts.filter(
    (post) => post.sentiment === "NEGATIVE"
  ).length;

  const neutralPosts = posts.filter(
    (post) => post.sentiment === "NEUTRAL"
  ).length;

  const positivePercentage =
    totalPosts > 0
      ? Number(
          ((positivePosts / totalPosts) * 100).toFixed(2)
        )
      : 0;

  const negativePercentage =
    totalPosts > 0
      ? Number(
          ((negativePosts / totalPosts) * 100).toFixed(2)
        )
      : 0;

  const neutralPercentage =
    totalPosts > 0
      ? Number(
          ((neutralPosts / totalPosts) * 100).toFixed(2)
        )
      : 0;

  /* =========================================================
     TOP POSTS
     ========================================================= */

  const topPosts = [...posts]
    .sort((a, b) => {
      const engagementA =
        a.likes +
        a.comments +
        a.shares;

      const engagementB =
        b.likes +
        b.comments +
        b.shares;

      return engagementB - engagementA;
    })
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      content: post.content,
      url: post.url,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      views: post.views,
      sentiment: post.sentiment,
      engagement:
        post.likes +
        post.comments +
        post.shares,
      publishedAt: post.publishedAt,
    }));

  /* =========================================================
     TOP TRENDS
     ========================================================= */

  const topTrends = [...trends]
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 10)
    .map((trend) => ({
      id: trend.id,
      name: trend.name,
      hashtag: trend.hashtag,
      mentions: trend.mentions,
      growth: trend.growth,
      momentum: trend.momentum,
      rank: trend.rank,
    }));

  /* =========================================================
     AUDIENCE
     ========================================================= */

  const audienceInsights = audience.map(
    (insight) => ({
      id: insight.id,
      category: insight.category,
      value: insight.value,
      percentage: insight.percentage,
      description: insight.description,
    })
  );

  /* =========================================================
     RESPONSE
     ========================================================= */

  return {
    profile: {
      id: profile.id,
      name: profile.name,
      type: profile.type,
      identifier: profile.identifier,
    },

    overview: {
      totalPosts,
      totalLikes,
      totalComments,
      totalShares,
      totalViews,
      totalEngagement,
      engagementRate,
    },

    sentiment: {
      positive: positivePercentage,
      negative: negativePercentage,
      neutral: neutralPercentage,
      totalPosts,
    },

    topPosts,

    topTrends,

    audience: audienceInsights,
  };
}

//changes here to analytics.services