import { db } from "../prisma/db.js";

export interface CollectedPost {
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

  source: "PUBLIC_URL" | "DATABASE";
}


/* =========================================================
   PLATFORM DETECTION
   ========================================================= */

export function detectSocialPlatform(
  url: string
): string | null {
  try {
    const hostname =
      new URL(url)
        .hostname
        .toLowerCase()
        .replace(/^www\./, "");

    if (
      hostname === "instagram.com" ||
      hostname === "instagr.am"
    ) {
      return "INSTAGRAM";
    }

    if (
      hostname === "x.com" ||
      hostname === "twitter.com" ||
      hostname === "mobile.twitter.com"
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
   DATABASE FALLBACK
   ========================================================= */

async function findPostInDatabase(
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
   HTML META EXTRACTION
   ========================================================= */

function extractMeta(
  html: string,
  property: string
): string | null {
  const escaped =
    property.replace(
      /[-/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    );

  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),

    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${escaped}["']`,
      "i"
    ),

    new RegExp(
      `<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),

    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${escaped}["']`,
      "i"
    ),
  ];

  for (
    const pattern of patterns
  ) {
    const match =
      html.match(pattern);

    if (match?.[1]) {
      return match[1]
        .replace(
          /&amp;/g,
          "&"
        )
        .replace(
          /&quot;/g,
          '"'
        )
        .replace(
          /&#39;/g,
          "'"
        )
        .trim();
    }
  }

  return null;
}


/* =========================================================
   FETCH PUBLIC PAGE
   ========================================================= */

async function fetchPublicPage(
  url: string
) {
  const response =
    await fetch(url, {
      method: "GET",

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",

        Accept:
          "text/html,application/xhtml+xml",
      },

      redirect: "follow",

      signal:
        AbortSignal.timeout(
          15000
        ),
    });

  if (!response.ok) {
    throw new Error(
      `Platform returned HTTP ${response.status}.`
    );
  }

  const html =
    await response.text();

  if (!html.trim()) {
    throw new Error(
      "Platform returned an empty page."
    );
  }

  return html;
}


/* =========================================================
   COLLECT POST FROM PUBLIC URL
   ========================================================= */

export async function collectPostFromUrl(
  url: string
): Promise<CollectedPost> {
  const platform =
    detectSocialPlatform(url);

  if (!platform) {
    throw new Error(
      "Unsupported social media platform."
    );
  }


  /* =======================================================
     FIRST: DATABASE FALLBACK
     ======================================================= */

  const existing =
    await findPostInDatabase(url);

  if (existing) {
    return {
      platform,

      url,

      authorName:
        existing.authorName,

      authorHandle:
        existing.authorHandle,

      content:
        existing.content,

      postType:
        existing.postType,

      likes:
        existing.likes,

      comments:
        existing.comments,

      shares:
        existing.shares,

      views:
        existing.views,

      publishedAt:
        existing.publishedAt
          ? new Date(
              existing.publishedAt
            ).toISOString()
          : null,

      source:
        "DATABASE",
    };
  }


  /* =======================================================
     SECOND: PUBLIC PAGE
     ======================================================= */

  let html: string;

  try {
    html =
      await fetchPublicPage(url);
  } catch (error) {
    console.error(
      `Failed to fetch ${platform} URL:`,
      error
    );

    throw new Error(
      `${platform} post could not be retrieved. The platform may require authentication or block public access.`
    );
  }


  /* =======================================================
     OPEN GRAPH DATA
     ======================================================= */

  const title =
    extractMeta(
      html,
      "og:title"
    );

  const description =
    extractMeta(
      html,
      "og:description"
    );

  const author =
    extractMeta(
      html,
      "author"
    );

  const image =
    extractMeta(
      html,
      "og:image"
    );


  /* =======================================================
     CONTENT
     ======================================================= */

  const content =
    description ??
    title ??
    null;


  /* =======================================================
     POST TYPE
     ======================================================= */

  let postType =
    "POST";

  if (image) {
    postType =
      "IMAGE";
  }


  /* =======================================================
     RETURN
     ======================================================= */

  return {
    platform,

    url,

    authorName:
      author,

    authorHandle:
      null,

    content,

    postType,

    likes: null,

    comments: null,

    shares: null,

    views: null,

    publishedAt: null,

    source:
      "PUBLIC_URL",
  };
}