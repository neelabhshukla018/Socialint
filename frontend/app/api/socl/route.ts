import { NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/* =========================================================
   FALLBACK KNOWLEDGE BASE (When backend server is offline)
   ========================================================= */

function getLocalKnowledgeFallback(query: string, pageContext?: string) {
  const q = query.toLowerCase();

  if (
    q.includes("crisis") ||
    q.includes("pr issue") ||
    q.includes("statement") ||
    q.includes("scandal") ||
    q.includes("backlash")
  ) {
    return {
      reply: `###  PR Crisis Containment Strategy by SOCL

When facing an emerging public relations crisis or viral backlash, follow this 4-step containment protocol:

1. **Acknowledge Quickly with a Holding Statement**:
   - Do not stay silent. Silence allows rumors to compound.
   - Example: *"We are aware of the feedback regarding [Issue] and are actively investigating. We take this seriously and will share an update shortly."*
2. **Halt Scheduled Marketing Posts**:
   - Immediately pause automated promotional campaigns and influencer posts to avoid looking tone-deaf.
3. **Track Real-time Velocity & Sentiment**:
   - Navigate to [Posts Analysis](/posts-analysis) and paste key viral post URLs to gauge audience emotions and comment toxicity.
   - Monitor [Trends & Topics](/trends) to check if hashtags are accelerating or decelerating.
4. **Deploy Root-Cause Resolution**:
   - Publish a transparent, empathetic solution once facts are established. Focus on corrective actions, not defensive rationales.

*Need me to draft a custom response statement for your specific scenario? Just describe what happened!*`,
      suggestedQuestions: [
        "Draft a holding statement for a product glitch",
        "How do I track sentiment spikes on Trends?",
        "Where can I find the Crisis Playbooks in SocialInt?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  if (
    q.includes("post analysis") ||
    q.includes("analyze post") ||
    q.includes("url") ||
    q.includes("apify") ||
    q.includes("comments")
  ) {
    return {
      reply: `###  How Posts Analysis Works in SocialInt

The **Posts Analysis** module ([Go to Posts Analysis](/posts-analysis)) provides deep-dive AI inspection for individual social media posts:

1. **Paste URL**: Enter a public URL from **Instagram**, **Facebook**, **X (Twitter)**, or **Reddit**.
2. **Comment Scraper**: SocialInt utilizes automated scrapers (such as Apify) to extract the latest public comments, likes, shares, and engagement figures.
3. **Gemini AI Intelligence**:
   - **Sentiment Polarity**: Classifies audience reaction as Positive, Negative, or Neutral with a 0.0 - 1.0 confidence score.
   - **Emotion Breakdown**: Detects Joy, Anger, Frustration, Surprise, or Concern.
   - **Toxicity Radar**: Flags harassment, spam, and inflammatory remarks.
   - **Strategic Recommendations**: Supplies actionable next steps for your brand.

*Tip: Analyze posts before and after your PR responses to verify if sentiment is improving!*`,
      suggestedQuestions: [
        "Which social platforms are supported for Post Analysis?",
        "How do I export post analysis data to PDF?",
        "How is comment toxicity calculated?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  if (
    q.includes("sentiment") ||
    q.includes("score") ||
    q.includes("polarity") ||
    q.includes("formula") ||
    q.includes("calculate")
  ) {
    return {
      reply: `###  Sentiment Calculation & Scoring in SocialInt

SocialInt uses a hybrid natural language understanding engine powered by Gemini AI and contextual lexicons:

- **Sentiment Index (0.0 to 1.0)**:
  - **0.00 – 0.40**: **Negative** (Requires attention or escalation if volume is high)
  - **0.41 – 0.59**: **Neutral** (Informational, neutral inquiries, objective mentions)
  - **0.60 – 1.00**: **Positive** (Brand advocacy, satisfaction, organic amplification)
- **Net Sentiment Score (NSS)**:
  \`\`\`
  NSS = ((Positive Mentions - Negative Mentions) / Total Mentions) * 100
  \`\`\`
  *Ranges from -100 (100% negative) to +100 (100% positive).*
- **Composite Audience Tone**: Evaluates weighted top comments, reply velocity, and emotion intensity.

You can view live sentiment distribution across your profiles on the [Dashboard](/) and [Analytics](/analytics).`,
      suggestedQuestions: [
        "What is considered an alarming negative sentiment score?",
        "How to monitor sentiment across multiple profiles?",
        "How can I set alerts when sentiment drops below 40%?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  if (
    q.includes("data source") ||
    q.includes("connect") ||
    q.includes("instagram") ||
    q.includes("facebook") ||
    q.includes("twitter") ||
    q.includes("x.com")
  ) {
    return {
      reply: `###  Connecting Data Sources in SocialInt

You can link social data channels in the [Data Sources](/data-sources) section:

1. Go to **[Data Sources](/data-sources)** from the sidebar navigation.
2. Select your active monitoring profile.
3. Click **Connect New Channel** and select the platform:
   - **Instagram**: Enter public username or hashtag feed.
   - **X / Twitter**: Add public handle, brand keywords, or tracked hashtags.
   - **Facebook**: Connect public page or community group.
   - **YouTube & Reddit**: Add channel ID or subreddit community.
4. Verify the connection status (Active / Synced).

*Once connected, SocialInt will periodically ingest public interactions to update your intelligence feed.*`,
      suggestedQuestions: [
        "How to create a new monitoring profile?",
        "Can I track competitor profiles without their credentials?",
        "How often does the data sync?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  if (
    q.includes("report") ||
    q.includes("pdf") ||
    q.includes("export") ||
    q.includes("download")
  ) {
    return {
      reply: `###  Exporting Executive Reports

SocialInt allows you to generate stakeholder-ready reports in seconds:

1. Open the **[Reports](/reports)** page.
2. Choose your report type:
   - **Executive Briefing**: High-level summary of sentiment, crises, and top topics.
   - **Full PR Intelligence Report**: Includes charts, emotion distribution, and post logs.
   - **Post Analysis PDF**: Generates a clean audit sheet for an individual analyzed post.
3. Select date range (Last 24 Hours, 7 Days, 30 Days).
4. Click **Generate PDF** or **Export CSV** to download immediately.

*All PDF reports are formatted with executive branding, key takeaways, and action items.*`,
      suggestedQuestions: [
        "Can I share reports directly via email?",
        "Where do I customize the workspace name on reports?",
        "How do I print the Dashboard directly?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  if (
    q.includes("profile") ||
    q.includes("brand") ||
    q.includes("campaign") ||
    q.includes("person")
  ) {
    return {
      reply: `###  Monitoring Profiles in SocialInt

Profiles help you compartmentalize tracking for different entities:

- **PERSON**: Tailored for CEOs, public figures, executives, and politicians. Emphasizes personal reputation, direct mentions, and sentiment trajectory.
- **BRAND**: Designed for corporate identities, consumer brands, and products. Focuses on customer service sentiment, product reviews, and brand health.
- **CAMPAIGN**: Set up for time-bounded initiatives, product launches, PR stunts, and crisis response operations.

To create or switch profiles, head over to **[Monitoring Profiles](/create-profile)** or click your active profile pill in the top header.`,
      suggestedQuestions: [
        "How many profiles can I create?",
        "How to switch between active profiles?",
        "Can I merge profile data?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  if (
    q.includes("help") ||
    q.includes("contact") ||
    q.includes("support") ||
    q.includes("email")
  ) {
    return {
      reply: `###  SocialInt Support & Help Center

We are here to assist you at every step!

- **Documentation & Playbooks**: Visit our [Help & Contact Us](/help) page to view architecture guides, PR playbooks, and step-by-step walkthroughs.
- **Direct Support Email**: You can reach our engineering & PR support team directly at **supportsocialint@gmail.com**.
- **Interactive Chat**: You can always ask me (**SOCL**) right here for guidance, troubleshooting tips, or feature explanations!

*How else can I assist you right now?*`,
      suggestedQuestions: [
        "Where do I change notification settings?",
        "How does the PR Command Center 3D work?",
        "Can you give me a tour of SocialInt?",
      ],
      pageContext,
      source: "knowledge_fallback",
    };
  }

  return {
    reply: `###  Hello! I am SOCL, your SocialInt Intelligence Copilot.

I am here to help you get the most out of SocialInt. Here are a few things I can assist you with:

- **PR Crisis Management**: Formulate holding statements, containment strategies, and assess backlash severity.
- **Sentiment & Metric Interpretation**: Explain sentiment polarity, net sentiment scores (NSS), and viral velocity.
- **Posts Analysis Guidance**: Walk you through analyzing any Instagram, Facebook, X, or Reddit URL with Gemini AI.
- **Platform Navigation**: Quick links and tips for [Dashboard](/), [Analytics](/analytics), [Trends](/trends), [Reports](/reports), and [Data Sources](/data-sources).
- **Troubleshooting**: Assist with data source connections, scraping workflows, and export issues.

*What would you like to explore today?*`,
    suggestedQuestions: [
      "How do I analyze a social media post?",
      "How do I respond to a PR crisis?",
      "Explain the sentiment score formula",
      "Where can I generate executive PDF reports?",
    ],
    pageContext,
    source: "knowledge_fallback",
  };
}

/* =========================================================
   POST /api/socl
   ========================================================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, pageContext } = body || {};

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, message: "Message is required." },
        { status: 400 }
      );
    }

    // Attempt to call backend Express server first
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/socl/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, pageContext }),
        cache: "no-store",
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend server is not reachable, gracefully fallback to local intelligent knowledge
    }

    // Local fallback response
    const fallbackResponse = getLocalKnowledgeFallback(message, pageContext);
    return NextResponse.json({
      success: true,
      data: fallbackResponse,
    });
  } catch (error: any) {
    console.error("SOCL Next.js route error:", error);
    return NextResponse.json(
      {
        success: true,
        data: getLocalKnowledgeFallback("help"),
      },
      { status: 200 }
    );
  }
}

/* =========================================================
   GET /api/socl
   ========================================================= */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageContext = searchParams.get("pageContext") || "";

  // Attempt backend
  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/socl/suggestions?pageContext=${encodeURIComponent(pageContext)}`,
      { cache: "no-store" }
    );
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback
  }

  const p = pageContext.toLowerCase();
  let suggestions = [
    "How do I monitor a PR crisis in real time?",
    "Explain how the sentiment score is calculated",
    "How do I analyze a post with Gemini AI?",
    "Where can I download executive PDF reports?",
  ];

  if (p.includes("posts-analysis")) {
    suggestions = [
      "How do I analyze an Instagram reel or post?",
      "What does the toxicity score mean?",
      "How does Apify fetch post comments?",
      "How do I interpret the emotion breakdown?",
    ];
  } else if (p.includes("trends")) {
    suggestions = [
      "What is viral topic velocity?",
      "How do I set alerts for negative trends?",
      "What should I do if a topic spikes 200%?",
      "How does SocialInt categorize emerging trends?",
    ];
  } else if (p.includes("analytics")) {
    suggestions = [
      "How is the Net Sentiment Score (NSS) calculated?",
      "Which platform has my highest engagement?",
      "How to track sentiment shifts week-over-week?",
      "How do I compare Brand vs Competitor metrics?",
    ];
  }

  return NextResponse.json({
    success: true,
    data: {
      suggestions,
      pageContext,
    },
  });
}
