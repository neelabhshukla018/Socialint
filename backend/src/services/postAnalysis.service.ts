import { GoogleGenAI } from "@google/genai";
import { ApifyClient } from "apify-client";

import { db } from "../prisma/db.js";

/* =========================================================
   ENVIRONMENT
   ========================================================= */

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const APIFY_API_TOKEN =
  process.env.APIFY_API_TOKEN;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash";

const INSTAGRAM_SCRAPER_ACTOR =
  "apify/instagram-scraper";


/* =========================================================
   GEMINI CLIENT
   ========================================================= */

const gemini =
  GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey:
          GEMINI_API_KEY,
      })
    : null;


/* =========================================================
   APIFY CLIENT
   ========================================================= */

const apify =
  APIFY_API_TOKEN
    ? new ApifyClient({
        token:
          APIFY_API_TOKEN,
      })
    : null;


/* =========================================================
   WARN IF CONFIGURATION IS MISSING
   ========================================================= */

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY is not configured in backend/.env"
  );
}

if (!APIFY_API_TOKEN) {
  console.warn(
    "⚠️ APIFY_API_TOKEN is not configured in backend/.env"
  );
}


/* =========================================================
   TYPES
   ========================================================= */

/**
 * Normalized post used internally by SocialIntel.
 */
export interface CollectedPostForAI {
  platform: string;

  url: string;

  authorName:
    | string
    | null;

  authorHandle:
    | string
    | null;

  content:
    | string
    | null;

  postType: string;

  likes:
    | number
    | null;

  comments:
    | number
    | null;

  shares:
    | number
    | null;

  views:
    | number
    | null;

  publishedAt:
    | string
    | null;

  source:
    | "PUBLIC_URL"
    | "DATABASE";

  mediaUrl:
    | string
    | null;

  mediaType:
    | "IMAGE"
    | "VIDEO"
    | null;

  supplementalText:
    | string
    | null;
}


/**
 * Raw Instagram object returned by Apify.
 *
 * Different versions/configurations of the actor
 * can return slightly different field names.
 *
 * Therefore we intentionally support multiple
 * possible variants.
 */
interface ApifyInstagramPost {
  id?:
    | string
    | number
    | null;

  shortCode?:
    | string
    | null;

  shortcode?:
    | string
    | null;

  code?:
    | string
    | null;

  url?:
    | string
    | null;

  permalink?:
    | string
    | null;

  type?:
    | string
    | null;

  productType?:
    | string
    | null;

  mediaType?:
    | string
    | null;

  isVideo?:
    boolean
    | null;

  caption?:
    | string
    | null;

  description?:
    | string
    | null;

  text?:
    | string
    | null;

  alt?:
    | string
    | null;

  altText?:
    | string
    | null;

  firstComment?:
    | string
    | null;

  firstCommentText?:
    | string
    | null;

  ownerUsername?:
    | string
    | null;

  ownerFullName?:
    | string
    | null;

  ownerId?:
    | string
    | number
    | null;

  username?:
    | string
    | null;

  fullName?:
    | string
    | null;

  authorUsername?:
    | string
    | null;

  authorFullName?:
    | string
    | null;

  owner?:
    | {
        username?:
          | string
          | null;

        fullName?:
          | string
          | null;

        name?:
          | string
          | null;

        id?:
          | string
          | number
          | null;
      }
    | null;

  author?:
    | {
        username?:
          | string
          | null;

        fullName?:
          | string
          | null;

        name?:
          | string
          | null;

        id?:
          | string
          | number
          | null;
      }
    | null;

  likesCount?:
    | number
    | string
    | null;

  commentsCount?:
    | number
    | string
    | null;

  sharesCount?:
    | number
    | string
    | null;

  likeCount?:
    | number
    | string
    | null;

  commentCount?:
    | number
    | string
    | null;

  shareCount?:
    | number
    | string
    | null;

  likes?:
    | number
    | string
    | null;

  comments?:
    | number
    | string
    | null;

  shares?:
    | number
    | string
    | null;

  videoViewCount?:
    | number
    | string
    | null;

  videoPlayCount?:
    | number
    | string
    | null;

  viewCount?:
    | number
    | string
    | null;

  playCount?:
    | number
    | string
    | null;

  plays?:
    | number
    | string
    | null;

  views?:
    | number
    | string
    | null;

  timestamp?:
    | string
    | null;

  takenAt?:
    | string
    | null;

  publishedAt?:
    | string
    | null;

  displayUrl?:
    | string
    | null;

  display_url?:
    | string
    | null;

  imageUrl?:
    | string
    | null;

  imageURL?:
    | string
    | null;

  thumbnailUrl?:
    | string
    | null;

  thumbnailURL?:
    | string
    | null;

  videoUrl?:
    | string
    | null;

  videoURL?:
    | string
    | null;

  latestComments?:
    unknown;

  hashtags?:
    unknown;

  mentions?:
    unknown;

  locationName?:
    string
    | null;

  location?:
    unknown;

  isSponsored?:
    boolean;

  isCommentsDisabled?:
    boolean;

  /*
   * Allows us to safely inspect additional
   * fields returned by Apify.
   */
  [key: string]:
    unknown;
}


/* =========================================================
   GEMINI RESULT TYPES
   ========================================================= */

interface GeminiAnalysis {
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
      hostname ===
        "x.com" ||
      hostname ===
        "twitter.com" ||
      hostname ===
        "mobile.twitter.com"
    ) {
      return "X";
    }

    if (
      hostname ===
        "facebook.com" ||
      hostname ===
        "fb.com" ||
      hostname ===
        "fb.watch"
    ) {
      return "FACEBOOK";
    }

    if (
      hostname ===
        "youtube.com" ||
      hostname ===
        "youtu.be"
    ) {
      return "YOUTUBE";
    }

    if (
      hostname ===
        "t.me" ||
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
   STRING HELPER
   ========================================================= */

function toNullableString(
  value: unknown
): string | null {
  if (
    typeof value ===
      "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return null;
}


/* =========================================================
   NUMBER HELPER
   ========================================================= */

function toNullableNumber(
  value: unknown
): number | null {
  if (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    )
  ) {
    return value;
  }

  if (
    typeof value ===
      "string" &&
    value.trim()
  ) {
    const cleaned =
      value
        .trim()
        .replace(
          /,/g,
          ""
        );

    const direct =
      Number(cleaned);

    if (
      Number.isFinite(
        direct
      )
    ) {
      return direct;
    }

    const match =
      cleaned.match(
        /^([\d.]+)\s*([KMB])$/i
      );

    if (match) {
      const number =
        Number(
          match[1]
        );

      const suffix =
        match[2].toUpperCase();

      if (
        Number.isFinite(
          number
        )
      ) {
        if (
          suffix ===
          "K"
        ) {
          return (
            number *
            1000
          );
        }

        if (
          suffix ===
          "M"
        ) {
          return (
            number *
            1000000
          );
        }

        if (
          suffix ===
          "B"
        ) {
          return (
            number *
            1000000000
          );
        }
      }
    }
  }

  return null;
}


/* =========================================================
   FIRST VALID STRING
   ========================================================= */

function firstValidString(
  ...values: unknown[]
): string | null {
  for (
    const value of values
  ) {
    const result =
      toNullableString(
        value
      );

    if (result) {
      return result;
    }
  }

  return null;
}


/* =========================================================
   FIRST VALID NUMBER
   ========================================================= */

function firstValidNumber(
  ...values: unknown[]
): number | null {
  for (
    const value of values
  ) {
    const result =
      toNullableNumber(
        value
      );

    if (
      result !== null
    ) {
      return result;
    }
  }

  return null;
}/* =========================================================
   INSTAGRAM POST TYPE
   ========================================================= */

function getInstagramPostType(
  item: ApifyInstagramPost
): string {
  const productType =
    toNullableString(
      item.productType
    )?.toLowerCase();

  const type =
    toNullableString(
      item.type
    )?.toLowerCase();

  const mediaType =
    toNullableString(
      item.mediaType
    )?.toLowerCase();

  if (
    productType?.includes(
      "reel"
    ) ||
    type?.includes(
      "reel"
    ) ||
    mediaType?.includes(
      "reel"
    )
  ) {
    return "VIDEO";
  }

  if (
    productType?.includes(
      "igtv"
    ) ||
    type?.includes(
      "igtv"
    )
  ) {
    return "VIDEO";
  }

  if (
    type?.includes(
      "video"
    ) ||
    mediaType?.includes(
      "video"
    ) ||
    item.isVideo === true
  ) {
    return "VIDEO";
  }

  return "POST";
}


/* =========================================================
   INSTAGRAM AUTHOR EXTRACTION
   ========================================================= */

function extractInstagramAuthor(
  item: ApifyInstagramPost
): {
  name: string | null;
  handle: string | null;
} {
  let ownerObject:
    | Record<string, unknown>
    | null = null;

  let authorObject:
    | Record<string, unknown>
    | null = null;


  /*
   * owner may be:
   *
   * {
   *   username: "...",
   *   fullName: "..."
   * }
   */

  if (
    item.owner &&
    typeof item.owner ===
      "object"
  ) {
    ownerObject =
      item.owner as Record<
        string,
        unknown
      >;
  }


  /*
   * author may be:
   *
   * {
   *   username: "...",
   *   fullName: "..."
   * }
   */

  if (
    item.author &&
    typeof item.author ===
      "object"
  ) {
    authorObject =
      item.author as Record<
        string,
        unknown
      >;
  }


  const handle =
    firstValidString(
      /*
       * Top-level variants
       */
      item.ownerUsername,
      item.username,
      item.authorUsername,

      /*
       * Nested owner
       */
      ownerObject?.username,

      /*
       * Nested author
       */
      authorObject?.username
    );


  const name =
    firstValidString(
      /*
       * Top-level variants
       */
      item.ownerFullName,
      item.fullName,
      item.authorFullName,

      /*
       * Nested owner
       */
      ownerObject?.fullName,
      ownerObject?.name,

      /*
       * Nested author
       */
      authorObject?.fullName,
      authorObject?.name
    );


  return {
    name,
    handle,
  };
}


/* =========================================================
   INSTAGRAM CAPTION / TEXT EXTRACTION
   ========================================================= */

function extractInstagramCaption(
  item: ApifyInstagramPost
): string | null {
  return firstValidString(
    item.caption,
    item.description,
    item.text,

    /*
     * Dynamic variants that some scraper
     * versions may return.
     */
    item["caption_text"],
    item["captionText"],
    item["postText"],
    item["post_text"],
    item["description_text"]
  );
}


/* =========================================================
   INSTAGRAM SUPPLEMENTAL TEXT
   ========================================================= */

function extractInstagramSupplementalText(
  item: ApifyInstagramPost
): string | null {
  /*
   * First check common text fields.
   */

  const directText =
    firstValidString(
      item.alt,
      item.altText,
      item.firstComment,
      item.firstCommentText
    );

  if (
    directText
  ) {
    return directText;
  }


  /*
   * latestComments can be an array.
   */

  const latestComments =
    item.latestComments;


  if (
    Array.isArray(
      latestComments
    )
  ) {
    const texts =
      latestComments
        .map(
          (
            comment
          ) => {
            if (
              typeof comment ===
              "string"
            ) {
              return comment.trim();
            }


            if (
              typeof comment ===
                "object" &&
              comment !== null
            ) {
              const object =
                comment as Record<
                  string,
                  unknown
                >;

              return firstValidString(
                object.text,
                object.comment,
                object.content
              );
            }


            return null;
          }
        )
        .filter(
          (
            value
          ): value is string =>
            Boolean(
              value
            )
        )
        .slice(
          0,
          5
        );


    if (
      texts.length > 0
    ) {
      return texts.join(
        "\n"
      );
    }
  }


  return null;
}


/* =========================================================
   INSTAGRAM MEDIA EXTRACTION
   ========================================================= */

function extractInstagramMediaUrl(
  item: ApifyInstagramPost
): string | null {
  return firstValidString(
    /*
     * Main Apify image field
     */
    item.displayUrl,

    /*
     * Alternative naming
     */
    item.display_url,

    /*
     * Image variants
     */
    item.imageUrl,
    item.imageURL,

    /*
     * Thumbnail variants
     */
    item.thumbnailUrl,
    item.thumbnailURL,

    /*
     * Video variants
     */
    item.videoUrl,
    item.videoURL,

    /*
     * Dynamic fields
     */
    item["display_url"],
    item["image_url"],
    item["thumbnail_url"],
    item["video_url"]
  );
}


/* =========================================================
   INSTAGRAM VIDEO EXTRACTION
   ========================================================= */

function extractInstagramVideoUrl(
  item: ApifyInstagramPost
): string | null {
  return firstValidString(
    item.videoUrl,
    item.videoURL,
    item["video_url"]
  );
}


/* =========================================================
   INSTAGRAM ENGAGEMENT EXTRACTION
   ========================================================= */

function extractInstagramLikes(
  item: ApifyInstagramPost
): number | null {
  return firstValidNumber(
    item.likesCount,
    item.likes,
    item.likeCount,
    item["likes_count"],
    item["like_count"]
  );
}


function extractInstagramComments(
  item: ApifyInstagramPost
): number | null {
  return firstValidNumber(
    item.commentsCount,
    item.comments,
    item.commentCount,
    item["comments_count"],
    item["comment_count"]
  );
}


function extractInstagramShares(
  item: ApifyInstagramPost
): number | null {
  return firstValidNumber(
    item.sharesCount,
    item.shares,
    item.shareCount,
    item["shares_count"],
    item["share_count"]
  );
}


function extractInstagramViews(
  item: ApifyInstagramPost
): number | null {
  return firstValidNumber(
    item.videoViewCount,
    item.videoPlayCount,
    item.playCount,
    item.plays,
    item.viewCount,
    item.views,

    /*
     * Dynamic variants
     */
    item["video_view_count"],
    item["video_play_count"],
    item["view_count"],
    item["play_count"]
  );
}


/* =========================================================
   INSTAGRAM PUBLISHED DATE
   ========================================================= */

function extractInstagramPublishedAt(
  item: ApifyInstagramPost
): string | null {
  return firstValidString(
    item.timestamp,
    item.takenAt,
    item.publishedAt,
    item["createdAt"],
    item["created_at"]
  );
}


/* =========================================================
   INSTAGRAM MEDIA TYPE
   ========================================================= */

function getInstagramMediaType(
  item: ApifyInstagramPost,
  postType: string,
  mediaUrl: string | null
):
  | "IMAGE"
  | "VIDEO"
  | null {

  if (
    postType ===
    "VIDEO"
  ) {
    return mediaUrl
      ? "VIDEO"
      : null;
  }

  if (
    mediaUrl
  ) {
    return "IMAGE";
  }

  return null;
}


/* =========================================================
   NORMALIZE INSTAGRAM POST
   ========================================================= */

function normalizeInstagramPost(
  item: ApifyInstagramPost,
  requestedUrl: string
): CollectedPostForAI {

  /* ---------------------------------------------------------
     Author
     --------------------------------------------------------- */

  const author =
    extractInstagramAuthor(
      item
    );


  /* ---------------------------------------------------------
     Caption
     --------------------------------------------------------- */

  const content =
    extractInstagramCaption(
      item
    );


  /* ---------------------------------------------------------
     Supplemental text
     --------------------------------------------------------- */

  const supplementalText =
    extractInstagramSupplementalText(
      item
    );


  /* ---------------------------------------------------------
     Post type
     --------------------------------------------------------- */

  const postType =
    getInstagramPostType(
      item
    );


  /* ---------------------------------------------------------
     Media
     --------------------------------------------------------- */

  const mediaUrl =
    extractInstagramMediaUrl(
      item
    );

  const videoUrl =
    extractInstagramVideoUrl(
      item
    );


  /*
   * If there is no image/display URL but a video
   * URL exists, use the video URL as the media URL.
   */

  const finalMediaUrl =
    mediaUrl ??
    videoUrl ??
    null;


  const mediaType =
    getInstagramMediaType(
      item,
      postType,
      finalMediaUrl
    );


  /* ---------------------------------------------------------
     Engagement
     --------------------------------------------------------- */

  const likes =
    extractInstagramLikes(
      item
    );

  const comments =
    extractInstagramComments(
      item
    );

  const shares =
    extractInstagramShares(
      item
    );

  const views =
    extractInstagramViews(
      item
    );


  /* ---------------------------------------------------------
     Published date
     --------------------------------------------------------- */

  const publishedAt =
    extractInstagramPublishedAt(
      item
    );


  /* ---------------------------------------------------------
     URL
     --------------------------------------------------------- */

  const finalUrl =
    firstValidString(
      item.url,
      item.permalink,
      requestedUrl
    ) ??
    requestedUrl;


  /* ---------------------------------------------------------
     Debug
     --------------------------------------------------------- */

  console.log(
    "=============================================="
  );

  console.log(
    "NORMALIZED INSTAGRAM POST"
  );

  console.log(
    "ID:",
    item.id ?? null
  );

  console.log(
    "Shortcode:",
    firstValidString(
      item.shortCode,
      item.shortcode,
      item.code
    )
  );

  console.log(
    "Author name:",
    author.name
  );

  console.log(
    "Author handle:",
    author.handle
  );

  console.log(
    "Caption available:",
    Boolean(
      content
    )
  );

  console.log(
    "Media available:",
    Boolean(
      finalMediaUrl
    )
  );

  console.log(
    "Media type:",
    mediaType
  );

  console.log(
    "Likes:",
    likes
  );

  console.log(
    "Comments:",
    comments
  );

  console.log(
    "Shares:",
    shares
  );

  console.log(
    "Views:",
    views
  );

  console.log(
    "Published at:",
    publishedAt
  );

  console.log(
    "=============================================="
  );


  /* ---------------------------------------------------------
     Return normalized object
     --------------------------------------------------------- */

  return {
    platform:
      "INSTAGRAM",

    url:
      finalUrl,

    authorName:
      author.name,

    authorHandle:
      author.handle,

    content:
      content,

    postType:
      postType,

    likes:
      likes,

    comments:
      comments,

    shares:
      shares,

    views:
      views,

    publishedAt:
      publishedAt,

    source:
      "PUBLIC_URL",

    mediaUrl:
      finalMediaUrl,

    mediaType:
      mediaType,

    supplementalText:
      supplementalText,
  };
}/* =========================================================
   FETCH INSTAGRAM POST USING APIFY
   ========================================================= */

async function fetchInstagramPost(
  url: string
): Promise<CollectedPostForAI> {

  /* ---------------------------------------------------------
     APIFY CONFIGURATION CHECK
     --------------------------------------------------------- */

  if (!apify) {
    throw new Error(
      "Instagram data service is not configured. Add APIFY_API_TOKEN to backend/.env."
    );
  }


  /* ---------------------------------------------------------
     PLATFORM CHECK
     --------------------------------------------------------- */

  const platform =
    detectPlatform(url);

  if (
    platform !==
    "INSTAGRAM"
  ) {
    throw new Error(
      "Unsupported platform. This endpoint currently supports Instagram URLs."
    );
  }


  /* ---------------------------------------------------------
     PARSE URL
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


  /* ---------------------------------------------------------
     CHECK INSTAGRAM POST / REEL
     --------------------------------------------------------- */

  const pathname =
    parsedUrl.pathname
      .toLowerCase();


  const isInstagramPost =
    pathname.startsWith(
      "/p/"
    ) ||
    pathname.startsWith(
      "/reel/"
    ) ||
    pathname.startsWith(
      "/reels/"
    );


  if (
    !isInstagramPost
  ) {
    throw new Error(
      "Invalid Instagram post URL. Please provide an Instagram post or reel URL."
    );
  }


  /* ---------------------------------------------------------
     CLEAN URL
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

    /* =======================================================
       START APIFY ACTOR
       ======================================================= */

    const run =
      await apify
        .actor(
          INSTAGRAM_SCRAPER_ACTOR
        )
        .call({

          /*
           * IMPORTANT:
           *
           * We are passing the EXACT public Instagram
           * post URL to Apify.
           */

          directUrls: [
            cleanUrl,
          ],

          /*
           * We only need post data.
           */

          resultsType:
            "posts",

          /*
           * We only need one result.
           */

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


    /* =======================================================
       READ DATASET
       ======================================================= */

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


    /* =======================================================
       TAKE FIRST RESULT
       ======================================================= */

    const rawPost =
      items[0] as ApifyInstagramPost;


    /* =======================================================
       LOG RAW APIFY DATA
       ======================================================= */

    console.log(
      "=============================================="
    );

    console.log(
      "RAW APIFY INSTAGRAM DATA"
    );

    console.log(
      "ID:",
      rawPost.id ?? null
    );


    console.log(
      "Shortcode:",
      firstValidString(
        rawPost.shortCode,
        rawPost.shortcode,
        rawPost.code
      )
    );


    console.log(
      "URL:",
      firstValidString(
        rawPost.url,
        rawPost.permalink
      )
    );


    /* =======================================================
       AUTHOR
       ======================================================= */

    const author =
      extractInstagramAuthor(
        rawPost
      );


    console.log(
      "Author name:",
      author.name
    );


    console.log(
      "Author handle:",
      author.handle
    );


    /* =======================================================
       CAPTION
       ======================================================= */

    const caption =
      extractInstagramCaption(
        rawPost
      );


    console.log(
      "Caption available:",
      Boolean(
        caption
      )
    );


    if (
      caption
    ) {
      console.log(
        "Caption preview:",
        caption.substring(
          0,
          200
        )
      );
    }


    /* =======================================================
       MEDIA
       ======================================================= */

    const mediaUrl =
      extractInstagramMediaUrl(
        rawPost
      );


    console.log(
      "Media URL available:",
      Boolean(
        mediaUrl
      )
    );


    /* =======================================================
       ENGAGEMENT
       ======================================================= */

    const likes =
      extractInstagramLikes(
        rawPost
      );


    const comments =
      extractInstagramComments(
        rawPost
      );


    const shares =
      extractInstagramShares(
        rawPost
      );


    const views =
      extractInstagramViews(
        rawPost
      );


    console.log(
      "Likes:",
      likes
    );


    console.log(
      "Comments:",
      comments
    );


    console.log(
      "Shares:",
      shares
    );


    console.log(
      "Views:",
      views
    );


    console.log(
      "=============================================="
    );


    /* =======================================================
       NORMALIZE
       ======================================================= */

    const post =
      normalizeInstagramPost(
        rawPost,
        cleanUrl
      );


    /* =======================================================
       DYNAMIC MEDIA FALLBACK
       ======================================================= */

    /*
     * If the normal fields did not contain a media URL,
     * inspect additional fields returned by Apify.
     */

    if (
      !post.mediaUrl
    ) {

      const dynamicMedia =
        firstValidString(

          rawPost[
            "display_url"
          ],

          rawPost[
            "image_url"
          ],

          rawPost[
            "image"
          ],

          rawPost[
            "thumbnail"
          ],

          rawPost[
            "thumbnail_url"
          ],

          rawPost[
            "video_url"
          ],

          rawPost[
            "video"
          ]
        );


      if (
        dynamicMedia
      ) {

        post.mediaUrl =
          dynamicMedia;


        post.mediaType =
          post.postType ===
          "VIDEO"
            ? "VIDEO"
            : "IMAGE";
      }
    }


    /* =======================================================
       DYNAMIC CAPTION FALLBACK
       ======================================================= */

    if (
      !post.content
    ) {

      const dynamicCaption =
        firstValidString(

          rawPost[
            "caption_text"
          ],

          rawPost[
            "captionText"
          ],

          rawPost[
            "postText"
          ],

          rawPost[
            "post_text"
          ],

          rawPost[
            "description_text"
          ]
        );


      if (
        dynamicCaption
      ) {
        post.content =
          dynamicCaption;
      }
    }


    /* =======================================================
       FINAL RESULT LOG
       ======================================================= */

    console.log(
      "=============================================="
    );

    console.log(
      "✅ INSTAGRAM POST SUCCESSFULLY RETRIEVED"
    );


    console.log(
      "Final author:",
      post.authorHandle
    );


    console.log(
      "Final author name:",
      post.authorName
    );


    console.log(
      "Final caption:",
      post.content
        ? "AVAILABLE"
        : "NOT AVAILABLE"
    );


    console.log(
      "Final media:",
      post.mediaUrl
        ? "AVAILABLE"
        : "NOT AVAILABLE"
    );


    console.log(
      "Final media type:",
      post.mediaType
    );


    console.log(
      "Final likes:",
      post.likes
    );


    console.log(
      "Final comments:",
      post.comments
    );


    console.log(
      "Final shares:",
      post.shares
    );


    console.log(
      "Final views:",
      post.views
    );


    console.log(
      "Final post type:",
      post.postType
    );


    console.log(
      "Final publishedAt:",
      post.publishedAt
    );


    console.log(
      "=============================================="
    );


    /* =======================================================
       DON'T FAIL JUST BECAUSE CAPTION IS EMPTY
       ======================================================= */

    /*
     * An Instagram post can have:
     *
     * - caption + image
     * - image only
     * - caption + reel
     * - reel/video thumbnail
     *
     * Therefore an empty caption is NOT automatically
     * an error.
     */

    if (
      !post.content &&
      !post.mediaUrl &&
      !post.supplementalText
    ) {

      console.warn(
        "⚠️ Instagram post was retrieved, but no caption, media URL or supplemental text was returned."
      );
    }


    return post;

  } catch (error) {

    console.error(
      "=============================================="
    );


    console.error(
      "❌ INSTAGRAM APIFY RETRIEVAL FAILED"
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

      /*
       * Preserve useful error information.
       */

      throw new Error(
        `Instagram data retrieval failed: ${error.message}`
      );
    }


    throw new Error(
      "Instagram data retrieval failed."
    );
  }
}/* =========================================================
   DOWNLOAD INSTAGRAM MEDIA
   ========================================================= */

async function downloadImageAsBase64(
  mediaUrl: string
): Promise<{
  mimeType: string;
  data: string;
} | null> {
  try {
    console.log(
      "🖼️ Downloading Instagram media..."
    );

    const response =
      await fetch(mediaUrl);

    if (!response.ok) {
      console.warn(
        `⚠️ Media download failed: HTTP ${response.status}`
      );

      return null;
    }

    const arrayBuffer =
      await response.arrayBuffer();

    if (
      arrayBuffer.byteLength === 0
    ) {
      return null;
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) || "image/jpeg";

    /*
     * Gemini image input needs an image MIME type.
     */

    const mimeType =
      contentType
        .split(";")[0]
        .trim()
        .startsWith("image/")
        ? contentType
            .split(";")[0]
            .trim()
        : "image/jpeg";

    const data =
      Buffer.from(
        arrayBuffer
      ).toString(
        "base64"
      );

    console.log(
      `✅ Instagram media downloaded: ${arrayBuffer.byteLength} bytes`
    );

    return {
      mimeType,
      data,
    };

  } catch (error) {
    console.warn(
      "⚠️ Failed to download Instagram media:",
      error
    );

    return null;
  }
}


/* =========================================================
   CLEAN GEMINI JSON
   ========================================================= */

function cleanGeminiJson(
  text: string
): string {
  let cleaned =
    text.trim();

  /*
   * Gemini can occasionally return:
   *
   * ```json
   * {...}
   * ```
   */

  if (
    cleaned.startsWith(
      "```json"
    )
  ) {
    cleaned =
      cleaned.substring(
        7
      );
  }

  if (
    cleaned.startsWith(
      "```"
    )
  ) {
    cleaned =
      cleaned.substring(
        3
      );
  }

  if (
    cleaned.endsWith(
      "```"
    )
  ) {
    cleaned =
      cleaned.substring(
        0,
        cleaned.length - 3
      );
  }

  return cleaned.trim();
}


/* =========================================================
   SCORE NORMALIZER
   ========================================================= */

function clampScore(
  value: unknown,
  fallback = 0
): number {
  const number =
    typeof value === "number"
      ? value
      : Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.min(
      1,
      number
    )
  );
}


/* =========================================================
   STRING ARRAY NORMALIZER
   ========================================================= */

function safeStringArray(
  value: unknown
): string[] {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
        "string"
    )
    .map(
      (
        item
      ) =>
        item.trim()
    )
    .filter(
      Boolean
    );
}


/* =========================================================
   NORMALIZE GEMINI RESULT
   ========================================================= */

function normalizeGeminiAnalysis(
  raw: any
): GeminiAnalysis {

  const rawLabel =
    typeof raw?.sentiment
      ?.label === "string"
      ? raw.sentiment.label
          .toUpperCase()
      : "NEUTRAL";


  const allowedLabels = [
    "POSITIVE",
    "NEGATIVE",
    "NEUTRAL",
    "MIXED",
  ];


  const sentimentLabel =
    allowedLabels.includes(
      rawLabel
    )
      ? rawLabel as
          | "POSITIVE"
          | "NEGATIVE"
          | "NEUTRAL"
          | "MIXED"
      : "NEUTRAL";


  const emotions =
    Array.isArray(
      raw?.emotions
    )
      ? raw.emotions
          .map(
            (
              item: any
            ) => ({
              emotion:
                typeof item?.emotion ===
                "string"
                  ? item.emotion
                      .trim()
                  : "",

              score:
                clampScore(
                  item?.score
                ),
            })
          )
          .filter(
            (
              item: {
                emotion: string;
                score: number;
              }
            ) =>
              Boolean(
                item.emotion
              )
          )
      : [];


  return {
    sentiment: {
      label:
        sentimentLabel,

      score:
        clampScore(
          raw?.sentiment
            ?.score,
          0.5
        ),

      explanation:
        typeof raw?.sentiment
          ?.explanation ===
        "string"
          ? raw.sentiment
              .explanation
              .trim()
          : "Sentiment was determined from the available Instagram content.",
    },


    emotions,


    topics:
      safeStringArray(
        raw?.topics
      ),


    intent: {
      label:
        typeof raw?.intent
          ?.label ===
        "string"
          ? raw.intent.label
              .trim()
          : "",

      explanation:
        typeof raw?.intent
          ?.explanation ===
        "string"
          ? raw.intent.explanation
              .trim()
          : "",
    },


    summary:
      typeof raw?.summary ===
      "string"
        ? raw.summary.trim()
        : "AI analysis completed.",


    keyInsights:
      safeStringArray(
        raw?.keyInsights
      ),


    toxicity: {
      detected:
        Boolean(
          raw?.toxicity
            ?.detected
        ),

      score:
        clampScore(
          raw?.toxicity?.score
        ),

      explanation:
        typeof raw?.toxicity
          ?.explanation ===
        "string"
          ? raw.toxicity
              .explanation
              .trim()
          : "",
    },


    recommendations:
      safeStringArray(
        raw?.recommendations
      ),


    confidence:
      clampScore(
        raw?.confidence,
        0.5
      ),
  };
}


/* =========================================================
   ANALYZE INSTAGRAM CONTENT WITH GEMINI
   ========================================================= */

async function analyzeInstagramContentWithGemini(
  post: CollectedPostForAI
): Promise<GeminiAnalysis> {

  if (!gemini) {
    throw new Error(
      "Gemini AI is not configured. Add GEMINI_API_KEY to backend/.env."
    );
  }


  /* ---------------------------------------------------------
     Build text information
     --------------------------------------------------------- */

  const information: string[] =
    [];


  if (
    post.content
  ) {
    information.push(
      `Instagram caption:\n${post.content}`
    );
  }


  if (
    post.supplementalText
  ) {
    information.push(
      `Additional available text:\n${post.supplementalText}`
    );
  }


  if (
    post.authorName
  ) {
    information.push(
      `Author name: ${post.authorName}`
    );
  }


  if (
    post.authorHandle
  ) {
    information.push(
      `Author handle: ${post.authorHandle}`
    );
  }


  information.push(
    `Post type: ${post.postType}`
  );


  if (
    post.likes !== null
  ) {
    information.push(
      `Likes: ${post.likes}`
    );
  }


  if (
    post.comments !== null
  ) {
    information.push(
      `Comments: ${post.comments}`
    );
  }


  if (
    post.shares !== null
  ) {
    information.push(
      `Shares: ${post.shares}`
    );
  }


  if (
    post.views !== null
  ) {
    information.push(
      `Views: ${post.views}`
    );
  }


  /* ---------------------------------------------------------
     Download media
     --------------------------------------------------------- */

  let imageData:
    | {
        mimeType: string;
        data: string;
      }
    | null = null;


  if (
    post.mediaUrl
  ) {
    imageData =
      await downloadImageAsBase64(
        post.mediaUrl
      );
  }


  /* ---------------------------------------------------------
     Make sure there is something to analyze
     --------------------------------------------------------- */

  if (
    information.length === 0 &&
    !imageData
  ) {
    throw new Error(
      "The post was retrieved, but no analyzable text or media content was found."
    );
  }


  /* =========================================================
     GEMINI PROMPT
     ========================================================= */

  const prompt = `
You are the AI intelligence engine for SocialIntel.

Analyze this Instagram post using ALL available information.

The post may contain:
- caption
- image
- reel thumbnail
- video thumbnail
- author information
- engagement information
- supplemental text

IMPORTANT RULES:

1. If an image is provided, actually analyze the visible image.
2. If there is a caption, analyze the caption together with the image.
3. If there is no caption but an image exists, analyze the image.
4. Do not claim that the post cannot be analyzed simply because the caption is empty.
5. Do not invent text that cannot be observed.
6. Clearly distinguish observations from reasonable inference.
7. Analyze overall sentiment.
8. Identify emotions.
9. Identify major topics.
10. Identify the likely communication intent.
11. Give a useful summary.
12. Give useful social-intelligence insights.
13. Detect toxicity or harmful content.
14. Give practical recommendations.
15. All numerical scores must be between 0 and 1.
16. Return ONLY valid JSON.
17. Do not use markdown code fences.

Return EXACTLY this structure:

{
  "sentiment": {
    "label": "POSITIVE",
    "score": 0.0,
    "explanation": "..."
  },
  "emotions": [
    {
      "emotion": "...",
      "score": 0.0
    }
  ],
  "topics": [
    "..."
  ],
  "intent": {
    "label": "...",
    "explanation": "..."
  },
  "summary": "...",
  "keyInsights": [
    "..."
  ],
  "toxicity": {
    "detected": false,
    "score": 0.0,
    "explanation": "..."
  },
  "recommendations": [
    "..."
  ],
  "confidence": 0.0
}

AVAILABLE POST INFORMATION:

${
  information.length > 0
    ? information.join(
        "\n\n"
      )
    : "No text was available. Analyze the supplied Instagram media."
}
`;


  /* ---------------------------------------------------------
     Gemini content
     --------------------------------------------------------- */

  const contents: any[] =
    [
      {
        text: prompt,
      },
    ];


  /*
   * Add image/reel thumbnail when available.
   */

  if (
    imageData
  ) {
    console.log(
      "🧠 Sending Instagram media to Gemini..."
    );

    contents.push({
      inlineData: {
        mimeType:
          imageData.mimeType,

        data:
          imageData.data,
      },
    });

  } else {
    console.log(
      "🧠 No Instagram media available. Using text."
    );
  }


  /* =========================================================
     GEMINI REQUEST
     ========================================================= */

  try {

    console.log(
      "🤖 Gemini model:",
      GEMINI_MODEL
    );


    const response =
      await gemini.models.generateContent(
        {
          model:
            GEMINI_MODEL,

          contents,

          config: {
            temperature:
              0.2,

            responseMimeType:
              "application/json",
          },
        }
      );


    const responseText =
      response.text;


    if (
      !responseText ||
      !responseText.trim()
    ) {
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

    const cleaned =
      cleanGeminiJson(
        responseText
      );


    let parsed: unknown;


    try {
      parsed =
        JSON.parse(
          cleaned
        );

    } catch (error) {

      console.error(
        "❌ Gemini returned invalid JSON."
      );

      console.error(
        responseText
      );

      console.error(
        error
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }


    return normalizeGeminiAnalysis(
      parsed
    );

  } catch (error) {

    console.error(
      "=============================================="
    );

    console.error(
      "❌ Gemini Instagram analysis failed."
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

      if (
        error.message.startsWith(
          "Gemini AI analysis failed:"
        )
      ) {
        throw error;
      }


      throw new Error(
        `Gemini AI analysis failed: ${error.message}`
      );
    }


    throw new Error(
      "Gemini AI analysis failed."
    );
  }
}


/* =========================================================
   GET POST ANALYSIS
   ========================================================= */

/**
 * GET /api/post-analysis?profileId=1
 *
 * Keeps the existing dashboard-compatible
 * analytics endpoint.
 */
export async function getPostAnalysis(
  profileId: number
) {

  /* ---------------------------------------------------------
     Check monitoring profile
     --------------------------------------------------------- */

  const profile =
    await db.orm.public.MonitoringProfile.first({
      id: profileId,
    });


  if (!profile) {
    throw new Error(
      "Monitoring profile not found."
    );
  }


  /* ---------------------------------------------------------
     Get posts
     --------------------------------------------------------- */

  const posts =
    await db.orm.public.Post
      .where({
        profileId,
      })
      .all();


  /* ---------------------------------------------------------
     Totals
     --------------------------------------------------------- */

  let totalLikes = 0;

  let totalComments = 0;

  let totalShares = 0;

  let totalViews = 0;


  let positiveCount = 0;

  let negativeCount = 0;

  let neutralCount = 0;


  for (
    const post of posts
  ) {

    totalLikes +=
      Number(
        post.likes ?? 0
      );


    totalComments +=
      Number(
        post.comments ?? 0
      );


    totalShares +=
      Number(
        post.shares ?? 0
      );


    totalViews +=
      Number(
        post.views ?? 0
      );


    const sentiment =
      String(
        post.sentiment ??
          "NEUTRAL"
      ).toUpperCase();


    if (
      sentiment ===
      "POSITIVE"
    ) {

      positiveCount++;

    } else if (
      sentiment ===
      "NEGATIVE"
    ) {

      negativeCount++;

    } else {

      neutralCount++;
    }
  }


  /* ---------------------------------------------------------
     Engagement
     --------------------------------------------------------- */

  const totalPosts =
    posts.length;


  const totalEngagement =
    totalLikes +
    totalComments +
    totalShares;


  const engagementRate =
    totalViews > 0
      ? Number(
          (
            (
              totalEngagement /
              totalViews
            ) *
            100
          ).toFixed(2)
        )
      : 0;


  /* ---------------------------------------------------------
     Sentiment percentages
     --------------------------------------------------------- */

  const positivePercentage =
    totalPosts > 0
      ? Number(
          (
            (
              positiveCount /
              totalPosts
            ) *
            100
          ).toFixed(2)
        )
      : 0;


  const negativePercentage =
    totalPosts > 0
      ? Number(
          (
            (
              negativeCount /
              totalPosts
            ) *
            100
          ).toFixed(2)
        )
      : 0;


  const neutralPercentage =
    totalPosts > 0
      ? Number(
          (
            (
              neutralCount /
              totalPosts
            ) *
            100
          ).toFixed(2)
        )
      : 0;


  /* ---------------------------------------------------------
     Individual post analytics
     --------------------------------------------------------- */

  const postAnalysis =
    posts.map(
      (post) => {

        const likes =
          Number(
            post.likes ?? 0
          );


        const comments =
          Number(
            post.comments ?? 0
          );


        const shares =
          Number(
            post.shares ?? 0
          );


        const views =
          Number(
            post.views ?? 0
          );


        const engagement =
          likes +
          comments +
          shares;


        const postEngagementRate =
          views > 0
            ? Number(
                (
                  (
                    engagement /
                    views
                  ) *
                  100
                ).toFixed(2)
              )
            : 0;


        return {
          id:
            post.id,

          url:
            post.url ??
            null,

          authorName:
            post.authorName ??
            null,

          authorHandle:
            post.authorHandle ??
            null,

          content:
            post.content ??
            null,

          postType:
            post.postType ??
            "POST",

          likes,

          comments,

          shares,

          views,

          engagement,

          engagementRate:
            postEngagementRate,

          sentiment:
            post.sentiment ??
            "NEUTRAL",

          sentimentScore:
            post.sentimentScore ??
            null,

          publishedAt:
            post.publishedAt ??
            null,

          createdAt:
            post.createdAt ??
            null,
        };
      }
    );


  /* ---------------------------------------------------------
     Top posts
     --------------------------------------------------------- */

  const topPosts =
    [
      ...postAnalysis,
    ]
      .sort(
        (
          a,
          b
        ) =>
          b.engagement -
          a.engagement
      )
      .slice(
        0,
        10
      );


  /* ---------------------------------------------------------
     Dashboard response
     --------------------------------------------------------- */

  return {

    profileId,

    totalPosts,

    totals: {
      likes:
        totalLikes,

      comments:
        totalComments,

      shares:
        totalShares,

      views:
        totalViews,

      engagement:
        totalEngagement,
    },

    engagement: {
      total:
        totalEngagement,

      rate:
        engagementRate,
    },

    sentiment: {

      positive:
        positiveCount,

      negative:
        negativeCount,

      neutral:
        neutralCount,

      distribution: {

        positive:
          positivePercentage,

        negative:
          negativePercentage,

        neutral:
          neutralPercentage,
      },
    },

    posts:
      postAnalysis,

    topPosts,
  };
}


/* =========================================================
   MAIN POST ANALYSIS FUNCTION
   ========================================================= */

/**
 * Analyze a public social-media post.
 *
 * Currently:
 *
 * Instagram → Apify → Gemini
 *
 * The function is deliberately kept platform-based
 * so X, Facebook and Telegram can be added later
 * without changing the frontend API.
 */
export async function analyzePostWithAI(
  url: string
) {

  /* ---------------------------------------------------------
     Validate URL
     --------------------------------------------------------- */

  if (
    typeof url !==
      "string" ||
    !url.trim()
  ) {
    throw new Error(
      "Post URL is required."
    );
  }


  const normalizedUrl =
    url.trim();


  let parsedUrl: URL;


  try {

    parsedUrl =
      new URL(
        normalizedUrl
      );

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
      normalizedUrl
    );


  if (!platform) {
    throw new Error(
      "Unsupported platform. Currently Instagram URLs are supported."
    );
  }


  console.log(
    "=============================================="
  );


  console.log(
    "🔎 SocialIntel post analysis"
  );


  console.log(
    "Platform:",
    platform
  );


  console.log(
    "URL:",
    normalizedUrl
  );


  console.log(
    "=============================================="
  );


  /* =========================================================
     INSTAGRAM
     ========================================================= */

  if (
    platform ===
    "INSTAGRAM"
  ) {

    /*
     * 1. Fetch the public Instagram post
     *    through Apify.
     */

    const collectedPost =
      await fetchInstagramPost(
        normalizedUrl
      );


    /*
     * 2. Analyze caption + media
     *    using Gemini.
     */

    const aiAnalysis =
      await analyzeInstagramContentWithGemini(
        collectedPost
      );


    /* ---------------------------------------------------------
       Final structured response
       --------------------------------------------------------- */

    return {

      post: {

        platform:
          collectedPost.platform,

        url:
          collectedPost.url,

        accessible:
          true,

        author: {

          name:
            collectedPost.authorName,

          handle:
            collectedPost.authorHandle,
        },

        content:
          collectedPost.content,

        postType:
          collectedPost.postType,

        engagement: {

          likes:
            collectedPost.likes,

          comments:
            collectedPost.comments,

          shares:
            collectedPost.shares,

          views:
            collectedPost.views,
        },

        publishedAt:
          collectedPost.publishedAt,

        media: {

          url:
            collectedPost.mediaUrl,

          type:
            collectedPost.mediaType,
        },

        supplementalText:
          collectedPost.supplementalText,
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
          normalizedUrl,

        retrieved:
          true,

        urlContextUsed:
          false,

        provider:
          "APIFY",
      },
    };
  }


  /* =========================================================
     FUTURE PLATFORMS
     ========================================================= */

  /*
   * X / Facebook / Telegram can be implemented here later.
   *
   * We intentionally do not fake support for them.
   */

  throw new Error(
    `Unsupported platform. ${platform} analysis is not implemented yet.`
  );
}