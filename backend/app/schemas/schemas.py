from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# ---------- User / Profile ----------
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    location: str
    goal: str
    dietary_preference: str
    spice_preference: str
    restrictions: List[str] = []
    favorite_cuisines: List[str] = []
    meal_type_preferences: List[str] = []

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    goal: Optional[str] = None
    dietary_preference: Optional[str] = None
    spice_preference: Optional[str] = None
    restrictions: Optional[List[str]] = None
    favorite_cuisines: Optional[List[str]] = None
    meal_type_preferences: Optional[List[str]] = None


# ---------- Restaurant / Menu ----------
class MenuItemOut(BaseModel):
    id: int
    restaurant_id: int
    name: str
    description: str
    category: str
    meal_type: str
    price: float
    ingredients: List[str] = []
    calories: int
    protein: float
    fat: float
    carbs: float
    sugar: float
    sodium: float
    spice_level: str
    vegetarian: bool
    vegan: bool
    dietary_tags: List[str] = []
    allergens: List[str] = []
    serving_size: str
    serves_persons: int
    image: str
    popular: bool = False

    class Config:
        from_attributes = True


class RestaurantOut(BaseModel):
    id: int
    name: str
    description: str
    address: str
    area: str
    latitude: float
    longitude: float
    rating: float
    review_count: int
    price_level: int
    cuisines: List[str] = []
    meal_types: List[str] = []
    distance_km: float
    opening_date: str
    is_open: bool
    image: str

    class Config:
        from_attributes = True


class RestaurantDetailOut(RestaurantOut):
    menu_items: List[MenuItemOut] = []


# ---------- Reviews ----------
class ReviewCreate(BaseModel):
    restaurant_id: int
    rating: float
    comment: str
    food_quality: float
    service: float
    portion: float
    price: float
    cleanliness: float


class ReviewOut(BaseModel):
    id: int
    restaurant_id: int
    user_id: int
    rating: float
    comment: str
    food_quality: float
    service: float
    portion: float
    price: float
    cleanliness: float
    status: str
    sentiment_overall: str
    sentiment_aspects: dict
    created_at: str

    class Config:
        from_attributes = True


# ---------- History / Favorites ----------
class HistoryCreate(BaseModel):
    restaurant_id: int
    food_id: int
    cost: float
    rating: Optional[float] = None


class HistoryOut(BaseModel):
    id: int
    restaurant_id: int
    food_id: int
    restaurant_name: str
    food_name: str
    cuisine: str
    cost: float
    rating: Optional[float]
    created_at: str

    class Config:
        from_attributes = True


class FavoriteToggle(BaseModel):
    restaurant_id: Optional[int] = None
    food_id: Optional[int] = None


# ---------- Recommendation ----------
class FindFoodRequest(BaseModel):
    budget: float
    persons: int = 1
    area: Optional[str] = None
    cuisines: Optional[List[str]] = None
    meal_types: Optional[List[str]] = None
    min_rating: Optional[float] = None
    max_distance: Optional[float] = None
    spice_preference: Optional[str] = None


class ScoreBreakdown(BaseModel):
    preference: float
    diet: float
    budget: float
    health: float
    history: float
    rating: float
    distance: float
    variety: float
    total: float


class MealLine(BaseModel):
    food_id: int
    name: str
    quantity: int
    unit_price: float
    line_total: float


class MealCombinationOut(BaseModel):
    items: List[MealLine]
    total: float
    remaining_budget: float
    budget_used_percent: float
    per_person: float


class RecommendationOut(BaseModel):
    restaurant: RestaurantOut
    food: MenuItemOut
    meal: Optional[MealCombinationOut]
    score: ScoreBreakdown
    diet_status: str
    explanation: List[str]

TokenResponse.model_rebuild()
