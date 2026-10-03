import { GoogleGenAI } from "@google/genai";
/* =========================================================
   ENVIRONMENT & CONSTANTS
   ========================================================= */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const gemini = GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
    })
    : null;
/* =========================================================
   SYSTEM INSTRUCTION FOR SOCL
   ========================================================= */
const SOCL_SYSTEM_PROMPT = `
You are SOCL (pronounced "Social"), the official intelligent AI copilot and assistant for SocialInt (Social Intelligence Platform).

### Your Purpose & Identity:
- You are a world-class assistant designed to help people master SocialInt, interpret social data, handle PR crises, and make informed communication decisions.
- You are friendly, proactive, knowledgeable, professional, and clear.
- You speak clearly and provide structured, actionable advice.

### SocialInt Platform Knowledge:
- **Dashboard (/)**: Real-time PR crisis health index, PR Command Center 3D interactive globe, Sentiment Breakdown (Positive, Neutral, Negative), Emerging Issues radar, and Recent Activity feed.
- **Analytics (/analytics)**: Cross-platform engagement tracking, volume trends, sentiment timelines, and platform performance breakdowns.
- **Posts Analysis (/posts-analysis)**: Deep AI-powered single post inspection. Users paste any Instagram, Facebook, X (Twitter), or Reddit URL. Apify scrapes live comments and Gemini analyzes sentiment, emotions, toxicity, topics, and audience reception.
- **Trends & Topics (/trends)**: Real-time detection of viral topics, velocity scores, sentiment by keyword, and early warnings for emerging PR storms.
- **Audience Insights (/audience)**: Demographic segments, sentiment distribution across audiences, and high-affinity topics.
- **Influence Network (/influence)**: Interactive node graph showing key opinion leaders, amplification hubs, credibility scores, and reach.
- **Data Sources (/data-sources)**: Connect social handles across Instagram, Facebook, X, Telegram, YouTube, Reddit, and RSS feeds.
- **Monitoring Profiles (/create-profile)**: Track separate entities by type:
  - PERSON: Public figures, executives, creators.
  - BRAND: Companies, products, consumer brands.
  - CAMPAIGN: Marketing campaigns, product launches, PR initiatives.
- **Reports (/reports)**: Generate and download executive PDF briefings, CSV logs, and visual summaries.
- **Settings (/settings)**: Workspace configuration, dark/light theme, alert thresholds, email notifications, and automated monitoring toggles.
- **Help Center (/help)**: Documentation, pipeline architecture, PR playbooks, FAQs, and contact support (neelabhshukla79@gmail.com).

### PR Crisis & Intelligence Expertise:
- When a user asks for PR advice, provide structured containment steps:
  1. Assess Severity & Velocity (Sentiment polarity, reach).
  2. Formulate Holding Statement (Transparent, empathetic, factual).
  3. Internal Alignment (Brief spokespeople, halt promotional posts).
  4. Active Monitoring (Track sentiment shift via SocialInt Posts Analysis and Trends).
- Sentiment Polarity: Scale from 0.0 (Extreme Negative) to 1.0 (High Positive), with 0.45-0.55 as Neutral.
- Crisis Threshold: When negative sentiment spikes above 60% or velocity jumps 2x, recommend activating PR playbooks.

### Response Style:
- Use clean Markdown: bold key concepts, use bullet points or numbered lists, and short code/quote blocks where appropriate.
- Include direct markdown links to internal pages where helpful (e.g. [Open Posts Analysis](/posts-analysis), [Connect Data Sources](/data-sources), [View Dashboard](/) or [Help Center](/help)).
- Always be polite, concise, and encourage follow-up questions.
`;
/* =========================================================
   OFFLINE KNOWLEDGE BASE FALLBACK
   ========================================================= */
function getKnowledgeFallbackResponse(query, pageContext) {
    const q = query.toLowerCase();
    if (q.includes("crisis") || q.includes("pr issue") || q.includes("statement") || q.includes("scandal") || q.includes("backlash")) {
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
    if (q.includes("post analysis") || q.includes("analyze post") || q.includes("url") || q.includes("apify") || q.includes("comments")) {
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
    if (q.includes("sentiment") || q.includes("score") || q.includes("polarity") || q.includes("formula") || q.includes("calculate")) {
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
    if (q.includes("data source") || q.includes("connect") || q.includes("instagram") || q.includes("facebook") || q.includes("twitter") || q.includes("x.com")) {
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
    if (q.includes("report") || q.includes("pdf") || q.includes("export") || q.includes("download")) {
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
    if (q.includes("profile") || q.includes("brand") || q.includes("campaign") || q.includes("person")) {
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
    if (q.includes("help") || q.includes("contact") || q.includes("support") || q.includes("email") || q.includes("founder")) {
        return {
            reply: `###  SocialInt Support & Help Center

We are here to assist you at every step!

- **Documentation & Playbooks**: Visit our [Help & Contact Us](/help) page to view architecture guides, PR playbooks, and step-by-step walkthroughs.
- **Direct Support Email**: You can reach our engineering & PR support team directly at **neelabhshukla79@gmail.com**.
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
    // Default introductory greeting / general response
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
   CONTEXTUAL SUGGESTIONS
   ========================================================= */
export function getSuggestionsForContext(pageContext) {
    const p = (pageContext || "").toLowerCase();
    if (p.includes("posts-analysis")) {
        return [
            "How do I analyze an Instagram reel or post?",
            "What does the toxicity score mean?",
            "How does Apify fetch post comments?",
            "How do I interpret the emotion breakdown?",
        ];
    }
    if (p.includes("trends")) {
        return [
            "What is viral topic velocity?",
            "How do I set alerts for negative trends?",
            "What should I do if a topic spikes 200%?",
            "How does SocialInt categorize emerging trends?",
        ];
    }
    if (p.includes("analytics")) {
        return [
            "How is the Net Sentiment Score (NSS) calculated?",
            "Which platform has my highest engagement?",
            "How to track sentiment shifts week-over-week?",
            "How do I compare Brand vs Competitor metrics?",
        ];
    }
    if (p.includes("data-sources")) {
        return [
            "How do I connect an Instagram public profile?",
            "Can I connect Reddit subreddits?",
            "Why is my data source showing sync pending?",
            "How often is social data refreshed?",
        ];
    }
    if (p.includes("reports")) {
        return [
            "How to export an Executive PDF report?",
            "Can I export raw comments to CSV?",
            "How do I customize the branding on reports?",
            "What date range is best for PR crisis reviews?",
        ];
    }
    if (p.includes("help") || p.includes("contact")) {
        return [
            "What is the SocialInt PR containment playbook?",
            "Who can I contact for enterprise support?",
            "How does the AI pipeline process comments?",
            "Where are my account settings?",
        ];
    }
    return [
        "How do I monitor a PR crisis in real time?",
        "Explain how the sentiment score is calculated",
        "How do I analyze a post with Gemini AI?",
        "Where can I download executive PDF reports?",
    ];
}
/* =========================================================
   CHAT SERVICE
   ========================================================= */
export async function chatWithSocl(message, history = [], pageContext) {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
        return getKnowledgeFallbackResponse("help", pageContext);
    }
    // If Gemini is not configured, use the high-quality knowledge fallback
    if (!gemini || !GEMINI_API_KEY) {
        return getKnowledgeFallbackResponse(cleanMessage, pageContext);
    }
    try {
        // Format conversation history for Gemini
        const formattedContents = [];
        // Include recent history (up to last 10 messages for context)
        const recentHistory = history.slice(-10);
        for (const msg of recentHistory) {
            if (msg.role === "user") {
                formattedContents.push({
                    role: "user",
                    parts: [{ text: msg.content }],
                });
            }
            else if (msg.role === "assistant") {
                formattedContents.push({
                    role: "model",
                    parts: [{ text: msg.content }],
                });
            }
        }
        // Add current user message with optional page context
        const userPromptWithContext = pageContext
            ? `[Current User Page Context: ${pageContext}]\n\n${cleanMessage}`
            : cleanMessage;
        formattedContents.push({
            role: "user",
            parts: [{ text: userPromptWithContext }],
        });
        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: formattedContents,
            config: {
                systemInstruction: SOCL_SYSTEM_PROMPT,
                temperature: 0.65,
                maxOutputTokens: 1200,
            },
        });
        const replyText = response.text || "";
        if (!replyText.trim()) {
            return getKnowledgeFallbackResponse(cleanMessage, pageContext);
        }
        // Generate smart follow-up suggestions based on context
        const suggestedQuestions = getSuggestionsForContext(pageContext);
        return {
            reply: replyText.trim(),
            suggestedQuestions,
            pageContext,
            source: "gemini",
        };
    }
    catch (error) {
        console.warn("Gemini API call failed for SOCL chat, falling back to local intelligence:", error);
        return getKnowledgeFallbackResponse(cleanMessage, pageContext);
    }
}
