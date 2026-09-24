"""
SQLAlchemy models = the real database schema.

Tables: users, restaurants, menu_items, reviews, history_items, favorites.
Relationships are declared so SQLAlchemy can join automatically
(e.g. restaurant.menu_items, user.history).

See ../../schema.sql for the equivalent raw-SQL DDL (useful for your FYP
report / database diagram, or if you want to inspect the schema without
running Python).
"""
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    location = Column(String(120), default="Rawalpindi")

    # Diet / preference profile (optional, editable in Health & Diet page)
    goal = Column(String(60), default="General Healthy Eating")
    dietary_preference = Column(String(60), default="No Preference")
    spice_preference = Column(String(30), default="No Preference")
    restrictions = Column(JSON, default=list)          # e.g. ["Nut allergy"]
    favorite_cuisines = Column(JSON, default=list)      # e.g. ["Pakistani","BBQ"]
    meal_type_preferences = Column(JSON, default=list)  # e.g. ["Traditional","Healthy"]

    created_at = Column(DateTime, default=datetime.utcnow)

    history = relationship("HistoryItem", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, default="")
    address = Column(String(255), default="")
    area = Column(String(80), index=True)
    latitude = Column(Float, default=0.0)
    longitude = Column(Float, default=0.0)
    rating = Column(Float, default=4.0)
    review_count = Column(Integer, default=0)
    price_level = Column(Integer, default=2)  # 1-4
    cuisines = Column(JSON, default=list)      # e.g. ["Pakistani","BBQ"]
    meal_types = Column(JSON, default=list)    # e.g. ["Traditional","Fast Food"]
    distance_km = Column(Float, default=1.0)
    opening_date = Column(String(20), default="2020-01-01")
    is_open = Column(Boolean, default=True)
    image = Column(String(500), default="")

    menu_items = relationship("MenuItem", back_populates="restaurant", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="restaurant", cascade="all, delete-orphan")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, default="")
    category = Column(String(60), index=True)
    meal_type = Column(String(60), index=True, default="Traditional")  # Traditional / Chinese / Healthy / Fast Food ...
    price = Column(Float, nullable=False)
    ingredients = Column(JSON, default=list)
    calories = Column(Integer, default=0)
    protein = Column(Float, default=0)
    fat = Column(Float, default=0)
    carbs = Column(Float, default=0)
    sugar = Column(Float, default=0)
    sodium = Column(Float, default=0)
    spice_level = Column(String(20), default="Mild")
    vegetarian = Column(Boolean, default=False)
    vegan = Column(Boolean, default=False)
    dietary_tags = Column(JSON, default=list)
    allergens = Column(JSON, default=list)
    serving_size = Column(String(60), default="1 serving")
    serves_persons = Column(Integer, default=1)  # used by the budget optimizer for scaling
    image = Column(String(500), default="")
    popular = Column(Boolean, default=False)

    restaurant = relationship("Restaurant", back_populates="menu_items")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, default="")
    food_quality = Column(Float, default=0)
    service = Column(Float, default=0)
    portion = Column(Float, default=0)
    price = Column(Float, default=0)
    cleanliness = Column(Float, default=0)
    status = Column(String(20), default="approved")  # approved | hidden
    sentiment_overall = Column(String(20), default="")
    sentiment_aspects = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    restaurant = relationship("Restaurant", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class HistoryItem(Base):
    __tablename__ = "history_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    food_id = Column(Integer, ForeignKey("menu_items.id"))
    restaurant_name = Column(String(150))
    food_name = Column(String(150))
    cuisine = Column(String(60))
    cost = Column(Float, default=0)
    rating = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=True)
    food_id = Column(Integer, ForeignKey("menu_items.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")
