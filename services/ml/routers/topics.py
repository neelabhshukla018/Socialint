"""
Topics Router for SocialInt AI Service
Performs topic extraction, embeddings clustering (K-Means), and keyword modeling.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from fastapi import APIRouter
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

router = APIRouter(prefix="/api/topics", tags=["Topics"])


class PostTopicItem(BaseModel):
    id: str
    text: str
    published_at: Optional[str] = None


class TopicExtractRequest(BaseModel):
    posts: List[PostTopicItem] = Field(..., min_length=1)
    num_topics: Optional[int] = Field(default=4, ge=2, le=10)


class TopicCluster(BaseModel):
    topic_id: int
    name: str
    keywords: List[str]
    post_count: int
    post_ids: List[str]
    sentiment_hint: Optional[str] = "NEUTRAL"


class TopicExtractResponse(BaseModel):
    total_posts: int
    num_clusters: int
    topics: List[TopicCluster]


@router.post("/extract", response_model=TopicExtractResponse)
async def extract_topics(payload: TopicExtractRequest):
    """
    Groups posts into semantic clusters using TF-IDF + K-Means clustering.
    Extracts high-signal keywords for each cluster to label emerging conversation topics.
    """
    posts = payload.posts
    n_posts = len(posts)

    if n_posts < 2:
        return TopicExtractResponse(
            total_posts=n_posts,
            num_clusters=1,
            topics=[
                TopicCluster(
                    topic_id=0,
                    name="General Discussion",
                    keywords=[w for w in posts[0].text.lower().split()[:5]],
                    post_count=1,
                    post_ids=[posts[0].id],
                )
            ],
        )

    k = min(payload.num_topics or 4, n_posts)

    corpus = [p.text for p in posts]

    try:
        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=200,
            ngram_range=(1, 2),
            min_df=1
        )
        X = vectorizer.fit_transform(corpus)
        feature_names = np.array(vectorizer.get_feature_names_out())

        # K-Means clustering
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=5)
        labels = kmeans.fit_predict(X)

        clusters: Dict[int, List[int]] = {i: [] for i in range(k)}
        for idx, label in enumerate(labels):
            clusters[label].append(idx)

        topic_results: List[TopicCluster] = []

        # Find top keywords per cluster centroid
        order_centroids = kmeans.cluster_centers_.argsort()[:, ::-1]

        for cluster_id in range(k):
            post_indices = clusters[cluster_id]
            if not post_indices:
                continue

            top_word_indices = order_centroids[cluster_id, :6]
            top_words = [feature_names[i] for i in top_word_indices if i < len(feature_names)]
            
            # Generate human-friendly label from top 2 words
            if len(top_words) >= 2:
                name = f"{top_words[0].capitalize()} & {top_words[1].capitalize()}"
            elif len(top_words) == 1:
                name = top_words[0].capitalize()
            else:
                name = f"Topic Cluster {cluster_id + 1}"

            topic_results.append(
                TopicCluster(
                    topic_id=cluster_id,
                    name=name,
                    keywords=top_words,
                    post_count=len(post_indices),
                    post_ids=[posts[i].id for i in post_indices],
                    sentiment_hint="POSITIVE" if any(w in top_words for w in ["good", "great", "fast", "love", "update"]) else "NEUTRAL"
                )
            )

        # Sort topics by post count descending
        topic_results.sort(key=lambda t: t.post_count, reverse=True)

        return TopicExtractResponse(
            total_posts=n_posts,
            num_clusters=len(topic_results),
            topics=topic_results,
        )

    except Exception as ex:
        print(f"[Topics] Clustering fallback error: {ex}")
        # Graceful fallback: return single topic
        return TopicExtractResponse(
            total_posts=n_posts,
            num_clusters=1,
            topics=[
                TopicCluster(
                    topic_id=0,
                    name="Community Feedback",
                    keywords=["community", "feedback", "product"],
                    post_count=n_posts,
                    post_ids=[p.id for p in posts],
                )
            ],
        )
