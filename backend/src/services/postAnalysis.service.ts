import { GoogleGenAI } from "@google/genai";
import { ApifyClient } from "apify-client";

import { db } from "../prisma/db.js";

/* =========================================================
   ENVIRONMENT CONFIGURATION
   ========================================================= */

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const APIFY_API_TOKEN =
  process.env.APIFY_API_TOKEN;


/* =========================================================
   GEMINI CLIENT
   ========================================================= */

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
   APIFY CLIENT
   ========================================================= */

if (!APIFY_API_TOKEN) {
  console.warn(
    "⚠️ APIFY_API_TOKEN is not configured in backend/.env"
  );
}

const apify = APIFY_API_TOKEN
  ? new ApifyClient({
      token: APIFY_API_TOKEN,
    })
  : null;


/* =========================================================
   APIFY ACTOR
   ========================================================= */

const INSTAGRAM_SCRAPER_ACTOR =
  "apify/instagram-scraper";


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
   APIFY INSTAGRAM POST TYPE
   ========================================================= */

interface ApifyInstagramPost {
  id?: string | number;

  shortCode?: string;

  url?: string;

  type?: string;

  productType?: string;

  caption?: string | null;

  ownerUsername?: string | null;

  ownerFullName?: string | null;

  ownerId?: string | number | null;

  likesCount?: number | null;

  commentsCount?: number | null;

  sharesCount?: number | null;

  videoViewCount?: number | null;

  videoPlayCount?: number | null;

  plays?: number | null;

  timestamp?: string | null;

  displayUrl?: string | null;

  videoUrl?: string | null;

  isSponsored?: boolean;

  isCommentsDisabled?: boolean;

  [key: string]: unknown;
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
      hostname === "youtube.com" ||
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

    if (
      hostname === "facebook.com" ||
      hostname ===
        "fb.com" ||
      hostname ===
        "fb.watch"
    ) {
      return "FACEBOOK";
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
}


/* =========================================================
   NUMBER NORMALIZER
   ========================================================= */

function toNullableNumber(
  value: unknown
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed =
      Number(value);

    if (
      Number.isFinite(parsed)
    ) {
      return parsed;
    }
  }

  return null;
}


/* =========================================================
   STRING NORMALIZER
   ========================================================= */

function toNullableString(
  value: unknown
): string | null {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return null;
}


/* =========================================================
   INSTAGRAM POST TYPE
   ========================================================= */

function getInstagramPostType(
  item: ApifyInstagramPost
): string {
  const productType =
    item.productType
      ?.toLowerCase();

  const type =
    item.type
      ?.toLowerCase();

  if (
    productType?.includes("reel") ||
    type?.includes("reel")
  ) {
    return "VIDEO";
  }

  if (
    productType?.includes("igtv") ||
    type?.includes("igtv")
  ) {
    return "VIDEO";
  }

  if (
    type?.includes("video")
  ) {
    return "VIDEO";
  }

  return "POST";
}


/* =========================================================
   INSTAGRAM ITEM → INTERNAL POST
   ========================================================= */

function normalizeInstagramPost(
  item: ApifyInstagramPost,
  requestedUrl: string
): CollectedPostForAI {
  const likes =
    toNullableNumber(
      item.likesCount
    );

  const comments =
    toNullableNumber(
      item.commentsCount
    );

  const shares =
    toNullableNumber(
      item.sharesCount
    );

  /*
   * Instagram scraper versions can expose
   * video metrics under different fields.
   */
  const views =
    toNullableNumber(
      item.videoViewCount
    ) ??
    toNullableNumber(
      item.videoPlayCount
    ) ??
    toNullableNumber(
      item.plays
    );

  const content =
    toNullableString(
      item.caption
    );

  const authorName =
    toNullableString(
      item.ownerFullName
    );

  const authorHandle =
    toNullableString(
      item.ownerUsername
    );

  const publishedAt =
    toNullableString(
      item.timestamp
    );

  const postType =
    getInstagramPostType(
      item
    );

  return {
    platform:
      "INSTAGRAM",

    url:
      toNullableString(
        item.url
      ) ??
      requestedUrl,

    authorName,

    authorHandle,

    content,

    postType,

    likes,

    comments,

    shares,

    views,

    publishedAt,

    source:
      "PUBLIC_URL",
  };
}

/* =========================================================
   FETCH INSTAGRAM POST USING APIFY
   ========================================================= */

async function fetchInstagramPost(
  url: string
): Promise<CollectedPostForAI> {
  /* ---------------------------------------------------------
     Check Apify configuration
     --------------------------------------------------------- */

  if (!apify) {
    throw new Error(
      "Instagram data service is not configured. Add APIFY_API_TOKEN to backend/.env."
    );
  }

  /* ---------------------------------------------------------
     Validate that this is actually an Instagram URL
     --------------------------------------------------------- */

  const platform =
    detectPlatform(url);

  if (platform !== "INSTAGRAM") {
    throw new Error(
      "Unsupported platform. This endpoint currently supports Instagram URLs."
    );
  }

  /* ---------------------------------------------------------
     Validate Instagram post/reel URL
     --------------------------------------------------------- */

  let parsedUrl: URL;

  try {
    parsedUrl =
      new URL(url);
  } catch {
    throw new Error(
      "Invalid post URL."
    );
  }

  const pathname =
    parsedUrl.pathname
      .toLowerCase();

  const isInstagramPost =
    pathname.startsWith("/p/") ||
    pathname.startsWith("/reel/") ||
    pathname.startsWith("/reels/");

  if (!isInstagramPost) {
    throw new Error(
      "Invalid Instagram post URL. Please provide an Instagram post or reel URL."
    );
  }

  /* ---------------------------------------------------------
     Remove tracking query parameters.
     
     Example:
     
     https://www.instagram.com/p/ABC/?igsh=123
     
     becomes:
     
     https://www.instagram.com/p/ABC/
     
     This makes matching more reliable.
     --------------------------------------------------------- */

  const cleanUrl =
    `https://www.instagram.com${parsedUrl.pathname}`;

  console.log(
    "=============================================="
  );

  console.log(
    "📸 Instagram URL received:"
  );

  console.log(
    cleanUrl
  );

  console.log(
    "🚀 Starting Apify Instagram scraper..."
  );

  console.log(
    "=============================================="
  );

  try {
    /* -------------------------------------------------------
       Start Apify Actor
       ------------------------------------------------------- */

    const run =
      await apify
        .actor(
          INSTAGRAM_SCRAPER_ACTOR
        )
        .call({
          directUrls: [
            cleanUrl,
          ],

          resultsType:
            "posts",

          resultsLimit: 1,
        });

    console.log(
      "✅ Apify run completed."
    );

    console.log(
      "Apify run ID:",
      run.id
    );

    console.log(
      "Dataset ID:",
      run.defaultDatasetId
    );

    /* -------------------------------------------------------
       Retrieve Actor dataset
       ------------------------------------------------------- */

    const dataset =
      await apify
        .dataset(
          run.defaultDatasetId
        )
        .listItems();

    const items =
      dataset.items;

    if (
      !items ||
      items.length === 0
    ) {
      throw new Error(
        "Instagram post could not be retrieved."
      );
    }

    console.log(
      `📦 Apify returned ${items.length} result(s).`
    );

    /* -------------------------------------------------------
       Take the first result.
       
       We requested resultsLimit = 1,
       so this should be our requested post.
       ------------------------------------------------------- */

    const rawPost =
      items[0] as ApifyInstagramPost;

    console.log(
      "Instagram post ID:",
      rawPost.id
    );

    console.log(
      "Instagram shortcode:",
      rawPost.shortCode
    );

    console.log(
      "Instagram username:",
      rawPost.ownerUsername
    );

    /* -------------------------------------------------------
       Normalize the Apify response into
       SocialIntel's internal format.
       ------------------------------------------------------- */

    const post =
      normalizeInstagramPost(
        rawPost,
        cleanUrl
      );

    /* -------------------------------------------------------
       Make sure the scraper actually returned
       something useful.
       ------------------------------------------------------- */

    if (
      !post.content ||
      !post.content.trim()
    ) {
      console.warn(
        "⚠️ Instagram post retrieved, but caption is empty."
      );
    }

    console.log(
      "=============================================="
    );

    console.log(
      "✅ Instagram post successfully retrieved."
    );

    console.log(
      "Author:",
      post.authorHandle
    );

    console.log(
      "Likes:",
      post.likes
    );

    console.log(
      "Comments:",
      post.comments
    );

    console.log(
      "Views:",
      post.views
    );

    console.log(
      "Post type:",
      post.postType
    );

    console.log(
      "Caption available:",
      Boolean(
        post.content
      )
    );

    console.log(
      "=============================================="
    );

    return post;
  } catch (error) {
    console.error(
      "=============================================="
    );

    console.error(
      "❌ Instagram Apify retrieval failed."
    );

    console.error(
      error
    );

    console.error(
      "=============================================="
    );

    if (
      error instanceof Error
    ) {
      throw new Error(
        `Instagram data retrieval failed: ${error.message}`
      );
    }

    throw new Error(
      "Instagram data retrieval failed."
    );
  }
}/* =========================================================
   GEMINI AI ANALYSIS
   ========================================================= */

async function analyzeInstagramContentWithGemini(
  post: CollectedPostForAI
): Promise<AIAnalysisResult> {
  /* ---------------------------------------------------------
     Check Gemini configuration
     --------------------------------------------------------- */

  if (!gemini) {
    throw new Error(
      "Gemini AI is not configured. Please add GEMINI_API_KEY to backend/.env."
    );
  }

  /* ---------------------------------------------------------
     Make sure there is content to analyze
     --------------------------------------------------------- */

  if (
    !post.content ||
    !post.content.trim()
  ) {
    throw new Error(
      "The post was retrieved, but no analyzable text content was found."
    );
  }

  /* ---------------------------------------------------------
     Build the prompt
     --------------------------------------------------------- */

  const prompt = `
You are the AI analysis engine for SocialIntel.

SocialIntel is a social intelligence platform that analyzes
public social-media posts.

You are analyzing ONE REAL Instagram post retrieved by the
SocialIntel backend.

Do NOT pretend to access Instagram yourself.

Use ONLY the information supplied below.

=========================================================
INSTAGRAM POST
=========================================================

Platform:
Instagram

URL:
${post.url}

Author name:
${post.authorName ?? "Unknown"}

Author handle:
${post.authorHandle ?? "Unknown"}

Post type:
${post.postType}

Caption:
${post.content}

Likes:
${post.likes ?? "Unknown"}

Comments:
${post.comments ?? "Unknown"}

Shares:
${post.shares ?? "Unknown"}

Views:
${post.views ?? "Unknown"}

Published at:
${post.publishedAt ?? "Unknown"}

=========================================================
ANALYSIS TASK
=========================================================

Analyze the Instagram post carefully.

Determine:

1. Overall sentiment
2. Sentiment score
3. Emotions expressed
4. Main topics
5. Post intent
6. Concise summary
7. Important key insights
8. Toxicity
9. Actionable recommendations
10. Overall confidence

The analysis should be useful for a professional
social-intelligence dashboard.

=========================================================
SENTIMENT
=========================================================

Choose one:

POSITIVE
NEGATIVE
NEUTRAL
MIXED

The sentiment score must be between 0 and 1.

A higher score means stronger confidence in the
identified sentiment.

=========================================================
EMOTIONS
=========================================================

Identify relevant emotions such as:

JOY
EXCITEMENT
ANGER
SADNESS
FEAR
SURPRISE
DISGUST
TRUST
OPTIMISM
CURIOSITY
NEUTRAL

Only include emotions that are actually supported
by the post.

Each emotion must have a score between 0 and 1.

=========================================================
TOPICS
=========================================================

Identify the main subjects discussed in the post.

Return concise topic names.

Examples:

Technology
Politics
Sports
Fashion
Entertainment
Education
Business
Travel
Food
Health
Environment

Do not invent topics that are not supported.

=========================================================
INTENT
=========================================================

Determine the primary purpose of the post.

Possible examples:

INFORM
PROMOTE
ENTERTAIN
EDUCATE
PERSUADE
ANNOUNCE
ENGAGE
PERSONAL_UPDATE
EXPRESS_OPINION
OTHER

Explain why you selected the intent.

=========================================================
SUMMARY
=========================================================

Provide a concise summary of what the post communicates.

=========================================================
KEY INSIGHTS
=========================================================

Return useful observations for a social-media analyst.

Examples:

- Strong promotional language
- Positive audience-facing message
- Potential engagement opportunity
- Controversial subject
- Clear call to action

Only include insights supported by the content.

=========================================================
TOXICITY
=========================================================

Determine whether the post contains:

- harassment
- abusive language
- hateful language
- threats
- severe profanity
- targeted insults

Do not classify ordinary criticism as toxic.

Toxicity score must be between 0 and 1.

=========================================================
RECOMMENDATIONS
=========================================================

Provide practical recommendations for the person
or organization monitoring this post.

Recommendations should be concise and actionable.

=========================================================
CONFIDENCE
=========================================================

Return an overall confidence score between 0 and 1.

=========================================================
OUTPUT FORMAT
=========================================================

Return ONLY valid JSON.

Do not return Markdown.

Do not use:

\`\`\`json

Do not add any text before or after the JSON.

Use exactly this structure:

{
  "platform": "INSTAGRAM",
  "url": "${post.url}",
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
    "label": "POSITIVE",
    "score": 0.0,
    "explanation": ""
  },
  "emotions": [
    {
      "emotion": "",
      "score": 0.0
    }
  ],
  "topics": [
    ""
  ],
  "intent": {
    "label": "",
    "explanation": ""
  },
  "summary": "",
  "keyInsights": [
    ""
  ],
  "toxicity": {
    "detected": false,
    "score": 0.0,
    "explanation": ""
  },
  "recommendations": [
    ""
  ],
  "confidence": 0.0
}

=========================================================
IMPORTANT RULES
=========================================================

- Never invent engagement numbers.
- Never invent the author.
- Never invent information that isn't supplied.
- Keep scores between 0 and 1.
- Return valid JSON only.
- Base the analysis primarily on the actual caption.
- Be concise but useful.
`;


  /* ---------------------------------------------------------
     Call Gemini
     --------------------------------------------------------- */

  try {
    console.log(
      "🤖 Sending Instagram post to Gemini..."
    );

    const response =
      await gemini.models.generateContent({
        model:
          "gemini-2.5-flash",

        contents:
          prompt,

        config: {
          temperature: 0.2,

          responseMimeType:
            "application/json",
        },
      });

    const responseText =
      response.text?.trim();

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    console.log(
      "✅ Gemini response received."
    );

    /* -------------------------------------------------------
       Parse JSON
       ------------------------------------------------------- */

    let parsed: unknown;

    try {
      parsed =
        JSON.parse(
          responseText
        );
    } catch (error) {
      console.error(
        "❌ Gemini returned invalid JSON:"
      );

      console.error(
        responseText
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    /* -------------------------------------------------------
       Basic validation
       ------------------------------------------------------- */

    if (
      typeof parsed !==
      "object" ||
      parsed === null
    ) {
      throw new Error(
        "Gemini returned an invalid analysis object."
      );
    }

    const result =
      parsed as Record<
        string,
        unknown
      >;

    /* -------------------------------------------------------
       Safe helpers
       ------------------------------------------------------- */

    const sentiment =
      result.sentiment;

    const emotions =
      result.emotions;

    const topics =
      result.topics;

    const intent =
      result.intent;

    const toxicity =
      result.toxicity;

    /* -------------------------------------------------------
       Return normalized AI result
       ------------------------------------------------------- */

    return {
      platform:
        "INSTAGRAM",

      url:
        post.url,

      accessible:
        true,

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

      sentiment:
        typeof sentiment ===
          "object" &&
        sentiment !== null
          ? {
              label:
                String(
                  (
                    sentiment as Record<
                      string,
                      unknown
                    >
                  ).label ??
                    "NEUTRAL"
                ) as
                  | "POSITIVE"
                  | "NEGATIVE"
                  | "NEUTRAL"
                  | "MIXED",

              score:
                Number(
                  (
                    sentiment as Record<
                      string,
                      unknown
                    >
                  ).score ?? 0
                ),

              explanation:
                String(
                  (
                    sentiment as Record<
                      string,
                      unknown
                    >
                  ).explanation ??
                    ""
                ),
            }
          : {
              label:
                "NEUTRAL",

              score:
                0,

              explanation:
                "",
            },

      emotions:
        Array.isArray(
          emotions
        )
          ? emotions.map(
              (
                emotion
              ) => {
                if (
                  typeof emotion !==
                    "object" ||
                  emotion === null
                ) {
                  return {
                    emotion:
                      String(
                        emotion
                      ),
                    score:
                      0,
                  };
                }

                const item =
                  emotion as Record<
                    string,
                    unknown
                  >;

                return {
                  emotion:
                    String(
                      item.emotion ??
                        item.label ??
                        ""
                    ),

                  score:
                    Number(
                      item.score ??
                        0
                    ),
                };
              }
            )
          : [],

      topics:
        Array.isArray(
          topics
        )
          ? topics.map(
              (topic) =>
                String(
                  topic
                )
            )
          : [],

      intent:
        typeof intent ===
          "object" &&
        intent !== null
          ? {
              label:
                String(
                  (
                    intent as Record<
                      string,
                      unknown
                    >
                  ).label ??
                    ""
                ),

              explanation:
                String(
                  (
                    intent as Record<
                      string,
                      unknown
                    >
                  ).explanation ??
                    ""
                ),
            }
          : {
              label:
                "",

              explanation:
                "",
            },

      summary:
        typeof result.summary ===
        "string"
          ? result.summary
          : "",

      keyInsights:
        Array.isArray(
          result.keyInsights
        )
          ? result.keyInsights.map(
              (item) =>
                String(item)
            )
          : [],

      toxicity:
        typeof toxicity ===
          "object" &&
        toxicity !== null
          ? {
              detected:
                Boolean(
                  (
                    toxicity as Record<
                      string,
                      unknown
                    >
                  ).detected ??
                    false
                ),

              score:
                Number(
                  (
                    toxicity as Record<
                      string,
                      unknown
                    >
                  ).score ??
                    0
                ),

              explanation:
                String(
                  (
                    toxicity as Record<
                      string,
                      unknown
                    >
                  ).explanation ??
                    ""
                ),
            }
          : {
              detected:
                false,

              score:
                0,

              explanation:
                "",
            },

      recommendations:
        Array.isArray(
          result.recommendations
        )
          ? result.recommendations.map(
              (item) =>
                String(item)
            )
          : [],

      confidence:
        Number(
          result.confidence ??
            0
        ),
    };
  } catch (error) {
    console.error(
      "❌ Gemini Instagram analysis failed:",
      error
    );

    if (
      error instanceof Error
    ) {
      throw new Error(
        `Gemini AI analysis failed: ${error.message}`
      );
    }

    throw new Error(
      "Gemini AI analysis failed."
    );
  }
}/* =========================================================
   MAIN POST ANALYSIS ENTRY POINT
   ========================================================= */

/**
 * Analyze a post from a public social-media URL.
 *
 * Current supported platform:
 *
 * Instagram
 *
 * Flow:
 *
 * URL
 *   ↓
 * Detect platform
 *   ↓
 * Apify
 *   ↓
 * Real Instagram post
 *   ↓
 * Gemini
 *   ↓
 * SocialIntel AI analysis
 */
export async function analyzePostWithAI(
  url: string
) {
  /* ---------------------------------------------------------
     Validate URL
     --------------------------------------------------------- */

  if (
    typeof url !== "string" ||
    !url.trim()
  ) {
    throw new Error(
      "Post URL is required."
    );
  }

  const trimmedUrl =
    url.trim();

  /* ---------------------------------------------------------
     Validate URL format
     --------------------------------------------------------- */

  try {
    new URL(trimmedUrl);
  } catch {
    throw new Error(
      "Invalid post URL."
    );
  }

  /* ---------------------------------------------------------
     Detect platform
     --------------------------------------------------------- */

  const platform =
    detectPlatform(
      trimmedUrl
    );

  if (!platform) {
    throw new Error(
      "Unsupported platform. Currently Instagram post and reel URLs are supported."
    );
  }

  console.log(
    "=============================================="
  );

  console.log(
    "🔎 SocialIntel Post Analysis"
  );

  console.log(
    "Platform:",
    platform
  );

  console.log(
    "URL:",
    trimmedUrl
  );

  console.log(
    "=============================================="
  );


  /* =========================================================
     INSTAGRAM
     ========================================================= */

  if (
    platform === "INSTAGRAM"
  ) {
    /*
     * Step 1:
     * Retrieve the REAL Instagram post through Apify.
     */

    const instagramPost =
      await fetchInstagramPost(
        trimmedUrl
      );


    /*
     * Step 2:
     * Send the retrieved post content to Gemini.
     */

    const aiAnalysis =
      await analyzeInstagramContentWithGemini(
        instagramPost
      );


    /*
     * Step 3:
     * Return the response in the structure
     * expected by SocialIntel.
     */

    return {
      post: {
        platform:
          "INSTAGRAM",

        url:
          instagramPost.url,

        accessible:
          true,

        author: {
          name:
            instagramPost.authorName,

          handle:
            instagramPost.authorHandle,
        },

        content:
          instagramPost.content,

        postType:
          instagramPost.postType,

        engagement: {
          likes:
            instagramPost.likes,

          comments:
            instagramPost.comments,

          shares:
            instagramPost.shares,

          views:
            instagramPost.views,
        },

        publishedAt:
          instagramPost.publishedAt,
      },

      aiAnalysis: {
        sentiment:
          aiAnalysis.sentiment,

        emotions:
          aiAnalysis.emotions,

        topics:
          aiAnalysis.topics,

        intent:
          aiAnalysis.intent,

        summary:
          aiAnalysis.summary,

        keyInsights:
          aiAnalysis.keyInsights,

        toxicity:
          aiAnalysis.toxicity,

        recommendations:
          aiAnalysis.recommendations,

        confidence:
          aiAnalysis.confidence,
      },

      source: {
        url:
          instagramPost.url,

        retrieved:
          true,

        provider:
          "APIFY",

        aiProvider:
          "GEMINI",

        urlContextUsed:
          false,
      },
    };
  }


  /* =========================================================
     FUTURE PLATFORMS
     ========================================================= */

  /*
   * X / Twitter, Facebook and Telegram will be added
   * here later.
   *
   * We are intentionally NOT changing those integrations
   * yet so the existing application remains stable.
   */

  throw new Error(
    `Unsupported platform: ${platform}`
  );
}
