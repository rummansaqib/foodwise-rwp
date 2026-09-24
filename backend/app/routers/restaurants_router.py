from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.core.database import get_db
from app.models.db_models import Restaurant, MenuItem
from app.schemas.schemas import RestaurantOut, RestaurantDetailOut, MenuItemOut

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("", response_model=list[RestaurantOut])
def list_restaurants(
    search: Optional[str] = None,
    area: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_distance: Optional[float] = None,
    sort: Optional[str] = Query(default="recommended"),
    db: Session = Depends(get_db),
):
    q = db.query(Restaurant)
    if search:
        like = f"%{search}%"
        # Search restaurant name/area AND matching menu item names
        matching_ids = [
            m.restaurant_id for m in db.query(MenuItem.restaurant_id).filter(MenuItem.name.ilike(like)).distinct()
        ]
        q = q.filter(or_(Restaurant.name.ilike(like), Restaurant.area.ilike(like), Restaurant.id.in_(matching_ids)))
    if area:
        q = q.filter(Restaurant.area == area)
    if min_rating:
        q = q.filter(Restaurant.rating >= min_rating)
    if max_distance:
        q = q.filter(Restaurant.distance_km <= max_distance)

    results = q.all()
    if sort == "rating":
        results.sort(key=lambda r: r.rating, reverse=True)
    elif sort == "nearest":
        results.sort(key=lambda r: r.distance_km)
    elif sort == "price_low":
        results.sort(key=lambda r: r.price_level)
    elif sort == "newest":
        results.sort(key=lambda r: r.opening_date, reverse=True)
    return results


@router.get("/{restaurant_id}", response_model=RestaurantDetailOut)
def restaurant_detail(restaurant_id: int, db: Session = Depends(get_db)):
    r = db.query(Restaurant).options(joinedload(Restaurant.menu_items)).filter(Restaurant.id == restaurant_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found.")
    return r


@router.get("/{restaurant_id}/menu", response_model=list[MenuItemOut])
def restaurant_menu(restaurant_id: int, meal_type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id)
    if meal_type:
        q = q.filter(MenuItem.meal_type == meal_type)
    return q.all()


@router.get("/search/foods", response_model=list[MenuItemOut])
def search_foods(q: str, db: Session = Depends(get_db)):
    like = f"%{q}%"
    return db.query(MenuItem).filter(MenuItem.name.ilike(like)).limit(50).all()
