"""
Trends Router for SocialInt AI Service
Computes trend velocity, volume, momentum, novelty, and time-decay scores.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter
import math

router = APIRouter(prefix="/api/trends", tags=["Trends"])


class TopicMetricInput(BaseModel):
    name: str
    hashtag: Optional[str] = None
    current_volume: int = Field(..., ge=0)
    previous_volume: int = Field(default=0, ge=0)
    total_engagement: int = Field(default=0, ge=0)
    first_seen_hours_ago: float = Field(default=1.0, ge=0.1)


class TrendScoreResult(BaseModel):
    name: str
    hashtag: Optional[str] = None
    current_volume: int
    velocity_rate: float # e.g. +38.5%
    momentum_score: float # 0 to 100
    is_emerging: bool
    status: str # "EXPLODING", "RISING", "STEADY", "COOLING"


class TrendBatchRequest(BaseModel):
    topics: List[TopicMetricInput]


class TrendBatchResponse(BaseModel):
    ranked_trends: List[TrendScoreResult]


def calculate_trend_score(item: TopicMetricInput) -> TrendScoreResult:
    """
    Computes velocity, momentum, and emergence using:
    Score = (Volume * Velocity * Engagement_Density) * Novelty * Time_Decay
    """
    vol = max(1, item.current_volume)
    prev = max(1, item.previous_volume)

    # Velocity: percentage growth rate
    velocity = (vol - prev) / prev

    # Engagement density (average engagement per mention)
    engagement_rate = item.total_engagement / vol if vol > 0 else 0

    # Novelty boost: topics newly appeared in the last 24h get a novelty multiplier
    novelty = 1.5 if item.first_seen_hours_ago <= 12 else (1.2 if item.first_seen_hours_ago <= 24 else 1.0)

    # Time decay factor: e^(-lambda * t)
    time_decay = math.exp(-0.02 * min(item.first_seen_hours_ago, 72.0))

    # Raw momentum
    raw_momentum = (vol * (1.0 + max(-0.5, velocity)) * (1.0 + math.log1p(engagement_rate))) * novelty * time_decay

    # Normalized score between 0 and 100
    momentum_score = round(min(100.0, max(0.0, raw_momentum / 10.0)), 1)

    # Emerging flag
    is_emerging = velocity > 0.3 and item.first_seen_hours_ago <= 36

    # Status classification
    if velocity >= 0.7 or momentum_score >= 80:
        status = "EXPLODING"
    elif velocity >= 0.25 or momentum_score >= 50:
        status = "RISING"
    elif velocity >= -0.1:
        status = "STEADY"
    else:
        status = "COOLING"

    return TrendScoreResult(
        name=item.name,
        hashtag=item.hashtag or (f"#{item.name.replace(' ', '')}" if not item.name.startswith("#") else item.name),
        current_volume=item.current_volume,
        velocity_rate=round(velocity * 100.0, 1),
        momentum_score=momentum_score,
        is_emerging=is_emerging,
        status=status
    )


@router.post("/score", response_model=TrendBatchResponse)
async def score_trends(payload: TrendBatchRequest):
    """
    Ranks trending topics by velocity, volume, and momentum.
    """
    scored = [calculate_trend_score(t) for t in payload.topics]
    # Sort by momentum score descending
    scored.sort(key=lambda s: s.momentum_score, reverse=True)
    return TrendBatchResponse(ranked_trends=scored)
