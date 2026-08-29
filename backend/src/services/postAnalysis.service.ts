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
   TYPES
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
        .replace(/^www\./, "");

    if (
      hostname === "x.com" ||
      hostname === "twitter.com" ||
      hostname === "mobile.twitter.com"
    ) {
      return "X";
    }

    if (
      hostname === "instagram.com" ||
      hostname === "instagr.am"
    ) {
      return "INSTAGRAM";
    }

    if (
      hostname === "youtube.com" ||
      hostname === "youtu.be"
    ) {
      return "YOUTUBE";
    }

    if (
      hostname === "t.me" ||
      hostname === "telegram.me" ||
      hostname === "telegram.org"
    ) {
      return "TELEGRAM";
    }

    return null;
  } catch {
    return null;
  }
}


/* =========================================================
   FIND POST BY URL
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

  if (posts.length === 0) {
    return null;
  }

  return posts[0];
}/* =========================================================
   ANALYZE SINGLE POST WITH GEMINI
   ========================================================= */

export async function analyzePostWithAI(
  url: string
) {
  /* =======================================================
     VALIDATE URL
     ======================================================= */

  if (!url || !url.trim()) {
    throw new Error(
      "Post URL is required."
    );
  }

  const postUrl = url.trim();

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(postUrl);
  } catch {
    throw new Error(
      "Invalid post URL."
    );
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error(
      "Invalid post URL."
    );
  }


  /* =======================================================
     DETECT PLATFORM
     ======================================================= */

  const platform =
    detectPlatform(postUrl);

  if (!platform) {
    throw new Error(
      "Unsupported platform. Supported platforms are X, Instagram, YouTube and Telegram."
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
     AI PROMPT
     ======================================================= */

  const prompt = `
You are the AI analysis engine of SocialIntel.

SocialIntel is a social media intelligence
platform.

Analyze the REAL social-media post available
at this URL:

${postUrl}

Platform:

${platform}

IMPORTANT RULES:

1. Use the URL Context tool to retrieve the page.

2. Analyze only information actually retrieved
   from the URL.

3. Do NOT invent the caption, author,
   engagement numbers, topics, or other facts.

4. If information cannot be retrieved,
   use null or [].

5. Clearly indicate when the page could not
   be accessed.

6. Return ONLY valid JSON.

7. Do not use markdown code fences.


RETURN EXACTLY THIS STRUCTURE:

{
  "platform": "${platform}",
  "url": "${postUrl}",

  "accessible": true,

  "author": {
    "name": null,
    "handle": null
  },

  "content": null,

  "postType": "TEXT",

  "engagement": {
    "likes": null,
    "comments": null,
    "shares": null,
    "views": null
  },

  "sentiment": {
    "label": "POSITIVE",
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


ANALYSIS REQUIREMENTS:

SENTIMENT:

POSITIVE
NEGATIVE
NEUTRAL
MIXED


SENTIMENT SCORE:

0 = extremely negative

0.5 = neutral

1 = extremely positive


EMOTIONS:

Identify meaningful emotions such as:

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


TOPICS:

Return concise topics actually discussed
in the post.


INTENT:

Examples:

informational
promotional
opinion
announcement
persuasive
entertainment
question
complaint


SUMMARY:

Give a concise factual summary.


KEY INSIGHTS:

Extract important insights from the
actual post.


TOXICITY:

Detect abusive, hateful, threatening,
toxic, or harmful language.


CONFIDENCE:

Return a number from 0 to 1.


IF THE URL CANNOT BE ACCESSED:

Set:

"accessible": false

Do not invent content.
`;


  /* =======================================================
     CALL GEMINI WITH URL CONTEXT
     ======================================================= */

  try {
    const interaction =
      await gemini.interactions.create({
        model: "gemini-3.6-flash",

        input: prompt,

        tools: [
          {
            type: "url_context",
          },
        ],
      });


    /* =====================================================
       GET MODEL OUTPUT
       ===================================================== */

    let text = "";

    const urlContextResults: unknown[] =
      [];

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

      if (
        step.type ===
        "url_context_result"
      ) {
        urlContextResults.push(
          step
        );
      }
    }


    console.log(
      "========== GEMINI URL CONTEXT =========="
    );

    console.log(
      JSON.stringify(
        urlContextResults,
        null,
        2
      )
    );

    console.log(
      "========================================="
    );


    if (!text.trim()) {
      throw new Error(
        "Gemini returned an empty analysis."
      );
    }


    /* =====================================================
       CLEAN JSON
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


    let analysis:
      AIAnalysisResult;

    try {
      analysis =
        JSON.parse(
          cleanText
        ) as AIAnalysisResult;
    } catch (error) {
      console.error(
        "Failed to parse Gemini response:",
        error
      );

      console.error(
        "Gemini raw response:",
        text
      );

      throw new Error(
        "Gemini returned an invalid analysis format."
      );
    }    /* =====================================================
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
      typeof analysis.sentiment !== "object"
    ) {
      analysis.sentiment = {
        label: "NEUTRAL",
        score: 0.5,
        explanation: "",
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
      analysis.sentiment.score = 0.5;
    }

    analysis.sentiment.score =
      Math.min(
        1,
        Math.max(
          0,
          analysis.sentiment.score
        )
      );


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
      analysis.emotions.map(
        (emotion) => ({
          emotion:
            typeof emotion?.emotion ===
            "string"
              ? emotion.emotion
              : "",

          score:
            typeof emotion?.score ===
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
          "string"
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
        label: "",
        explanation: "",
      };
    }

    if (
      typeof analysis.intent.label !==
      "string"
    ) {
      analysis.intent.label = "";
    }

    if (
      typeof analysis.intent
        .explanation !== "string"
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
      analysis.summary = "";
    }


    /* =====================================================
       VALIDATE KEY INSIGHTS
       ===================================================== */

    if (
      !Array.isArray(
        analysis.keyInsights
      )
    ) {
      analysis.keyInsights = [];
    }

    analysis.keyInsights =
      analysis.keyInsights.filter(
        (item) =>
          typeof item ===
          "string"
      );


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
          "string"
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
        detected: false,
        score: 0,
        explanation: "",
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
      analysis.toxicity.score = 0;
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
        .explanation !== "string"
    ) {
      analysis.toxicity.explanation =
        "";
    }


    /* =====================================================
       VALIDATE ENGAGEMENT
       ===================================================== */

    if (
      !analysis.engagement ||
      typeof analysis.engagement !==
        "object"
    ) {
      analysis.engagement = {
        likes: null,
        comments: null,
        shares: null,
        views: null,
      };
    }


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
      analysis.confidence = 0;
    }

    analysis.confidence =
      Math.min(
        1,
        Math.max(
          0,
          analysis.confidence
        )
      );


    /* =====================================================
       NORMALIZE ACCESSIBILITY
       ===================================================== */

    analysis.accessible =
      Boolean(
        analysis.accessible
      );


    /* =====================================================
       RETURN AI ANALYSIS
       ===================================================== */

    return {
      post: {
        url: postUrl,

        platform:
          analysis.platform ??
          platform,

        accessible:
          analysis.accessible,

        author:
          analysis.author ?? {
            name: null,
            handle: null,
          },

        content:
          analysis.content ?? null,

        postType:
          analysis.postType ??
          "OTHER",

        engagement:
          analysis.engagement ?? {
            likes: null,
            comments: null,
            shares: null,
            views: null,
          },
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
        url: postUrl,

        retrieved:
          analysis.accessible,

        urlContextUsed:
          true,
      },

      urlContextResults,
    };
  } catch (error) {
    console.error(
      "========== GEMINI URL ANALYSIS ERROR =========="
    );

    console.error(
      "Error:",
      error
    );

    if (error instanceof Error) {
      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Stack:",
        error.stack
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
}/* =========================================================
   EXISTING PROFILE POST ANALYSIS
   ========================================================= */

export async function getPostAnalysis(
  profileId: number
) {
  /* =========================================================
     MAKE SURE PROFILE EXISTS
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
     GET ALL POSTS FOR PROFILE
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
      .sort((a, b) => {
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
      })
      .slice(0, 10)
      .map((post) => ({
        id: post.id,

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
                  ((post.likes +
                    post.comments +
                    post.shares) /
                    post.views) *
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
      }));


  /* =========================================================
     POST TYPE BREAKDOWN
     ========================================================= */

  const postTypeMap =
    new Map<
      string,
      number
    >();


  for (const post of posts) {
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
      id: profile.id,

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