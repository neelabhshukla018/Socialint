/**
 * SocialInt Python AI/ML Microservice Client
 * Communicates with the FastAPI intelligence service running on port 8000.
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export interface SentimentPayloadItem {
  id: string;
  text: string;
}

export interface SentimentResult {
  id?: string;
  label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  score: number;
  confidence: number;
  probabilities: {
    POSITIVE: number;
    NEUTRAL: number;
    NEGATIVE: number;
  };
}

export interface EmotionResult {
  id?: string;
  primary_emotion: string;
  emotions: Record<string, number>;
}

export interface TopicClusterResult {
  topic_id: number;
  name: string;
  keywords: string[];
  post_count: number;
  post_ids: string[];
  sentiment_hint?: string;
}

export interface TrendScoreResult {
  name: string;
  hashtag?: string;
  current_volume: number;
  velocity_rate: number;
  momentum_score: number;
  is_emerging: boolean;
  status: string;
}

export interface NetworkAnalysisResult {
  total_nodes: number;
  total_edges: number;
  num_communities: number;
  nodes: {
    id: string;
    name: string;
    category: string;
    influence_score: number;
    pagerank: number;
    degree_centrality: number;
    betweenness_centrality: number;
    community_id: number;
    x: number;
    y: number;
  }[];
  edges: {
    source: string;
    target: string;
    weight: number;
    interactions: number;
  }[];
}

class MLClient {
  private baseUrl: string;

  constructor(baseUrl = ML_SERVICE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Health check for Python ML microservice
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: "GET" });
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === "healthy";
    } catch {
      return false;
    }
  }

  /**
   * Predict sentiment for a batch of social posts
   */
  async analyzeSentiment(texts: SentimentPayloadItem[]): Promise<SentimentResult[]> {
    if (!texts.length) return [];

    try {
      const res = await fetch(`${this.baseUrl}/api/nlp/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts }),
      });

      if (!res.ok) {
        throw new Error(`ML service returned status ${res.status}`);
      }

      return (await res.json()) as SentimentResult[];
    } catch (error) {
      console.warn("[MLClient] Sentiment service fallback:", error);
      // Fallback rule
      return texts.map((t) => ({
        id: t.id,
        label: "NEUTRAL",
        score: 0.0,
        confidence: 0.8,
        probabilities: { POSITIVE: 0.2, NEUTRAL: 0.6, NEGATIVE: 0.2 },
      }));
    }
  }

  /**
   * Predict multi-class emotions
   */
  async analyzeEmotion(texts: SentimentPayloadItem[]): Promise<EmotionResult[]> {
    if (!texts.length) return [];

    try {
      const res = await fetch(`${this.baseUrl}/api/nlp/emotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts }),
      });

      if (!res.ok) {
        throw new Error(`ML service returned status ${res.status}`);
      }

      return (await res.json()) as EmotionResult[];
    } catch (error) {
      console.warn("[MLClient] Emotion service fallback:", error);
      return texts.map((t) => ({
        id: t.id,
        primary_emotion: "neutral",
        emotions: { neutral: 0.7, joy: 0.1, optimism: 0.1, anger: 0.05, sadness: 0.05 },
      }));
    }
  }

  /**
   * Group posts into semantic topic clusters
   */
  async extractTopics(
    posts: { id: string; text: string; published_at?: string }[],
    numTopics = 4
  ): Promise<TopicClusterResult[]> {
    if (!posts.length) return [];

    try {
      const res = await fetch(`${this.baseUrl}/api/topics/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts, num_topics: numTopics }),
      });

      if (!res.ok) {
        throw new Error(`ML service returned status ${res.status}`);
      }

      const data = await res.json();
      return data.topics as TopicClusterResult[];
    } catch (error) {
      console.warn("[MLClient] Topic service fallback:", error);
      return [
        {
          topic_id: 0,
          name: "General Community Feedback",
          keywords: ["community", "feedback", "features"],
          post_count: posts.length,
          post_ids: posts.map((p) => p.id),
        },
      ];
    }
  }

  /**
   * Calculate velocity, volume, and momentum trend scoring
   */
  async scoreTrends(
    topics: {
      name: string;
      hashtag?: string;
      current_volume: number;
      previous_volume: number;
      total_engagement: number;
      first_seen_hours_ago: number;
    }[]
  ): Promise<TrendScoreResult[]> {
    if (!topics.length) return [];

    try {
      const res = await fetch(`${this.baseUrl}/api/trends/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics }),
      });

      if (!res.ok) {
        throw new Error(`ML service returned status ${res.status}`);
      }

      const data = await res.json();
      return data.ranked_trends as TrendScoreResult[];
    } catch (error) {
      console.warn("[MLClient] Trend scoring fallback:", error);
      return topics.map((t) => ({
        name: t.name,
        hashtag: t.hashtag || `#${t.name.replace(/\s+/g, "")}`,
        current_volume: t.current_volume,
        velocity_rate: 15.0,
        momentum_score: 65.0,
        is_emerging: false,
        status: "STEADY",
      }));
    }
  }

  /**
   * Run NetworkX graph analysis for PageRank and community clustering
   */
  async analyzeNetworkGraph(
    nodes: { id: string; name: string; category?: string }[],
    edges: { source: string; target: string; weight?: number; interactions?: number }[]
  ): Promise<NetworkAnalysisResult> {
    try {
      const res = await fetch(`${this.baseUrl}/api/network/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) {
        throw new Error(`ML service returned status ${res.status}`);
      }

      return (await res.json()) as NetworkAnalysisResult;
    } catch (error) {
      console.warn("[MLClient] Network service fallback:", error);
      return {
        total_nodes: nodes.length,
        total_edges: edges.length,
        num_communities: 1,
        nodes: nodes.map((n, idx) => ({
          id: n.id,
          name: n.name,
          category: n.category || "Influencer",
          influence_score: 50.0,
          pagerank: 1.0 / (nodes.length || 1),
          degree_centrality: 0.5,
          betweenness_centrality: 0.1,
          community_id: 0,
          x: (idx - nodes.length / 2) * 50,
          y: (idx % 2 === 0 ? 1 : -1) * 40,
        })),
        edges: edges.map((e) => ({
          source: e.source,
          target: e.target,
          weight: e.weight || 1.0,
          interactions: e.interactions || 1,
        })),
      };
    }
  }
}

export const mlClient = new MLClient();
