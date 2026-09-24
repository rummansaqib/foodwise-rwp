"""
Behavior-aware variety module.

Looks at a user's recent history rows and flags repetition at the
restaurant, food and cuisine level, exactly mirroring the frontend's
src/ai/behaviorAnalyzer.ts so both offline and connected modes agree.

Deliberately does NOT label anything "unhealthy" -- only surfaces
repetition and suggests variety, per the project's health-safety rules.
"""
from collections import Counter
from typing import List


def analyze_history(history_rows: List) -> dict:
    restaurant_counts = Counter(h.restaurant_name for h in history_rows)
    food_counts = Counter(h.food_name for h in history_rows)
    cuisine_counts = Counter(h.cuisine for h in history_rows)

    messages = []

    for name, count in restaurant_counts.items():
        if count >= 3:
            messages.append(f"You've chosen {name} {count} times recently. Want to explore something different?")

    for name, count in food_counts.items():
        if count >= 2:
            messages.append(f"You've chosen {name} several times recently. Here are some different options you may enjoy.")

    if cuisine_counts:
        top_cuisine, top_count = cuisine_counts.most_common(1)[0]
        if len(history_rows) >= 4 and top_count / len(history_rows) >= 0.6:
            messages.append(f"Most of your recent meals are {top_cuisine} cuisine. Try a highly rated different cuisine nearby.")

    return {
        "repeated_restaurants": {k: v for k, v in restaurant_counts.items() if v >= 3},
        "repeated_foods": {k: v for k, v in food_counts.items() if v >= 2},
        "dominant_cuisine": cuisine_counts.most_common(1)[0][0] if cuisine_counts else None,
        "messages": messages,
    }
