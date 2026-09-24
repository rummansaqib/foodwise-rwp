"""
Aspect-Based Sentiment Analysis (rule-based, transparent).

For the FYP prototype this uses a lightweight lexicon + aspect-keyword
approach rather than a heavyweight trained transformer, so it runs
instantly with no model download and is easy to explain in a defense.
The module is structured so it can be swapped for a Hugging Face
transformers pipeline later (see NOTE at the bottom) without touching
any caller code -- analyze_review() is the stable interface.
"""
import re
from typing import Dict, List

POSITIVE_WORDS = {
    "amazing", "great", "excellent", "delicious", "tasty", "fresh", "friendly",
    "fast", "quick", "clean", "good", "love", "loved", "perfect", "affordable",
    "generous", "warm", "polite", "recommend", "best", "wonderful", "juicy",
}
NEGATIVE_WORDS = {
    "slow", "bad", "cold", "rude", "dirty", "small", "expensive", "bland",
    "late", "worst", "terrible", "awful", "overpriced", "stale", "disappointing",
    "poor", "undercooked", "burnt", "greasy",
}

ASPECT_KEYWORDS = {
    "Taste": {"taste", "tasty", "flavor", "flavour", "delicious", "bland", "spicy", "juicy"},
    "Service": {"service", "staff", "waiter", "waitress", "server", "slow", "rude", "friendly", "polite"},
    "Portion": {"portion", "quantity", "size", "small", "large", "generous"},
    "Price": {"price", "expensive", "cheap", "affordable", "overpriced", "value"},
    "Cleanliness": {"clean", "dirty", "hygiene", "hygienic"},
    "Ambience": {"ambience", "ambiance", "atmosphere", "decor", "seating", "music"},
}


def _tokenize(text: str) -> List[str]:
    return re.findall(r"[a-zA-Z']+", text.lower())


def _sentence_split(text: str) -> List[str]:
    return [s.strip() for s in re.split(r"[.!?]", text) if s.strip()]


def _sentiment_of(tokens: List[str]) -> str:
    pos = sum(1 for t in tokens if t in POSITIVE_WORDS)
    neg = sum(1 for t in tokens if t in NEGATIVE_WORDS)
    if pos > neg:
        return "Positive"
    if neg > pos:
        return "Negative"
    return "Neutral"


def analyze_review(text: str) -> Dict:
    sentences = _sentence_split(text) or [text]
    aspect_results: Dict[str, List[str]] = {a: [] for a in ASPECT_KEYWORDS}

    for sentence in sentences:
        tokens = _tokenize(sentence)
        sentiment = _sentiment_of(tokens)
        for aspect, keywords in ASPECT_KEYWORDS.items():
            if any(t in keywords for t in tokens):
                aspect_results[aspect].append(sentiment)

    aspects = []
    for aspect, sentiments in aspect_results.items():
        if not sentiments:
            continue
        pos = sentiments.count("Positive")
        neg = sentiments.count("Negative")
        overall = "Positive" if pos > neg else "Negative" if neg > pos else "Neutral"
        aspects.append({"label": aspect, "sentiment": overall})

    all_tokens = _tokenize(text)
    overall_pos = sum(1 for t in all_tokens if t in POSITIVE_WORDS)
    overall_neg = sum(1 for t in all_tokens if t in NEGATIVE_WORDS)
    if overall_pos > 0 and overall_neg > 0:
        overall = "Mixed"
    elif overall_pos > overall_neg:
        overall = "Positive"
    elif overall_neg > overall_pos:
        overall = "Negative"
    else:
        overall = "Neutral"

    return {"overall": overall, "aspects": aspects}

# NOTE (future extension): to use a trained transformer instead, replace the
# body of analyze_review() with a call to a Hugging Face
# `pipeline("sentiment-analysis")` / aspect-based-sentiment model and keep
# the same return shape: {"overall": str, "aspects": [{"label","sentiment"}]}.
