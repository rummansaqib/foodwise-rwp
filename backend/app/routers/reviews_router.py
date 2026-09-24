from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, Review, Restaurant
from app.schemas.schemas import ReviewCreate, ReviewOut
from app.ai.sentiment_analyzer import analyze_review

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/restaurant/{restaurant_id}", response_model=list[ReviewOut])
def get_reviews(restaurant_id: int, db: Session = Depends(get_db)):
    rows = db.query(Review).filter(Review.restaurant_id == restaurant_id, Review.status == "approved").order_by(Review.created_at.desc()).all()
    return [_to_out(r) for r in rows]


@router.post("", response_model=ReviewOut)
def create_review(payload: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == payload.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found.")

    sentiment = analyze_review(payload.comment)

    review = Review(
        restaurant_id=payload.restaurant_id,
        user_id=current_user.id,
        rating=payload.rating,
        comment=payload.comment,
        food_quality=payload.food_quality,
        service=payload.service,
        portion=payload.portion,
        price=payload.price,
        cleanliness=payload.cleanliness,
        sentiment_overall=sentiment["overall"],
        sentiment_aspects={a["label"]: a["sentiment"] for a in sentiment["aspects"]},
    )
    db.add(review)

    # Update restaurant's aggregate rating/review count
    restaurant.review_count = (restaurant.review_count or 0) + 1
    restaurant.rating = round(
        ((restaurant.rating * (restaurant.review_count - 1)) + payload.rating) / restaurant.review_count, 2
    )

    db.commit()
    db.refresh(review)
    return _to_out(review)


def _to_out(r: Review) -> ReviewOut:
    return ReviewOut(
        id=r.id, restaurant_id=r.restaurant_id, user_id=r.user_id, rating=r.rating,
        comment=r.comment, food_quality=r.food_quality, service=r.service, portion=r.portion,
        price=r.price, cleanliness=r.cleanliness, status=r.status,
        sentiment_overall=r.sentiment_overall or "", sentiment_aspects=r.sentiment_aspects or {},
        created_at=r.created_at.isoformat(),
    )
