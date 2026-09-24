"""
FoodWise Recommendation Engine (Python / backend)

This mirrors src/ai/recommendationEngine.ts on the frontend so both the
offline demo mode and the connected backend produce consistent, explainable
results. It combines:

    Rules              -> diet_engine.check_diet_compatibility (hard filters)
    Optimization       -> budget_optimizer.optimize_meal (group budget fit)
    Personalization    -> weighted score below + a scikit-learn content-based
                           similarity signal built from the user's own
                           eating history (TF-IDF over ingredients/category,
                           cosine similarity) -- this is the "remembers your
                           taste" component named in the requirements.
    Context            -> distance / rating / recency signals

Score weights (out of 100), matching the project proposal:
    Preference 20, Diet 20, Budget 15, Health 15,
    History 10, Rating 10, Distance 5, Variety 5

ARCHITECTURE NOTE: this module is intentionally transparent/rule-based so
it can be explained and evaluated in an FYP defense. It is structured so
the scoring step (score_candidate) can later be replaced or augmented with
a trained ranking model (e.g. LightGBM / learning-to-rank) without changing
any of the API routes that call generate_recommendations().
"""
from typing import List, Optional
from collections import defaultdict

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.ai.diet_engine import check_diet_compatibility
from app.ai.budget_optimizer import optimize_meal


def _food_text(food) -> str:
    return " ".join([food.category, food.meal_type] + (food.ingredients or []) + (food.dietary_tags or []))


def build_taste_profile_similarity(candidate_foods: List, history_rows: List) -> dict:
    """
    Content-based personalization signal using TF-IDF + cosine similarity.

    Builds a "taste profile" vector by averaging the TF-IDF vectors of the
    foods a user has previously chosen (from history_items), then scores
    each candidate food by its cosine similarity to that profile. Returns
    {food_id: similarity_0_to_1}. With no history, everything scores 0.5
    (neutral) so cold-start users aren't penalised -- see calc_history-
    /cold-start handling in generate_recommendations.
    """
    if not history_rows or not candidate_foods:
        return {f.id: 0.5 for f in candidate_foods}

    corpus_texts = [_food_text(f) for f in candidate_foods]
    history_texts = [h.food_name + " " + (h.cuisine or "") for h in history_rows]

    vectorizer = TfidfVectorizer()
    try:
        all_vectors = vectorizer.fit_transform(corpus_texts + history_texts)
    except ValueError:
        return {f.id: 0.5 for f in candidate_foods}

    n_candidates = len(corpus_texts)
    candidate_vectors = all_vectors[:n_candidates]
    history_vectors = all_vectors[n_candidates:]

    profile_vector = history_vectors.mean(axis=0)
    profile_vector = profile_vector.A if hasattr(profile_vector, "A") else profile_vector

    sims = cosine_similarity(candidate_vectors, profile_vector).flatten()
    return {f.id: float(sims[i]) for i, f in enumerate(candidate_foods)}


def calc_preference_score(restaurant, user) -> float:
    favs = set(user.favorite_cuisines or [])
    overlap = len(favs.intersection(set(restaurant.cuisines or [])))
    meal_type_match = bool(set(user.meal_type_preferences or []).intersection(set(restaurant.meal_types or [])))
    base = 14 + overlap * 2 + (2 if meal_type_match else 0)
    return min(20, base if overlap or meal_type_match else 9)


def calc_diet_score(food, user):
    status, reasons = check_diet_compatibility(food, user.restrictions or [], user.dietary_preference)
    score = {"compatible": 19, "warning": 11, "incompatible": 2}[status]
    if user.dietary_preference in (food.dietary_tags or []):
        score = min(20, score + 1)
    return score, status, reasons


def calc_budget_score(meal_total: Optional[float], budget: float) -> float:
    if meal_total is None or meal_total > budget:
        return 0
    usage = meal_total / budget
    return round(min(15, 8 + usage * 7), 1)


def calc_health_score(food, user) -> float:
    goal = user.goal
    if goal == "High Protein":
        return 15 if food.protein >= 25 else 10 if food.protein >= 12 else 6
    if goal == "Weight Loss":
        return 15 if food.calories <= 400 else 9 if food.calories <= 600 else 5
    if goal == "Weight Gain":
        return 15 if food.calories >= 550 else 9
    return 12


def calc_history_score(restaurant_name: str, history_rows: List) -> float:
    count = sum(1 for h in history_rows if h.restaurant_name == restaurant_name)
    return {0: 10, 1: 8}.get(count, 6 if count == 2 else 3)


def calc_rating_score(rating: float) -> float:
    return round((rating / 5) * 10, 1)


def calc_distance_score(distance_km: float) -> float:
    if distance_km <= 1.5:
        return 5
    if distance_km <= 3:
        return 4
    if distance_km <= 5:
        return 3
    if distance_km <= 8:
        return 2
    return 1


def calc_variety_score(food_name: str, history_rows: List) -> float:
    recent_same = sum(1 for h in history_rows if h.food_name == food_name)
    return 1 if recent_same >= 2 else 3 if recent_same == 1 else 5


def generate_explanation(restaurant, food, meal, user, history_rows, budget, persons) -> List[str]:
    notes = []
    if meal and meal["total"] <= budget:
        notes.append(f"Within your Rs. {budget:,.0f} budget")
    notes.append(f"Suitable for {persons} {'person' if persons == 1 else 'people'}")
    overlap = set(user.favorite_cuisines or []).intersection(set(restaurant.cuisines or []))
    if overlap:
        notes.append(f"Matches your {next(iter(overlap))} preference")
    if set(user.meal_type_preferences or []).intersection(set(restaurant.meal_types or [])):
        notes.append("Matches your preferred meal type")
    status, _ = check_diet_compatibility(food, user.restrictions or [], user.dietary_preference)
    if status == "compatible":
        notes.append(f"Fits your {user.goal} goal")
    if restaurant.rating >= 4.3:
        notes.append("Highly rated by customers")
    visits = sum(1 for h in history_rows if h.restaurant_name == restaurant.name)
    if visits == 0:
        notes.append("You haven't eaten here recently")
    elif visits < 3:
        notes.append("A change from your most recent choices")
    return notes


def generate_recommendations(
    restaurants: List,
    menu_by_restaurant: dict,
    user,
    history_rows: List,
    budget: float,
    persons: int,
    filters: Optional[dict] = None,
) -> List[dict]:
    filters = filters or {}
    results = []

    all_candidate_foods = [f for foods in menu_by_restaurant.values() for f in foods]
    similarity_map = build_taste_profile_similarity(all_candidate_foods, history_rows)

    for r in restaurants:
        if filters.get("area") and filters["area"] != r.area:
            continue
        if filters.get("min_rating") and r.rating < filters["min_rating"]:
            continue
        if filters.get("max_distance") and r.distance_km > filters["max_distance"]:
            continue
        if filters.get("cuisines") and not set(filters["cuisines"]).intersection(set(r.cuisines or [])):
            continue
        if filters.get("meal_types") and not set(filters["meal_types"]).intersection(set(r.meal_types or [])):
            continue

        items = menu_by_restaurant.get(r.id, [])
        if not items:
            continue

        # Rank candidate foods by diet compatibility, then health/protein, then learned similarity
        def food_sort_key(f):
            status, _ = check_diet_compatibility(f, user.restrictions or [], user.dietary_preference)
            penalty = {"incompatible": 2, "warning": 1, "compatible": 0}[status]
            return (penalty, -similarity_map.get(f.id, 0.5), -f.protein)

        best_food = sorted(items, key=food_sort_key)[0]
        diet_status, diet_reasons = check_diet_compatibility(best_food, user.restrictions or [], user.dietary_preference)

        meal = optimize_meal(items, budget, persons)
        if not meal:
            continue

        preference = calc_preference_score(r, user)
        diet_score, _, _ = calc_diet_score(best_food, user)
        budget_score = calc_budget_score(meal["total"], budget)
        health = calc_health_score(best_food, user)
        history = calc_history_score(r.name, history_rows)
        rating = calc_rating_score(r.rating)
        distance = calc_distance_score(r.distance_km)
        variety = calc_variety_score(best_food.name, history_rows)

        # Personalization nudge: the TF-IDF taste-similarity score gently
        # re-weights preference (bounded so rule-based scoring stays dominant
        # and explainable).
        sim = similarity_map.get(best_food.id, 0.5)
        preference = min(20, preference + (sim - 0.5) * 4)

        total = preference + diet_score + budget_score + health + history + rating + distance + variety

        results.append({
            "restaurant": r,
            "food": best_food,
            "meal": meal,
            "score": {
                "preference": round(preference, 1), "diet": diet_score, "budget": budget_score,
                "health": health, "history": history, "rating": rating,
                "distance": distance, "variety": variety, "total": round(total, 1),
            },
            "diet_status": diet_status,
            "explanation": generate_explanation(r, best_food, meal, user, history_rows, budget, persons),
        })

    results.sort(key=lambda x: x["score"]["total"], reverse=True)
    return results
