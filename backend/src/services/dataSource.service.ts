import { ApifyClient } from "apify-client";

import { db } from "../prisma/db.js";
import { analyzePostWithAI } from "./postAnalysis.service.js";


/* =========================================================
   ENVIRONMENT
   ========================================================= */

const APIFY_API_TOKEN =
  process.env.APIFY_API_TOKEN;

const INSTAGRAM_SCRAPER_ACTOR =
  "apify/instagram-scraper";


/* =========================================================
   INPUT TYPES
   ========================================================= */

interface CreateDataSourceInput {
  profileId: number;
  platform: string;
  username?: string;
  profileUrl?: string;
  externalId?: string;
}

interface UpdateDataSourceInput {
  status?: string;
  username?: string;
  profileUrl?: string;
  externalId?: string;
}


/* =========================================================
   APIFY TYPES
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

  [key: string]: unknown;
}


/* =========================================================
   APIFY CLIENT
   ========================================================= */

const apify = APIFY_API_TOKEN
  ? new ApifyClient({
      token: APIFY_API_TOKEN,
    })
  : null;


/* =========================================================
   GET DATA SOURCES
   ========================================================= */

export async function getDataSources(
  profileId: number
) {
  return db.orm.public.DataSource
    .where({
      profileId,
    })
    .all();
}


/* =========================================================
   GET ONE DATA SOURCE
   ========================================================= */

export async function getDataSourceById(
  id: number
) {
  return db.orm.public.DataSource.first({
    id,
  });
}


/* =========================================================
   CONNECT DATA SOURCE
   ========================================================= */
export async function connectDataSource(
  profileId: number,
  platform: string,
  username?: string | null,
  profileUrl?: string | null,
  externalId?: string | null
) {
  try {
    /* =========================================================
       VALIDATE INPUT
       ========================================================= */

    if (!profileId) {
      throw new Error("Profile ID is required.");
    }

    if (!platform) {
      throw new Error("Platform is required.");
    }

    const normalizedPlatform =
      platform.toUpperCase();

    /* =========================================================
       CHECK IF DATA SOURCE ALREADY EXISTS
       ========================================================= */

    const existingSources =
      await db.orm.public.DataSource
        .where({
          profileId,
          platform: normalizedPlatform,
        })
        .all();

    const existing =
      existingSources.length > 0
        ? existingSources[0]
        : null;

    /* =========================================================
       CREATE OR UPDATE DATA SOURCE
       ========================================================= */

    let dataSourceId: number;

    if (existing) {
      /*
       * The record already exists.
       * Update it, but keep using existing.id because
       * update() should not be relied upon to return the
       * complete DataSource object.
       */

      await db.orm.public.DataSource
        .where({
          id: existing.id,
        })
        .update({
          status: "CONNECTED",

          username:
            username ??
            existing.username,

          profileUrl:
            profileUrl ??
            existing.profileUrl,

          externalId:
            externalId ??
            existing.externalId,

          lastSyncedAt:
            new Date(),
        });

      dataSourceId = existing.id;
    } else {
      /*
       * Create a new data source.
       */

      const created =
        await db.orm.public.DataSource.create({
          profileId,

          platform:
            normalizedPlatform,

          status:
            "CONNECTED",

          username:
            username ??
            null,

          profileUrl:
            profileUrl ??
            null,

          externalId:
            externalId ??
            null,

          lastSyncedAt:
            new Date(),
        });

      dataSourceId = created.id;
    }

    /* =========================================================
       INITIAL INSTAGRAM SYNC
       ========================================================= */

    if (
      normalizedPlatform ===
      "INSTAGRAM"
    ) {
      try {
        await syncInstagramDataSource(
          profileId,
          dataSourceId,
          profileUrl!,
        );
      } catch (error) {
        console.error(
          "Instagram initial sync failed:",
          error
        );

        /*
         * Keep the connection itself,
         * but mark synchronization as failed
         * so the frontend knows what happened.
         */

        await db.orm.public.DataSource
          .where({
            id: dataSourceId,
          })
          .update({
            status: "ERROR",
          });

        throw error;
      }
    }

    /* =========================================================
       RETURN DATA SOURCE
       ========================================================= */

    return getDataSourceById(
      dataSourceId
    );

  } catch (error) {
    console.error(
      "========== DATA SOURCE CONNECTION ERROR =========="
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
      "=================================================="
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to connect data source."
    );
  }
}


/* =========================================================
   INSTAGRAM PROFILE VALIDATION
   ========================================================= */

function validateInstagramProfileUrl(
  profileUrl: string
) {
  let parsedUrl: URL;

  try {
    parsedUrl =
      new URL(
        profileUrl.trim()
      );
  } catch {
    throw new Error(
      "Invalid Instagram profile URL."
    );
  }


  const hostname =
    parsedUrl.hostname
      .toLowerCase()
      .replace(
        /^www\./,
        ""
      );


  if (
    hostname !==
      "instagram.com" &&
    hostname !==
      "instagr.am"
  ) {
    throw new Error(
      "Invalid Instagram profile URL."
    );
  }


  const pathname =
    parsedUrl.pathname
      .replace(
        /^\/+/,
        ""
      )
      .replace(
        /\/+$/,
        ""
      );


  if (!pathname) {
    throw new Error(
      "Invalid Instagram profile URL."
    );
  }


  /*
   * Do not allow post/reel URLs
   * in the monitoring profile field.
   */

  if (
    pathname.startsWith("p/") ||
    pathname.startsWith("reel/") ||
    pathname.startsWith("reels/")
  ) {
    throw new Error(
      "Please provide an Instagram profile URL, not a post or reel URL."
    );
  }
}


/* =========================================================
   NORMALIZE INSTAGRAM PROFILE URL
   ========================================================= */

function normalizeInstagramProfileUrl(
  profileUrl: string
) {
  const parsedUrl =
    new URL(
      profileUrl.trim()
    );

  const pathname =
    parsedUrl.pathname
      .replace(
        /^\/+/,
        ""
      )
      .replace(
        /\/+$/,
        ""
      );

  return (
    `https://www.instagram.com/${pathname}/`
  );
}


/* =========================================================
   EXTRACT USERNAME
   ========================================================= */

function extractInstagramUsername(
  profileUrl: string
) {
  try {
    const parsedUrl =
      new URL(
        profileUrl
      );

    const username =
      parsedUrl.pathname
        .replace(
          /^\/+/,
          ""
        )
        .replace(
          /\/+$/,
          ""
        )
        .split("/")[0];

    return username || null;
  } catch {
    return null;
  }
}


/* =========================================================
   SYNC INSTAGRAM DATA SOURCE
   ========================================================= */

export async function syncInstagramDataSource(
  profileId: number,
  sourceId: number,
  profileUrl: string
) {
  if (!apify) {
    throw new Error(
      "APIFY_API_TOKEN is not configured."
    );
  }


  const cleanProfileUrl =
    normalizeInstagramProfileUrl(
      profileUrl
    );


  console.log(
    "=============================================="
  );

  console.log(
    "📸 SocialIntel Instagram monitoring sync"
  );

  console.log(
    "Profile:",
    cleanProfileUrl
  );

  console.log(
    "Profile ID:",
    profileId
  );

  console.log(
    "Data source ID:",
    sourceId
  );

  console.log(
    "🚀 Starting Apify Instagram scraper..."
  );

  console.log(
    "=============================================="
  );


  try {

    /* =======================================================
       RUN APIFY
       ======================================================= */

    const run =
      await apify
        .actor(
          INSTAGRAM_SCRAPER_ACTOR
        )
        .call({
          directUrls: [
            cleanProfileUrl,
          ],

          resultsType:
            "posts",

          /*
           * Keep the initial monitoring
           * run reasonably small.
           *
           * We can increase this later
           * for production monitoring.
           */
          resultsLimit: 10,
        });


    console.log(
      "✅ Instagram monitoring Apify run completed."
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
       GET DATASET
       ======================================================= */

    const dataset =
      await apify
        .dataset(
          run.defaultDatasetId
        )
        .listItems();


    const items =
      dataset.items as ApifyInstagramPost[];


    if (
      !items ||
      items.length === 0
    ) {
      throw new Error(
        "Instagram profile returned no posts."
      );
    }


    console.log(
      `📦 Apify returned ${items.length} Instagram post(s).`
    );


    /* =======================================================
       SAVE POSTS
       ======================================================= */

    let savedCount = 0;


    for (
      const rawPost of items
    ) {

      try {

        const postUrl =
          getInstagramPostUrl(
            rawPost
          );


        if (!postUrl) {
          console.warn(
            "⚠️ Skipping Instagram item without URL."
          );

          continue;
        }


        const externalId =
          rawPost.id !== undefined &&
          rawPost.id !== null
            ? String(rawPost.id)
            : rawPost.shortCode ??
              postUrl;


        const authorName =
          cleanString(
            rawPost.ownerFullName
          );


        const authorHandle =
          cleanString(
            rawPost.ownerUsername
          );


        const content =
          cleanString(
            rawPost.caption
          );


        const likes =
          safeNumber(
            rawPost.likesCount
          );


        const comments =
          safeNumber(
            rawPost.commentsCount
          );


        const shares =
          safeNumber(
            rawPost.sharesCount
          );


        const views =
          safeNumber(
            rawPost.videoViewCount ??
            rawPost.videoPlayCount ??
            rawPost.plays
          );


        const publishedAt =
          rawPost.timestamp
            ? new Date(
                rawPost.timestamp
              )
            : null;


        console.log(
          "----------------------------------------------"
        );

        console.log(
          "Instagram post:",
          postUrl
        );

        console.log(
          "Author:",
          authorHandle
        );

        console.log(
          "Likes:",
          likes
        );

        console.log(
          "Comments:",
          comments
        );


        /* ===================================================
           CHECK EXISTING POST
           =================================================== */

        const existingPost =
          await db.orm.public.Post.first({
            profileId,

            externalId,
          });


        /* ===================================================
           AI ANALYSIS
           =================================================== */

        let sentiment =
          "NEUTRAL";

        let sentimentScore:
          | number
          | null =
          null;


        /*
         * Gemini needs content.
         *
         * If there is no caption,
         * we still store the post.
         *
         * AI analysis can be added
         * later when media analysis
         * is available for monitoring.
         */

        if (
          content &&
          content.trim()
        ) {

          try {

            const aiResult =
              await analyzePostWithAI(
                postUrl
              );


            const aiSentiment =
              aiResult
                ?.aiAnalysis
                ?.sentiment
                ?.label;


            if (
              aiSentiment ===
                "POSITIVE" ||
              aiSentiment ===
                "NEGATIVE" ||
              aiSentiment ===
                "NEUTRAL"
            ) {
              sentiment =
                aiSentiment;
            }


            const score =
              aiResult
                ?.aiAnalysis
                ?.sentiment
                ?.score;


            if (
              typeof score ===
                "number" &&
              Number.isFinite(score)
            ) {
              sentimentScore =
                Math.max(
                  0,
                  Math.min(
                    1,
                    score
                  )
                );
            }

          } catch (aiError) {

            /*
             * AI failure should NOT
             * destroy real social data.
             */

            console.warn(
              "⚠️ Gemini analysis failed for post:",
              postUrl
            );

            console.warn(
              aiError
            );
          }
        }


        /* ===================================================
           UPDATE EXISTING POST
           =================================================== */

        if (existingPost) {

          await db.orm.public.Post
            .where({
              id: existingPost.id,
            })
            .update({

              sourceId,

              authorName,

              authorHandle,

              content,

              url:
                postUrl,

              likes,

              comments,

              shares,

              views,

              sentiment,

              sentimentScore,

              publishedAt,
            });

        }


        /* ===================================================
           CREATE NEW POST
           =================================================== */

        else {

          await db.orm.public.Post.create({

            profileId,

            sourceId,

            externalId,

            authorName,

            authorHandle,

            content,

            url:
              postUrl,

            postType:
              getPostType(
                rawPost
              ),

            likes,

            comments,

            shares,

            views,

            sentiment,

            sentimentScore,

            publishedAt,
          });
        }


        savedCount++;

        console.log(
          "✅ Instagram post saved."
        );

      } catch (postError) {

        console.error(
          "❌ Failed to save Instagram post:",
          postError
        );

        /*
         * Continue with the
         * remaining posts.
         */

        continue;
      }
    }


    /* =======================================================
       UPDATE DATA SOURCE
       ======================================================= */

    await db.orm.public.DataSource
      .where({
        id: sourceId,
      })
      .update({

        status:
          "CONNECTED",

        lastSyncedAt:
          new Date(),

        username:
          extractInstagramUsername(
            cleanProfileUrl
          ),

        profileUrl:
          cleanProfileUrl,
      });


    console.log(
      "=============================================="
    );

    console.log(
      `✅ Instagram sync finished. Saved ${savedCount}/${items.length} post(s).`
    );

    console.log(
      "=============================================="
    );


    return {
      profileId,

      sourceId,

      profileUrl:
        cleanProfileUrl,

      fetched:
        items.length,

      saved:
        savedCount,
    };

  } catch (error) {

    console.error(
      "=============================================="
    );

    console.error(
      "❌ Instagram monitoring sync failed."
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
        `Instagram monitoring sync failed: ${error.message}`
      );
    }

    throw new Error(
      "Instagram monitoring sync failed."
    );
  }
}


/* =========================================================
   GET INSTAGRAM POST URL
   ========================================================= */

function getInstagramPostUrl(
  post: ApifyInstagramPost
) {
  if (
    typeof post.url ===
      "string" &&
    post.url.trim()
  ) {
    return cleanPostUrl(
      post.url
    );
  }


  if (
    typeof post.shortCode ===
      "string" &&
    post.shortCode.trim()
  ) {
    return (
      `https://www.instagram.com/p/${post.shortCode}/`
    );
  }


  return null;
}


/* =========================================================
   CLEAN POST URL
   ========================================================= */

function cleanPostUrl(
  url: string
) {
  try {

    const parsedUrl =
      new URL(
        url.trim()
      );


    const pathname =
      parsedUrl.pathname;


    return (
      `https://www.instagram.com${pathname}`
    );

  } catch {

    return url.trim();

  }
}


/* =========================================================
   CLEAN STRING
   ========================================================= */

function cleanString(
  value: unknown
): string | null {

  if (
    typeof value !==
      "string"
  ) {
    return null;
  }


  const cleaned =
    value.trim();


  return cleaned
    ? cleaned
    : null;
}


/* =========================================================
   SAFE NUMBER
   ========================================================= */

function safeNumber(
  value: unknown
): number {

  if (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  ) {
    return Math.max(
      0,
      Math.round(value)
    );
  }


  const parsed =
    Number(value);


  if (
    Number.isFinite(parsed)
  ) {
    return Math.max(
      0,
      Math.round(parsed)
    );
  }


  return 0;
}


/* =========================================================
   POST TYPE
   ========================================================= */

function getPostType(
  post: ApifyInstagramPost
) {

  const type =
    String(
      post.type ??
      post.productType ??
      ""
    ).toLowerCase();


  if (
    type.includes("video") ||
    type.includes("reel")
  ) {
    return "VIDEO";
  }


  return "POST";
}


/* =========================================================
   UPDATE DATA SOURCE
   ========================================================= */

export async function updateDataSource(
  id: number,
  input: UpdateDataSourceInput
) {

  const existing =
    await getDataSourceById(
      id
    );


  if (!existing) {
    throw new Error(
      "Data source not found."
    );
  }


  return db.orm.public.DataSource
    .where({
      id,
    })
    .update({

      ...(input.status !==
        undefined
        ? {
            status:
              input.status,
          }
        : {}),

      ...(input.username !==
        undefined
        ? {
            username:
              input.username,
          }
        : {}),

      ...(input.profileUrl !==
        undefined
        ? {
            profileUrl:
              input.profileUrl,
          }
        : {}),

      ...(input.externalId !==
        undefined
        ? {
            externalId:
              input.externalId,
          }
        : {}),

      ...(input.status ===
        "CONNECTED"
        ? {
            lastSyncedAt:
              new Date(),
          }
        : {}),
    });
}


/* =========================================================
   DISCONNECT DATA SOURCE
   ========================================================= */

export async function disconnectDataSource(
  id: number
) {

  const existing =
    await getDataSourceById(
      id
    );


  if (!existing) {
    throw new Error(
      "Data source not found."
    );
  }


  return db.orm.public.DataSource
    .where({
      id,
    })
    .update({
      status:
        "DISCONNECTED",
    });
}


/* =========================================================
   DELETE DATA SOURCE
   ========================================================= */

export async function deleteDataSource(
  id: number
) {

  const existing =
    await getDataSourceById(
      id
    );


  if (!existing) {
    throw new Error(
      "Data source not found."
    );
  }


  return db.orm.public.DataSource
    .where({
      id,
    })
    .delete();
}