from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, HistoryItem, Favorite, Restaurant, MenuItem
from app.schemas.schemas import HistoryCreate, HistoryOut, FavoriteToggle
from app.ai.behavior_analyzer import analyze_history

router = APIRouter(tags=["history-favorites"])


@router.get("/history", response_model=list[HistoryOut])
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(HistoryItem).filter(HistoryItem.user_id == current_user.id).order_by(HistoryItem.created_at.desc()).all()
    return [
        HistoryOut(
            id=r.id, restaurant_id=r.restaurant_id, food_id=r.food_id,
            restaurant_name=r.restaurant_name, food_name=r.food_name, cuisine=r.cuisine,
            cost=r.cost, rating=r.rating, created_at=r.created_at.isoformat(),
        ) for r in rows
    ]


@router.post("/history", response_model=HistoryOut)
def add_history(payload: HistoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == payload.restaurant_id).first()
    food = db.query(MenuItem).filter(MenuItem.id == payload.food_id).first()
    if not restaurant or not food:
        raise HTTPException(status_code=404, detail="Restaurant or food item not found.")

    row = HistoryItem(
        user_id=current_user.id,
        restaurant_id=restaurant.id,
        food_id=food.id,
        restaurant_name=restaurant.name,
        food_name=food.name,
        cuisine=(restaurant.cuisines or ["Pakistani"])[0],
        cost=payload.cost,
        rating=payload.rating,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return HistoryOut(
        id=row.id, restaurant_id=row.restaurant_id, food_id=row.food_id,
        restaurant_name=row.restaurant_name, food_name=row.food_name, cuisine=row.cuisine,
        cost=row.cost, rating=row.rating, created_at=row.created_at.isoformat(),
    )


@router.get("/history/behavior")
def get_behavior_insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(HistoryItem).filter(HistoryItem.user_id == current_user.id).order_by(HistoryItem.created_at.desc()).limit(30).all()
    return analyze_history(rows)


@router.get("/favorites")
def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    return [{"id": f.id, "restaurant_id": f.restaurant_id, "food_id": f.food_id} for f in rows]


@router.post("/favorites/toggle")
def toggle_favorite(payload: FavoriteToggle, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(Favorite).filter(Favorite.user_id == current_user.id)
    if payload.restaurant_id:
        q = q.filter(Favorite.restaurant_id == payload.restaurant_id)
    if payload.food_id:
        q = q.filter(Favorite.food_id == payload.food_id)
    existing = q.first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"favorited": False}

    fav = Favorite(user_id=current_user.id, restaurant_id=payload.restaurant_id, food_id=payload.food_id)
    db.add(fav)
    db.commit()
    return {"favorited": True}
