"""
NLP Router for SocialInt AI Service
Provides sentiment analysis, emotion detection, and text embeddings.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
import numpy as np

router = APIRouter(prefix="/api/nlp", tags=["NLP"])

# Lazy-loaded models to ensure fast microservice boot
_sentiment_pipeline = None
_embedding_model = None

# Pydantic Schemas
class TextInput(BaseModel):
    text: str = Field(..., min_length=1, description="Text to analyze")
    id: Optional[str] = None

class BatchTextInput(BaseModel):
    texts: List[TextInput]

class SentimentResult(BaseModel):
    id: Optional[str] = None
    label: str # POSITIVE | NEGATIVE | NEUTRAL
    score: float # Continuous score between -1.0 and +1.0
    confidence: float # 0.0 to 1.0
    probabilities: Dict[str, float]

class EmotionResult(BaseModel):
    id: Optional[str] = None
    primary_emotion: str # joy, optimism, anger, sadness, surprise, neutral
    emotions: Dict[str, float]

class EmbeddingResult(BaseModel):
    id: Optional[str] = None
    vector: List[float]
    dimension: int


def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        try:
            from transformers import pipeline
            # Use lightweight Cardiff NLP twitter roberta sentiment or default distilbert
            _sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                top_k=None,
                device=-1 # CPU default for portability
            )
        except Exception as e:
            print(f"[NLP] Transformers pipeline warning: {e}. Using rule-based fallback.")
            _sentiment_pipeline = "FALLBACK"
    return _sentiment_pipeline


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            print(f"[NLP] SentenceTransformer load warning: {e}.")
            _embedding_model = "FALLBACK"
    return _embedding_model


# Lexicon-based fallback for instant responses without heavy model download delay
POSITIVE_WORDS = {
    "love", "great", "awesome", "good", "amazing", "excellent", "fast", "best",
    "clean", "smooth", "happy", "excited", "fantastic", "helpful", "super",
    "recommend", "promising", "powerful", "innovative", "brilliant", "proud"
}

NEGATIVE_WORDS = {
    "hate", "bad", "terrible", "awful", "horrible", "slow", "broken", "bug",
    "issue", "crash", "error", "fail", "poor", "worst", "annoying", "frustrated",
    "disappointed", "glitch", "confusing", "useless"
}

EMOTION_KEYWORDS = {
    "joy": ["happy", "delighted", "love", "awesome", "yay", "celebrate", "great"],
    "optimism": ["hope", "promising", "future", "looking forward", "excited", "grow", "ahead"],
    "anger": ["angry", "frustrated", "annoying", "terrible", "hate", "mad", "ridiculous"],
    "sadness": ["sad", "unfortunate", "disappointed", "bummer", "miss", "lost"],
    "surprise": ["wow", "unexpected", "surprise", "incredible", "unbelievable"]
}


def rule_based_sentiment(text: str) -> SentimentResult:
    tokens = text.lower().split()
    pos_count = sum(1 for w in tokens if any(p in w for p in POSITIVE_WORDS))
    neg_count = sum(1 for w in tokens if any(n in w for n in NEGATIVE_WORDS))
    total = pos_count + neg_count

    if total == 0:
        return SentimentResult(
            label="NEUTRAL",
            score=0.0,
            confidence=0.75,
            probabilities={"POSITIVE": 0.2, "NEUTRAL": 0.65, "NEGATIVE": 0.15}
        )

    pos_prob = pos_count / total
    neg_prob = neg_count / total
    neu_prob = max(0.1, 1.0 - (pos_prob + neg_prob))

    # Normalize
    s = pos_prob + neg_prob + neu_prob
    pos_prob, neg_prob, neu_prob = pos_prob / s, neg_prob / s, neu_prob / s

    if pos_prob > neg_prob and pos_prob >= 0.4:
        label = "POSITIVE"
        score = float(np.clip(pos_prob, 0.4, 0.95))
        conf = float(pos_prob)
    elif neg_prob > pos_prob and neg_prob >= 0.4:
        label = "NEGATIVE"
        score = -float(np.clip(neg_prob, 0.4, 0.95))
        conf = float(neg_prob)
    else:
        label = "NEUTRAL"
        score = 0.0
        conf = float(neu_prob)

    return SentimentResult(
        label=label,
        score=score,
        confidence=conf,
        probabilities={"POSITIVE": round(pos_prob, 3), "NEUTRAL": round(neu_prob, 3), "NEGATIVE": round(neg_prob, 3)}
    )


def rule_based_emotion(text: str) -> EmotionResult:
    tokens = text.lower()
    scores = {}
    for emo, keywords in EMOTION_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in tokens)
        scores[emo] = float(count)

    total = sum(scores.values())
    if total == 0:
        scores["neutral"] = 1.0
        primary = "neutral"
        emotions = {k: 0.1 for k in EMOTION_KEYWORDS}
        emotions["neutral"] = 0.5
    else:
        primary = max(scores, key=scores.get)
        emotions = {k: round(v / (total + 0.5), 3) for k, v in scores.items()}
        emotions["neutral"] = round(0.5 / (total + 0.5), 3)

    return EmotionResult(primary_emotion=primary, emotions=emotions)


@router.post("/sentiment", response_model=List[SentimentResult])
async def analyze_sentiment(payload: BatchTextInput):
    """
    Analyzes sentiment for a batch of social posts.
    Returns POSITIVE, NEGATIVE, or NEUTRAL with continuous score & probability distribution.
    """
    results: List[SentimentResult] = []
    pipe = get_sentiment_pipeline()

    for item in payload.texts:
        if not item.text.strip():
            results.append(SentimentResult(
                id=item.id,
                label="NEUTRAL",
                score=0.0,
                confidence=1.0,
                probabilities={"POSITIVE": 0.0, "NEUTRAL": 1.0, "NEGATIVE": 0.0}
            ))
            continue

        if pipe != "FALLBACK":
            try:
                preds = pipe(item.text[:512]) # limit length for transformer
                # parse output
                scores_map = {p["label"]: p["score"] for p in preds[0]}
                pos_score = scores_map.get("POSITIVE", 0.0)
                neg_score = scores_map.get("NEGATIVE", 0.0)
                
                # Check for neutral band
                diff = pos_score - neg_score
                if abs(diff) < 0.2:
                    label = "NEUTRAL"
                    continuous_score = 0.0
                    conf = 1.0 - abs(diff)
                elif diff > 0:
                    label = "POSITIVE"
                    continuous_score = float(pos_score)
                    conf = float(pos_score)
                else:
                    label = "NEGATIVE"
                    continuous_score = -float(neg_score)
                    conf = float(neg_score)

                results.append(SentimentResult(
                    id=item.id,
                    label=label,
                    score=round(continuous_score, 3),
                    confidence=round(conf, 3),
                    probabilities={
                        "POSITIVE": round(pos_score, 3),
                        "NEUTRAL": round(1.0 - abs(diff) if abs(diff) < 0.3 else 0.1, 3),
                        "NEGATIVE": round(neg_score, 3)
                    }
                ))
                continue
            except Exception as ex:
                print(f"[NLP] Inference error: {ex}, using rule-based.")

        # Fallback
        res = rule_based_sentiment(item.text)
        res.id = item.id
        results.append(res)

    return results


@router.post("/emotion", response_model=List[EmotionResult])
async def analyze_emotion(payload: BatchTextInput):
    """
    Analyzes multi-class emotions (joy, optimism, anger, sadness, surprise, neutral) for incoming text.
    """
    results: List[EmotionResult] = []
    for item in payload.texts:
        emo_res = rule_based_emotion(item.text)
        emo_res.id = item.id
        results.append(emo_res)
    return results


@router.post("/embeddings", response_model=List[EmbeddingResult])
async def generate_embeddings(payload: BatchTextInput):
    """
    Generates sentence embeddings (e.g. 384 dimensions) for vector search and clustering.
    """
    results: List[EmbeddingResult] = []
    model = get_embedding_model()

    if model != "FALLBACK":
        try:
            texts = [item.text for item in payload.texts]
            embeddings = model.encode(texts, convert_to_numpy=True)
            for item, emb in zip(payload.texts, embeddings):
                results.append(EmbeddingResult(
                    id=item.id,
                    vector=emb.tolist(),
                    dimension=len(emb)
                ))
            return results
        except Exception as ex:
            print(f"[NLP] Sentence-transformer error: {ex}, falling back to TF-IDF pseudo-vector.")

    # Fallback pseudo-embedding
    for item in payload.texts:
        # Simple deterministic 64-dim projection
        chars = [ord(c) for c in item.text[:64]]
        if len(chars) < 64:
            chars += [0] * (64 - len(chars))
        vec = [(c % 100) / 100.0 for c in chars[:64]]
        results.append(EmbeddingResult(
            id=item.id,
            vector=vec,
            dimension=len(vec)
        ))

    return results
