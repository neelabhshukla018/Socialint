"""
Quick test client for SocialInt ML Microservice endpoints.
"""

import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def post_json(endpoint: str, data: dict):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_json(endpoint: str):
    with urllib.request.urlopen(f"{BASE_URL}{endpoint}") as resp:
        return json.loads(resp.read().decode("utf-8"))

if __name__ == "__main__":
    print("1. Health Check:")
    print(get_json("/health"))

    print("\n2. Sentiment Analysis:")
    sentiment_payload = {
        "texts": [
            {"id": "p1", "text": "Loving the real-time social intelligence updates! Outstanding work."},
            {"id": "p2", "text": "The API rate limit error was annoying and frustrating today."},
            {"id": "p3", "text": "Release notes for version 2.4 have been posted on GitHub."}
        ]
    }
    sent_res = post_json("/api/nlp/sentiment", sentiment_payload)
    print(json.dumps(sent_res, indent=2))

    print("\n3. Topic Extraction:")
    topic_payload = {
        "posts": [
            {"id": "p1", "text": "API rate limits and custom webhooks for developers."},
            {"id": "p2", "text": "New developer documentation for webhook setup and API keys."},
            {"id": "p3", "text": "Instagram reels performance and audience growth breakdown."},
            {"id": "p4", "text": "Short-form video tips for Instagram engagement boost."}
        ],
        "num_topics": 2
    }
    topic_res = post_json("/api/topics/extract", topic_payload)
    print(json.dumps(topic_res, indent=2))

    print("\n4. Network Analysis (NetworkX):")
    net_payload = {
        "nodes": [
            {"id": "u1", "name": "@tech_sarah", "category": "KOL"},
            {"id": "u2", "name": "@socialint_app", "category": "Brand"},
            {"id": "u3", "name": "@dev_mark", "category": "Contributor"}
        ],
        "edges": [
            {"source": "u1", "target": "u2", "weight": 2.5, "interactions": 14},
            {"source": "u3", "target": "u2", "weight": 1.8, "interactions": 8},
            {"source": "u1", "target": "u3", "weight": 0.5, "interactions": 2}
        ]
    }
    net_res = post_json("/api/network/analyze", net_payload)
    print(json.dumps(net_res, indent=2))
    print("\nALL ML ENDPOINTS PASSED SUCCESSFULLY!")
