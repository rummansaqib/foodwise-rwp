"""
Dietary compatibility checks.

Mirrors src/ai/dietEngine.ts on the frontend so both the offline (frontend
mock-data) mode and the connected-backend mode behave identically.
"""
from typing import List


def check_diet_compatibility(food, restrictions: List[str], dietary_preference: str):
    """
    food: an object/row with .vegetarian, .vegan, .allergens (list), .dietary_tags (list)
    Returns (status, reasons) where status in {"compatible", "warning", "incompatible"}.
    """
    reasons = []

    # Hard constraints -> incompatible
    for allergen in restrictions or []:
        if allergen in (food.allergens or []):
            reasons.append(f"Contains a selected allergen: {allergen}")
    if "Vegetarian" in (restrictions or []) and not food.vegetarian:
        reasons.append("Not vegetarian")
    if "Vegan" in (restrictions or []) and not food.vegan:
        reasons.append("Not vegan")

    if reasons:
        return "incompatible", reasons

    # Soft preference -> warning if it doesn't line up, but not blocked
    if dietary_preference and dietary_preference not in ("No Preference", None):
        if dietary_preference == "Vegetarian" and not food.vegetarian:
            return "warning", ["May not align with your vegetarian preference"]
        if dietary_preference == "Vegan" and not food.vegan:
            return "warning", ["May not align with your vegan preference"]
        if dietary_preference not in (food.dietary_tags or []) and dietary_preference not in ("Balanced",):
            return "warning", [f"May not fully match your {dietary_preference} preference"]

    return "compatible", ["Compatible with your selected diet"]
