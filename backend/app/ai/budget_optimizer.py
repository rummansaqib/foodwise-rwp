"""
Budget & Group Meal Optimizer.

Given a restaurant's menu, a total budget and a number of persons, builds
a meal combination that:
  - never exceeds the budget
  - scales quantities to the group size (serves_persons on each item)
  - prefers a high-protein/main item first, then fills with sides/drinks
  - stops adding items once the budget would be exceeded

This is a greedy constructive heuristic rather than an exhaustive knapsack
search, which keeps it fast enough to run per-restaurant on every request
while remaining easy to explain in an FYP defense. A future version could
swap this for real 0/1 knapsack DP if finer optimality is required.
"""
import math
from typing import List, Optional


def optimize_meal(menu_items: List, budget: float, persons: int) -> Optional[dict]:
    if not menu_items or budget <= 0 or persons <= 0:
        return None

    mains = [m for m in menu_items if m.category not in ("Beverage", "Salad", "Roti/Naan")]
    candidates = mains if mains else menu_items
    main = max(candidates, key=lambda m: m.protein)

    main_qty = max(1, math.ceil(persons / max(1, main.serves_persons)))
    main_cost = main.price * main_qty
    if main_cost > budget:
        # fall back to the cheapest item that fits at least once
        cheapest = min(menu_items, key=lambda m: m.price)
        if cheapest.price > budget:
            return None
        main = cheapest
        main_qty = 1
        main_cost = cheapest.price

    lines = [{"food_id": main.id, "name": main.name, "quantity": main_qty,
              "unit_price": main.price, "line_total": main_cost}]
    total = main_cost

    others = [m for m in menu_items if m.id != main.id]
    # Prefer sides/drinks/salad/roti for variety and lower cost first
    others.sort(key=lambda m: (m.category not in ("Roti/Naan", "Salad", "Beverage"), m.price))

    for item in others:
        qty = max(1, math.ceil(persons / max(1, item.serves_persons)))
        cost = item.price * qty
        if total + cost <= budget:
            lines.append({"food_id": item.id, "name": item.name, "quantity": qty,
                           "unit_price": item.price, "line_total": cost})
            total += cost

    if total > budget:
        return None

    return {
        "items": lines,
        "total": round(total, 2),
        "remaining_budget": round(budget - total, 2),
        "budget_used_percent": round((total / budget) * 100),
        "per_person": round(total / persons, 2),
    }
