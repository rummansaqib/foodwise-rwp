from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.core.database import get_db
from app.models.db_models import Restaurant, MenuItem, User, Review, HistoryItem
from app.schemas.schemas import RestaurantOut, MenuItemOut

router = APIRouter(prefix="/admin", tags=["admin"])

# NOTE: The FYP prototype uses simplified Demo Mode role-switching on the
# frontend (no separate admin login) as specified in the project scope.
# These endpoints are intentionally open for demo/grading convenience;
# a production deployment would add an `is_admin` flag on User and a
# require_admin() dependency here before going live.


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    return {
        "total_restaurants": db.query(Restaurant).count(),
        "total_menu_items": db.query(MenuItem).count(),
        "registered_users": db.query(User).count(),
        "total_reviews": db.query(Review).count(),
        "recommendations_generated": db.query(HistoryItem).count(),  # proxy metric for the demo
    }


class RestaurantCreate(BaseModel):
    name: str
    description: str = ""
    address: str = ""
    area: str
    rating: float = 4.0
    price_level: int = 2
    cuisines: List[str] = []
    meal_types: List[str] = []
    distance_km: float = 1.0
    opening_date: str = "2024-01-01"
    is_open: bool = True
    image: str = ""


@router.post("/restaurants", response_model=RestaurantOut)
def create_restaurant(payload: RestaurantCreate, db: Session = Depends(get_db)):
    r = Restaurant(**payload.model_dump())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.put("/restaurants/{restaurant_id}", response_model=RestaurantOut)
def update_restaurant(restaurant_id: int, payload: RestaurantCreate, db: Session = Depends(get_db)):
    r = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found.")
    for field, value in payload.model_dump().items():
        setattr(r, field, value)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/restaurants/{restaurant_id}")
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    r = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found.")
    db.delete(r)
    db.commit()
    return {"deleted": True}


class MenuItemCreate(BaseModel):
    restaurant_id: int
    name: str
    description: str = ""
    category: str
    meal_type: str = "Traditional"
    price: float
    ingredients: List[str] = []
    calories: int = 0
    protein: float = 0
    fat: float = 0
    carbs: float = 0
    sugar: float = 0
    sodium: float = 0
    spice_level: str = "Mild"
    vegetarian: bool = False
    vegan: bool = False
    dietary_tags: List[str] = []
    allergens: List[str] = []
    serving_size: str = "1 serving"
    serves_persons: int = 1
    image: str = ""


@router.post("/menu-items", response_model=MenuItemOut)
def create_menu_item(payload: MenuItemCreate, db: Session = Depends(get_db)):
    item = MenuItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/menu-items/{item_id}", response_model=MenuItemOut)
def update_menu_item(item_id: int, payload: MenuItemCreate, db: Session = Depends(get_db)):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found.")
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/menu-items/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found.")
    db.delete(item)
    db.commit()
    return {"deleted": True}
