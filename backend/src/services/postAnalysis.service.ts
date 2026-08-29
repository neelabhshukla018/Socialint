import { GoogleGenAI } from "@google/genai";
import { db } from "../prisma/db.js";


/* =========================================================
   GEMINI CONFIGURATION
   ========================================================= */

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY is not configured in backend/.env"
  );
}

const gemini = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    })
  : null;


/* =========================================================
   AI ANALYSIS TYPE
   ========================================================= */

interface AIAnalysisResult {
  platform: string;

  url: string;

  accessible: boolean;

  author: {
    name: string | null;
    handle: string | null;
  };

  content: string | null;

  postType: string;

  engagement: {
    likes: number | null;
    comments: number | null;
    shares: number | null;
    views: number | null;
  };

  sentiment: {
    label:
      | "POSITIVE"
      | "NEGATIVE"
      | "NEUTRAL"
      | "MIXED";

    score: number;

    explanation: string;
  };

  emotions: Array<{
    emotion: string;
    score: number;
  }>;

  topics: string[];

  intent: {
    label: string;
    explanation: string;
  };

  summary: string;

  keyInsights: string[];

  toxicity: {
    detected: boolean;
    score: number;
    explanation: string;
  };

  recommendations: string[];

  confidence: number;
}


/* =========================================================
   COLLECTED POST TYPE
   ========================================================= */

export interface CollectedPostForAI {
  platform: string;

  url: string;

  authorName: string | null;

  authorHandle: string | null;

  content: string | null;

  postType: string;

  likes: number | null;

  comments: number | null;

  shares: number | null;

  views: number | null;

  publishedAt: string | null;

  source:
    | "PUBLIC_URL"
    | "DATABASE";
}


/* =========================================================
   PLATFORM DETECTION
   ========================================================= */

function detectPlatform(
  url: string
): string | null {
  try {
    const hostname =
      new URL(url)
        .hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        );

    if (
      hostname ===
        "instagram.com" ||
      hostname ===
        "instagr.am"
    ) {
      return "INSTAGRAM";
    }

    if (
      hostname === "x.com" ||
      hostname === "twitter.com" ||
      hostname ===
        "mobile.twitter.com"
    ) {
      return "X";
    }

    if (
      hostname ===
        "youtube.com" ||
      hostname === "youtu.be"
    ) {
      return "YOUTUBE";
    }

    if (
      hostname === "t.me" ||
      hostname ===
        "telegram.me" ||
      hostname ===
        "telegram.org"
    ) {
      return "TELEGRAM";
    }

    return null;
  } catch {
    return null;
  }
}


/* =========================================================
   FIND POST IN DATABASE
   ========================================================= */

async function findPostByUrl(
  url: string
) {
  const posts =
    await db.orm.public.Post
      .where({
        url,
      })
      .all();

  if (
    !posts ||
    posts.length === 0
  ) {
    return null;
  }

  return posts[0];
}/* =========================================================
   ANALYZE COLLECTED POST WITH GEMINI
   ========================================================= */

export async function analyzePostWithAI(
  post: CollectedPostForAI
) {
  /* =======================================================
     VALIDATE INPUT
     ======================================================= */

  if (!post || !post.url) {
    throw new Error(
      "Post URL is required."
    );
  }

  const postUrl =
    post.url.trim();

  if (!postUrl) {
    throw new Error(
      "Post URL is required."
    );
  }


  /* =======================================================
     VALIDATE URL
     ======================================================= */

  try {
    const parsedUrl =
      new URL(postUrl);

    if (
      parsedUrl.protocol !==
        "http:" &&
      parsedUrl.protocol !==
        "https:"
    ) {
      throw new Error(
        "Invalid post URL."
      );
    }
  } catch {
    throw new Error(
      "Invalid post URL."
    );
  }


  /* =======================================================
     DETECT / VERIFY PLATFORM
     ======================================================= */

  const detectedPlatform =
    detectPlatform(postUrl);

  const platform =
    detectedPlatform ??
    post.platform;

  if (!platform) {
    throw new Error(
      "Unsupported platform."
    );
  }


  /* =======================================================
     CHECK GEMINI
     ======================================================= */

  if (!gemini) {
    throw new Error(
      "Gemini AI is not configured. Add GEMINI_API_KEY to backend/.env."
    );
  }


  /* =======================================================
     CHECK POST CONTENT
     ======================================================= */

  if (
    !post.content ||
    !post.content.trim()
  ) {
    throw new Error(
      "Post has no content to analyze."
    );
  }


  /* =======================================================
     PREPARE REAL POST DATA
     ======================================================= */

  const postData = {
    platform,

    url: postUrl,

    author: {
      name:
        post.authorName,
      handle:
        post.authorHandle,
    },

    content:
      post.content,

    postType:
      post.postType,

    engagement: {
      likes:
        post.likes,
      comments:
        post.comments,
      shares:
        post.shares,
      views:
        post.views,
    },

    publishedAt:
      post.publishedAt,
  };


  /* =======================================================
     GEMINI PROMPT
     ======================================================= */

  const prompt = `
You are the AI analysis engine of SocialIntel.

SocialIntel is a social media intelligence
platform.

You have been given REAL data collected
from a social-media post.

Your job is to analyze the supplied post
content and engagement information.

IMPORTANT RULES:

1. Analyze ONLY the supplied post data.

2. Do NOT attempt to open or access the URL.

3. Do NOT use URL Context.

4. Do NOT invent missing information.

5. If a field is null, keep it null.

6. Do not invent an author name,
   username, likes, comments, shares,
   views, topics, or facts.

7. Return ONLY valid JSON.

8. Do not use markdown code fences.


=========================================================
REAL POST DATA
=========================================================

${JSON.stringify(
  postData,
  null,
  2
)}


=========================================================
ANALYSIS REQUIRED
=========================================================

SENTIMENT

Choose exactly one:

POSITIVE
NEGATIVE
NEUTRAL
MIXED


SENTIMENT SCORE

Use a number from 0 to 1.

0.0 = extremely negative

0.5 = neutral

1.0 = extremely positive


EMOTIONS

Identify emotions actually expressed
or strongly implied by the content.

Examples:

happiness
anger
sadness
fear
excitement
optimism
frustration
surprise
curiosity
concern

Each emotion must have a score
between 0 and 1.


TOPICS

Identify the main topics actually
discussed in the post.

Return concise topic names.

Do not invent topics.


INTENT

Identify the primary purpose of
the post.

Possible examples:

informational
promotional
opinion
announcement
persuasive
entertainment
question
complaint


SUMMARY

Provide a concise factual summary
of the actual post.


KEY INSIGHTS

Extract useful insights from the
actual content and engagement data.

Do not invent facts.


TOXICITY

Determine whether the post contains
toxic, abusive, hateful, threatening,
or harmful language.

Normal disagreement is NOT toxicity.

Return a score from 0 to 1.


RECOMMENDATIONS

Provide practical recommendations
for a social-media intelligence system
based ONLY on the supplied information.

If there is insufficient information,
return an empty array.


CONFIDENCE

Return a number from 0 to 1.

This represents confidence in the
analysis.


=========================================================
RETURN EXACTLY THIS JSON STRUCTURE
=========================================================

{
  "platform": "${platform}",

  "url": "${postUrl}",

  "accessible": true,

  "author": {
    "name": null,
    "handle": null
  },

  "content": null,

  "postType": "POST",

  "engagement": {
    "likes": null,
    "comments": null,
    "shares": null,
    "views": null
  },

  "sentiment": {
    "label": "NEUTRAL",
    "score": 0.5,
    "explanation": ""
  },

  "emotions": [
    {
      "emotion": "",
      "score": 0
    }
  ],

  "topics": [],

  "intent": {
    "label": "",
    "explanation": ""
  },

  "summary": "",

  "keyInsights": [],

  "toxicity": {
    "detected": false,
    "score": 0,
    "explanation": ""
  },

  "recommendations": [],

  "confidence": 0
}
`;


  /* =======================================================
     CALL GEMINI
     ======================================================= */

  try {
    const interaction =
      await gemini.interactions.create({
        model:
          "gemini-3.6-flash",

        input:
          prompt,
      });


    /* =====================================================
       READ GEMINI RESPONSE
       ===================================================== */

    let text = "";

    for (
      const step of
        interaction.steps ?? []
    ) {
      if (
        step.type ===
        "model_output"
      ) {
        for (
          const contentBlock of
            step.content ?? []
        ) {
          if (
            contentBlock.type ===
            "text"
          ) {
            text +=
              contentBlock.text;
          }
        }
      }
    }


    /* =====================================================
       EMPTY RESPONSE CHECK
       ===================================================== */

    if (!text.trim()) {
      throw new Error(
        "Gemini returned an empty analysis."
      );
    }


    /* =====================================================
       REMOVE MARKDOWN CODE FENCES
       ===================================================== */

    let cleanText =
      text.trim();

    if (
      cleanText.startsWith(
        "```json"
      )
    ) {
      cleanText =
        cleanText
          .replace(
            /^```json\s*/,
            ""
          )
          .replace(
            /\s*```$/,
            ""
          );
    } else if (
      cleanText.startsWith(
        "```"
      )
    ) {
      cleanText =
        cleanText
          .replace(
            /^```\s*/,
            ""
          )
          .replace(
            /\s*```$/,
            ""
          );
    }


    /* =====================================================
       PARSE GEMINI JSON
       ===================================================== */

    let analysis:
      AIAnalysisResult;

    try {
      analysis =
        JSON.parse(
          cleanText
        ) as AIAnalysisResult;
    } catch (error) {
      console.error(
        "Gemini JSON parse error:",
        error
      );

      console.error(
        "Raw Gemini response:",
        text
      );

      throw new Error(
        "Gemini returned an invalid analysis format."
      );
    }    /* =====================================================
       NORMALIZE PLATFORM
       ===================================================== */

    analysis.platform =
      analysis.platform ??
      platform;

    analysis.url =
      analysis.url ??
      postUrl;

    analysis.accessible =
      true;


    /* =====================================================
       NORMALIZE AUTHOR
       ===================================================== */

    if (
      !analysis.author ||
      typeof analysis.author !==
        "object"
    ) {
      analysis.author = {
        name:
          post.authorName,
        handle:
          post.authorHandle,
      };
    }

    if (
      analysis.author.name ===
      undefined
    ) {
      analysis.author.name =
        post.authorName;
    }

    if (
      analysis.author.handle ===
      undefined
    ) {
      analysis.author.handle =
        post.authorHandle;
    }


    /* =====================================================
       NORMALIZE CONTENT
       ===================================================== */

    if (
      analysis.content ===
      undefined ||
      analysis.content ===
        null
    ) {
      analysis.content =
        post.content;
    }


    /* =====================================================
       NORMALIZE POST TYPE
       ===================================================== */

    if (
      !analysis.postType
    ) {
      analysis.postType =
        post.postType ||
        "POST";
    }


    /* =====================================================
       NORMALIZE ENGAGEMENT
       ===================================================== */

    if (
      !analysis.engagement ||
      typeof analysis.engagement !==
        "object"
    ) {
      analysis.engagement = {
        likes:
          post.likes,
        comments:
          post.comments,
        shares:
          post.shares,
        views:
          post.views,
      };
    } else {

      if (
        analysis.engagement.likes ===
        undefined
      ) {
        analysis.engagement.likes =
          post.likes;
      }

      if (
        analysis.engagement.comments ===
        undefined
      ) {
        analysis.engagement.comments =
          post.comments;
      }

      if (
        analysis.engagement.shares ===
        undefined
      ) {
        analysis.engagement.shares =
          post.shares;
      }

      if (
        analysis.engagement.views ===
        undefined
      ) {
        analysis.engagement.views =
          post.views;
      }
    }


    /* =====================================================
       VALIDATE SENTIMENT
       ===================================================== */

    const validSentiments = [
      "POSITIVE",
      "NEGATIVE",
      "NEUTRAL",
      "MIXED",
    ];

    if (
      !analysis.sentiment ||
      typeof analysis.sentiment !==
        "object"
    ) {
      analysis.sentiment = {
        label:
          "NEUTRAL",
        score:
          0.5,
        explanation:
          "",
      };
    }

    if (
      !validSentiments.includes(
        analysis.sentiment.label
      )
    ) {
      analysis.sentiment.label =
        "NEUTRAL";
    }


    /* =====================================================
       VALIDATE SENTIMENT SCORE
       ===================================================== */

    analysis.sentiment.score =
      Number(
        analysis.sentiment.score
      );

    if (
      Number.isNaN(
        analysis.sentiment.score
      )
    ) {
      analysis.sentiment.score =
        0.5;
    }

    analysis.sentiment.score =
      Math.min(
        1,
        Math.max(
          0,
          analysis.sentiment.score
        )
      );

    if (
      typeof analysis.sentiment
        .explanation !==
      "string"
    ) {
      analysis.sentiment.explanation =
        "";
    }


    /* =====================================================
       VALIDATE EMOTIONS
       ===================================================== */

    if (
      !Array.isArray(
        analysis.emotions
      )
    ) {
      analysis.emotions = [];
    }

    analysis.emotions =
      analysis.emotions
        .filter(
          (emotion) =>
            emotion &&
            typeof emotion ===
              "object"
        )
        .map(
          (emotion) => ({
            emotion:
              typeof emotion.emotion ===
              "string"
                ? emotion.emotion
                : "",

            score:
              typeof emotion.score ===
              "number"
                ? Math.min(
                    1,
                    Math.max(
                      0,
                      emotion.score
                    )
                  )
                : 0,
          })
        )
        .filter(
          (emotion) =>
            emotion.emotion.length >
            0
        );


    /* =====================================================
       VALIDATE TOPICS
       ===================================================== */

    if (
      !Array.isArray(
        analysis.topics
      )
    ) {
      analysis.topics = [];
    }

    analysis.topics =
      analysis.topics.filter(
        (topic) =>
          typeof topic ===
          "string" &&
          topic.trim().length >
            0
      );


    /* =====================================================
       VALIDATE INTENT
       ===================================================== */

    if (
      !analysis.intent ||
      typeof analysis.intent !==
        "object"
    ) {
      analysis.intent = {
        label:
          "",
        explanation:
          "",
      };
    }

    if (
      typeof analysis.intent.label !==
      "string"
    ) {
      analysis.intent.label =
        "";
    }

    if (
      typeof analysis.intent
        .explanation !==
      "string"
    ) {
      analysis.intent.explanation =
        "";
    }


    /* =====================================================
       VALIDATE SUMMARY
       ===================================================== */

    if (
      typeof analysis.summary !==
      "string"
    ) {
      analysis.summary =
        "";
    }


    /* =====================================================
       VALIDATE KEY INSIGHTS
       ===================================================== */

    if (
      !Array.isArray(
        analysis.keyInsights
      )
    ) {
      analysis.keyInsights =
        [];
    }

    analysis.keyInsights =
      analysis.keyInsights.filter(
        (item) =>
          typeof item ===
            "string" &&
          item.trim().length >
            0
      );


    /* =====================================================
       VALIDATE TOXICITY
       ===================================================== */

    if (
      !analysis.toxicity ||
      typeof analysis.toxicity !==
        "object"
    ) {
      analysis.toxicity = {
        detected:
          false,
        score:
          0,
        explanation:
          "",
      };
    }

    analysis.toxicity.detected =
      Boolean(
        analysis.toxicity.detected
      );

    analysis.toxicity.score =
      Number(
        analysis.toxicity.score
      );

    if (
      Number.isNaN(
        analysis.toxicity.score
      )
    ) {
      analysis.toxicity.score =
        0;
    }

    analysis.toxicity.score =
      Math.min(
        1,
        Math.max(
          0,
          analysis.toxicity.score
        )
      );

    if (
      typeof analysis.toxicity
        .explanation !==
      "string"
    ) {
      analysis.toxicity.explanation =
        "";
    }


    /* =====================================================
       VALIDATE RECOMMENDATIONS
       ===================================================== */

    if (
      !Array.isArray(
        analysis.recommendations
      )
    ) {
      analysis.recommendations =
        [];
    }

    analysis.recommendations =
      analysis.recommendations.filter(
        (item) =>
          typeof item ===
            "string" &&
          item.trim().length >
            0
      );


    /* =====================================================
       VALIDATE CONFIDENCE
       ===================================================== */

    analysis.confidence =
      Number(
        analysis.confidence
      );

    if (
      Number.isNaN(
        analysis.confidence
      )
    ) {
      analysis.confidence =
        0;
    }

    analysis.confidence =
      Math.min(
        1,
        Math.max(
          0,
          analysis.confidence
        )
      );    /* =====================================================
       FINAL AI RESPONSE
       ===================================================== */

    return {
      post: {
        url: postUrl,

        platform:
          analysis.platform,

        accessible:
          true,

        author:
          analysis.author,

        content:
          analysis.content,

        postType:
          analysis.postType,

        engagement:
          analysis.engagement,
      },

      aiAnalysis: {
        sentiment:
          analysis.sentiment,

        emotions:
          analysis.emotions,

        topics:
          analysis.topics,

        intent:
          analysis.intent,

        summary:
          analysis.summary,

        keyInsights:
          analysis.keyInsights,

        toxicity:
          analysis.toxicity,

        recommendations:
          analysis.recommendations,

        confidence:
          analysis.confidence,
      },

      source: {
        url:
          postUrl,

        retrieved:
          true,

        urlContextUsed:
          false,

        collectionSource:
          post.source,
      },
    };

  } catch (error) {
    console.error(
      "========== GEMINI AI ANALYSIS ERROR =========="
    );

    console.error(
      "Error:",
      error
    );

    if (
      error instanceof Error
    ) {
      console.error(
        "Message:",
        error.message
      );
    }

    console.error(
      "================================================"
    );

    throw new Error(
      error instanceof Error
        ? `Gemini API error: ${error.message}`
        : "Gemini API request failed."
    );
  }
}


/* =========================================================
   EXISTING PROFILE POST ANALYSIS
   ========================================================= */

export async function getPostAnalysis(
  profileId: number
) {
  /* =========================================================
     CHECK PROFILE
     ========================================================= */

  const profile =
    await db.orm.public.MonitoringProfile.first({
      id: profileId,
    });

  if (!profile) {
    throw new Error(
      "Monitoring profile not found."
    );
  }


  /* =========================================================
     GET POSTS
     ========================================================= */

  const posts =
    await db.orm.public.Post
      .where({
        profileId,
      })
      .all();


  /* =========================================================
     BASIC METRICS
     ========================================================= */

  const totalPosts =
    posts.length;

  const totalLikes =
    posts.reduce(
      (sum, post) =>
        sum + post.likes,
      0
    );

  const totalComments =
    posts.reduce(
      (sum, post) =>
        sum + post.comments,
      0
    );

  const totalShares =
    posts.reduce(
      (sum, post) =>
        sum + post.shares,
      0
    );

  const totalViews =
    posts.reduce(
      (sum, post) =>
        sum + post.views,
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
            (totalEngagement /
              totalViews) *
            100
          ).toFixed(2)
        )
      : 0;


  /* =========================================================
     AVERAGES
     ========================================================= */

  const averageLikes =
    totalPosts > 0
      ? Number(
          (
            totalLikes /
            totalPosts
          ).toFixed(2)
        )
      : 0;

  const averageComments =
    totalPosts > 0
      ? Number(
          (
            totalComments /
            totalPosts
          ).toFixed(2)
        )
      : 0;

  const averageShares =
    totalPosts > 0
      ? Number(
          (
            totalShares /
            totalPosts
          ).toFixed(2)
        )
      : 0;

  const averageViews =
    totalPosts > 0
      ? Number(
          (
            totalViews /
            totalPosts
          ).toFixed(2)
        )
      : 0;


  /* =========================================================
     SENTIMENT
     ========================================================= */

  const positivePosts =
    posts.filter(
      (post) =>
        post.sentiment ===
        "POSITIVE"
    );

  const negativePosts =
    posts.filter(
      (post) =>
        post.sentiment ===
        "NEGATIVE"
    );

  const neutralPosts =
    posts.filter(
      (post) =>
        post.sentiment ===
        "NEUTRAL"
    );


  const positivePercentage =
    totalPosts > 0
      ? Number(
          (
            (positivePosts.length /
              totalPosts) *
            100
          ).toFixed(2)
        )
      : 0;

  const negativePercentage =
    totalPosts > 0
      ? Number(
          (
            (negativePosts.length /
              totalPosts) *
            100
          ).toFixed(2)
        )
      : 0;

  const neutralPercentage =
    totalPosts > 0
      ? Number(
          (
            (neutralPosts.length /
              totalPosts) *
            100
          ).toFixed(2)
        )
      : 0;


  /* =========================================================
     AVERAGE SENTIMENT SCORE
     ========================================================= */

  const sentimentScores =
    posts
      .map(
        (post) =>
          post.sentimentScore
      )
      .filter(
        (
          score
        ): score is number =>
          score !== null
      );


  const averageSentimentScore =
    sentimentScores.length > 0
      ? Number(
          (
            sentimentScores.reduce(
              (
                sum,
                score
              ) =>
                sum + score,
              0
            ) /
            sentimentScores.length
          ).toFixed(2)
        )
      : 0;


  /* =========================================================
     TOP PERFORMING POSTS
     ========================================================= */

  const topPosts =
    [...posts]
      .sort(
        (a, b) => {
          const engagementA =
            a.likes +
            a.comments +
            a.shares;

          const engagementB =
            b.likes +
            b.comments +
            b.shares;

          return (
            engagementB -
            engagementA
          );
        }
      )
      .slice(0, 10)
      .map(
        (post) => ({
          id:
            post.id,

          authorName:
            post.authorName,

          authorHandle:
            post.authorHandle,

          content:
            post.content,

          url:
            post.url,

          likes:
            post.likes,

          comments:
            post.comments,

          shares:
            post.shares,

          views:
            post.views,

          engagement:
            post.likes +
            post.comments +
            post.shares,

          engagementRate:
            post.views > 0
              ? Number(
                  (
                    (
                      (
                        post.likes +
                        post.comments +
                        post.shares
                      ) /
                      post.views
                    ) *
                    100
                  ).toFixed(2)
                )
              : 0,

          sentiment:
            post.sentiment,

          sentimentScore:
            post.sentimentScore,

          publishedAt:
            post.publishedAt,
        })
      );


  /* =========================================================
     POST TYPE BREAKDOWN
     ========================================================= */

  const postTypeMap =
    new Map<
      string,
      number
    >();


  for (
    const post of posts
  ) {
    const current =
      postTypeMap.get(
        post.postType
      ) ?? 0;

    postTypeMap.set(
      post.postType,
      current + 1
    );
  }


  const postTypeBreakdown =
    Array.from(
      postTypeMap.entries()
    ).map(
      ([type, count]) => ({
        type,

        count,

        percentage:
          totalPosts > 0
            ? Number(
                (
                  (count /
                    totalPosts) *
                  100
                ).toFixed(2)
              )
            : 0,
      })
    );


  /* =========================================================
     SENTIMENT BREAKDOWN
     ========================================================= */

  const sentimentBreakdown =
    [
      {
        sentiment:
          "POSITIVE",

        count:
          positivePosts.length,

        percentage:
          positivePercentage,
      },

      {
        sentiment:
          "NEGATIVE",

        count:
          negativePosts.length,

        percentage:
          negativePercentage,
      },

      {
        sentiment:
          "NEUTRAL",

        count:
          neutralPosts.length,

        percentage:
          neutralPercentage,
      },
    ];


  /* =========================================================
     FINAL RESPONSE
     ========================================================= */

  return {
    profile: {
      id:
        profile.id,

      name:
        profile.name,

      type:
        profile.type,

      identifier:
        profile.identifier,
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
      positive:
        positivePercentage,

      negative:
        negativePercentage,

      neutral:
        neutralPercentage,

      averageScore:
        averageSentimentScore,
    },

    sentimentBreakdown,

    postTypeBreakdown,

    topPosts,
  };
}