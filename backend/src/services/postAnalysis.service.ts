import { db } from "../prisma/db.js";

export async function getPostAnalysis(profileId: number) {
  // Make sure the profile exists
  const profile =
    await db.orm.public.MonitoringProfile.first({
      id: profileId,
    });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  // Get all posts belonging to the profile
  const posts = await db.orm.public.Post
    .where({ profileId })
    .all();

  /* =========================================================
     BASIC METRICS
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

  /* =========================================================
     ENGAGEMENT RATE
     ========================================================= */

  const engagementRate =
    totalViews > 0
      ? Number(
          (
            (totalEngagement / totalViews) *
            100
          ).toFixed(2)
        )
      : 0;

  const averageLikes =
    totalPosts > 0
      ? Number(
          (totalLikes / totalPosts).toFixed(2)
        )
      : 0;

  const averageComments =
    totalPosts > 0
      ? Number(
          (totalComments / totalPosts).toFixed(2)
        )
      : 0;

  const averageShares =
    totalPosts > 0
      ? Number(
          (totalShares / totalPosts).toFixed(2)
        )
      : 0;

  const averageViews =
    totalPosts > 0
      ? Number(
          (totalViews / totalPosts).toFixed(2)
        )
      : 0;

  /* =========================================================
     SENTIMENT
     ========================================================= */

  const positivePosts = posts.filter(
    (post) => post.sentiment === "POSITIVE"
  );

  const negativePosts = posts.filter(
    (post) => post.sentiment === "NEGATIVE"
  );

  const neutralPosts = posts.filter(
    (post) => post.sentiment === "NEUTRAL"
  );

  const positivePercentage =
    totalPosts > 0
      ? Number(
          (
            (positivePosts.length / totalPosts) *
            100
          ).toFixed(2)
        )
      : 0;

  const negativePercentage =
    totalPosts > 0
      ? Number(
          (
            (negativePosts.length / totalPosts) *
            100
          ).toFixed(2)
        )
      : 0;

  const neutralPercentage =
    totalPosts > 0
      ? Number(
          (
            (neutralPosts.length / totalPosts) *
            100
          ).toFixed(2)
        )
      : 0;

  /* =========================================================
     AVERAGE SENTIMENT SCORE
     ========================================================= */

  const sentimentScores = posts
    .map((post) => post.sentimentScore)
    .filter(
      (score): score is number =>
        score !== null
    );

  const averageSentimentScore =
    sentimentScores.length > 0
      ? Number(
          (
            sentimentScores.reduce(
              (sum, score) => sum + score,
              0
            ) / sentimentScores.length
          ).toFixed(2)
        )
      : 0;

  /* =========================================================
     TOP PERFORMING POSTS
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
    .slice(0, 10)
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

      engagement:
        post.likes +
        post.comments +
        post.shares,

      engagementRate:
        post.views > 0
          ? Number(
              (
                ((post.likes +
                  post.comments +
                  post.shares) /
                  post.views) *
                100
              ).toFixed(2)
            )
          : 0,

      sentiment: post.sentiment,
      sentimentScore: post.sentimentScore,

      publishedAt: post.publishedAt,
    }));

  /* =========================================================
     POST TYPE BREAKDOWN
     ========================================================= */

  const postTypeMap = new Map<
    string,
    number
  >();

  for (const post of posts) {
    const current =
      postTypeMap.get(post.postType) ?? 0;

    postTypeMap.set(
      post.postType,
      current + 1
    );
  }

  const postTypeBreakdown = Array.from(
    postTypeMap.entries()
  ).map(([type, count]) => ({
    type,
    count,
    percentage:
      totalPosts > 0
        ? Number(
            ((count / totalPosts) * 100).toFixed(
              2
            )
          )
        : 0,
  }));

  /* =========================================================
     SENTIMENT BREAKDOWN
     ========================================================= */

  const sentimentBreakdown = [
    {
      sentiment: "POSITIVE",
      count: positivePosts.length,
      percentage: positivePercentage,
    },
    {
      sentiment: "NEGATIVE",
      count: negativePosts.length,
      percentage: negativePercentage,
    },
    {
      sentiment: "NEUTRAL",
      count: neutralPosts.length,
      percentage: neutralPercentage,
    },
  ];

  /* =========================================================
     FINAL RESPONSE
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

    averages: {
      averageLikes,
      averageComments,
      averageShares,
      averageViews,
    },

    sentiment: {
      positive: positivePercentage,
      negative: negativePercentage,
      neutral: neutralPercentage,
      averageScore: averageSentimentScore,
    },

    sentimentBreakdown,

    postTypeBreakdown,

    topPosts,
  };
}