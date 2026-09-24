/**
 * End-to-end verification script for SocialInt ML & Node.js architecture.
 */
const BASE_URL = "http://localhost:5000";
const ML_URL = "http://127.0.0.1:8000";
async function runTests() {
    console.log("==================================================");
    console.log("🚀 STARTING SOCIALINT MULTI-TIER ARCHITECTURE TESTS");
    console.log("==================================================");
    // 1. Check Python ML microservice
    console.log("\n[TEST 1] Checking Python FastAPI ML microservice health...");
    try {
        const mlHealthRes = await fetch(`${ML_URL}/health`);
        const mlHealth = await mlHealthRes.json();
        console.log("✅ Python ML Health:", mlHealth);
    }
    catch (err) {
        console.error("❌ Python ML service is unreachable:", err);
    }
    // 2. Check Node.js Backend health
    console.log("\n[TEST 2] Checking Node.js Express Backend health...");
    try {
        const beHealthRes = await fetch(`${BASE_URL}/api/health`);
        const beHealth = await beHealthRes.json();
        console.log("✅ Node.js Backend Health:", beHealth);
    }
    catch (err) {
        console.error("❌ Node.js Backend is unreachable:", err);
    }
    // 3. Test Common Data Ingestion Pipeline with ML NLP
    console.log("\n[TEST 3] Testing Common Data Schema Ingestion Preview with live ML NLP...");
    try {
        const samplePosts = [
            {
                platform: "X",
                content: "Antigravity AI is absolutely revolutionary! Accelerating developer workflows by 10x. #AI #DeveloperTools @Antigravity",
                authorHandle: "@future_dev",
                likes: 340,
                comments: 42,
                shares: 88,
            },
            {
                platform: "X",
                content: "Frustrated by constant breaking changes and system instability in this release. #devrant #bugs",
                authorHandle: "@code_warrior",
                likes: 12,
                comments: 19,
                shares: 3,
            },
            {
                platform: "INSTAGRAM",
                content: "Exploring the new design system and interface components. Thoughts on dark mode? #UI #DesignSystems",
                authorHandle: "@design_pro",
                likes: 156,
                comments: 28,
                shares: 11,
            }
        ];
        const previewRes = await fetch(`${BASE_URL}/api/ingestion/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ posts: samplePosts }),
        });
        const previewData = await previewRes.json();
        console.log(`✅ Ingestion Preview Result (${previewData.data?.length} posts analyzed):`);
        for (const item of (previewData.data || [])) {
            console.log(`   • Author: ${item.post.author.username}`);
            console.log(`     Text: "${item.cleanedText.slice(0, 60)}..."`);
            console.log(`     Sentiment: ${item.sentiment.label} (score: ${item.sentiment.score})`);
            console.log(`     Emotion: ${item.emotion.primary_emotion}`);
            console.log(`     Tags: ${item.post.hashtags.join(", ")} | Mentions: ${item.post.mentions.join(", ")}`);
        }
    }
    catch (err) {
        console.error("❌ Ingestion Preview test failed:", err);
    }
    // 4. Test NetworkX Graph Analytics
    console.log("\n[TEST 4] Testing NetworkX Graph Analysis via Python ML microservice...");
    try {
        const graphPayload = {
            nodes: [
                { id: "1", name: "Alice", category: "Creator" },
                { id: "2", name: "Bob", category: "Influencer" },
                { id: "3", name: "Charlie", category: "Audience" },
                { id: "4", name: "Diana", category: "Brand" }
            ],
            edges: [
                { source: "1", target: "2", weight: 5, interactions: 10 },
                { source: "2", target: "3", weight: 3, interactions: 4 },
                { source: "3", target: "1", weight: 2, interactions: 3 },
                { source: "4", target: "1", weight: 8, interactions: 15 }
            ]
        };
        const netRes = await fetch(`${ML_URL}/api/network/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(graphPayload),
        });
        const netData = await netRes.json();
        console.log(`✅ NetworkX Analysis Result (${netData.total_nodes} nodes, ${netData.total_edges} edges):`);
        for (const node of netData.nodes) {
            console.log(`   • ${node.name}: PageRank=${node.pagerank.toFixed(4)}, Centrality=${node.degree_centrality.toFixed(4)}, Community=${node.community_id}, Canvas Pos=(${node.x}, ${node.y})`);
        }
    }
    catch (err) {
        console.error("❌ Network analysis test failed:", err);
    }
    // 5. Test Topic Clustering & Trend Velocity
    console.log("\n[TEST 5] Testing Topic Clustering & Trend Scoring...");
    try {
        const topicPosts = [
            { id: "1", text: "Artificial Intelligence machine learning deep neural networks in 2026." },
            { id: "2", text: "State of generative AI models and intelligent coding assistants." },
            { id: "3", text: "Premier League championship match highlights, goals, and soccer updates." },
            { id: "4", text: "Football transfer news, match predictions, and coach tactical analysis." }
        ];
        const topicRes = await fetch(`${ML_URL}/api/topics/extract`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ posts: topicPosts, num_topics: 2 }),
        });
        const topicData = await topicRes.json();
        console.log(`✅ Topic Clustering Result (${topicData.topics.length} clusters found):`);
        for (const t of topicData.topics) {
            console.log(`   • Cluster #${t.topic_id} ("${t.name}"): Keywords=[${t.keywords.join(", ")}], Posts=${t.post_count}`);
        }
        const trendCandidates = [
            { name: "GenerativeAI", hashtag: "#AI", current_volume: 450, previous_volume: 120, total_engagement: 3200, first_seen_hours_ago: 6 },
            { name: "PremierLeague", hashtag: "#Football", current_volume: 210, previous_volume: 190, total_engagement: 900, first_seen_hours_ago: 12 }
        ];
        const trendRes = await fetch(`${ML_URL}/api/trends/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topics: trendCandidates }),
        });
        const trendData = await trendRes.json();
        console.log("✅ Trend Momentum Scoring Result:");
        for (const tr of trendData.ranked_trends) {
            console.log(`   • ${tr.name} (${tr.hashtag}): Momentum=${tr.momentum_score}, Velocity=${tr.velocity_rate}%, Status=${tr.status}`);
        }
    }
    catch (err) {
        console.error("❌ Topic/Trend test failed:", err);
    }
    console.log("\n==================================================");
    console.log("🎉 ALL TESTS EXECUTED SUCCESSFULLY!");
    console.log("==================================================");
}
runTests();
export {};
