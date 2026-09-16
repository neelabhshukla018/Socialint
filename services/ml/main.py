"""
SocialInt Python AI/ML Microservice
Provides intelligence endpoints for Sentiment, Emotion, Topic Clustering, Trend Scoring, and Graph Analytics.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.nlp import router as nlp_router
from routers.topics import router as topics_router
from routers.trends import router as trends_router
from routers.network import router as network_router

app = FastAPI(
    title="SocialInt AI/ML Service",
    version="1.0.0",
    description="Dedicated intelligence microservice for SocialInt multi-platform social media intelligence.",
)

# Allow local frontend and Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(nlp_router)
app.include_router(topics_router)
app.include_router(trends_router)
app.include_router(network_router)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SocialInt AI/ML Service",
        "version": "1.0.0",
        "endpoints": [
            "/api/nlp/sentiment",
            "/api/nlp/emotion",
            "/api/nlp/embeddings",
            "/api/topics/extract",
            "/api/trends/score",
            "/api/network/analyze",
        ],
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "SocialInt AI/ML Service",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
