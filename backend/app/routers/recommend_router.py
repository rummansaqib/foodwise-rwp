from collections import defaultdict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, Restaurant, MenuItem, HistoryItem
from app.schemas.schemas import FindFoodRequest, RecommendationOut
from app.ai.recommendation_engine import generate_recommendations

router = APIRouter(prefix="/recommend", tags=["recommendation"])


@router.post("/find-food", response_model=list[RecommendationOut])
def find_food(payload: FindFoodRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurants = db.query(Restaurant).filter(Restaurant.is_open == True).all()  # noqa: E712
    menu_by_restaurant = defaultdict(list)
    for item in db.query(MenuItem).all():
        menu_by_restaurant[item.restaurant_id].append(item)

    history_rows = db.query(HistoryItem).filter(HistoryItem.user_id == current_user.id).order_by(HistoryItem.created_at.desc()).limit(30).all()

    filters = {
        "area": payload.area if payload.area and payload.area != "Rawalpindi" else None,
        "cuisines": payload.cuisines,
        "meal_types": payload.meal_types,
        "min_rating": payload.min_rating,
        "max_distance": payload.max_distance,
    }

    recs = generate_recommendations(
        restaurants=restaurants,
        menu_by_restaurant=menu_by_restaurant,
        user=current_user,
        history_rows=history_rows,
        budget=payload.budget,
        persons=payload.persons,
        filters=filters,
    )

    output = []
    for rec in recs[:12]:
        output.append({
            "restaurant": rec["restaurant"],
            "food": rec["food"],
            "meal": {
                "items": rec["meal"]["items"],
                "total": rec["meal"]["total"],
                "remaining_budget": rec["meal"]["remaining_budget"],
                "budget_used_percent": rec["meal"]["budget_used_percent"],
                "per_person": rec["meal"]["per_person"],
            } if rec["meal"] else None,
            "score": rec["score"],
            "diet_status": rec["diet_status"],
            "explanation": rec["explanation"],
        })
    return output
