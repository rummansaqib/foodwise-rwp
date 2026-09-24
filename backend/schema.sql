-- FoodWise RWP — Database Schema (reference DDL)
-- This mirrors backend/app/models/db_models.py exactly.
-- SQLAlchemy creates these tables automatically at runtime; this file is
-- provided for your FYP report / ER diagram and for anyone who wants to
-- inspect or recreate the schema directly in SQLite/PostgreSQL.

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    location VARCHAR(120) DEFAULT 'Rawalpindi',
    goal VARCHAR(60) DEFAULT 'General Healthy Eating',
    dietary_preference VARCHAR(60) DEFAULT 'No Preference',
    spice_preference VARCHAR(30) DEFAULT 'No Preference',
    restrictions JSON,
    favorite_cuisines JSON,
    meal_type_preferences JSON,
    created_at DATETIME
);

CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    area VARCHAR(80),
    latitude FLOAT,
    longitude FLOAT,
    rating FLOAT DEFAULT 4.0,
    review_count INTEGER DEFAULT 0,
    price_level INTEGER DEFAULT 2,
    cuisines JSON,
    meal_types JSON,
    distance_km FLOAT DEFAULT 1.0,
    opening_date VARCHAR(20),
    is_open BOOLEAN DEFAULT 1,
    image VARCHAR(500)
);

CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(60),
    meal_type VARCHAR(60) DEFAULT 'Traditional',
    price FLOAT NOT NULL,
    ingredients JSON,
    calories INTEGER DEFAULT 0,
    protein FLOAT DEFAULT 0,
    fat FLOAT DEFAULT 0,
    carbs FLOAT DEFAULT 0,
    sugar FLOAT DEFAULT 0,
    sodium FLOAT DEFAULT 0,
    spice_level VARCHAR(20) DEFAULT 'Mild',
    vegetarian BOOLEAN DEFAULT 0,
    vegan BOOLEAN DEFAULT 0,
    dietary_tags JSON,
    allergens JSON,
    serving_size VARCHAR(60),
    serves_persons INTEGER DEFAULT 1,
    image VARCHAR(500),
    popular BOOLEAN DEFAULT 0
);

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating FLOAT NOT NULL,
    comment TEXT,
    food_quality FLOAT,
    service FLOAT,
    portion FLOAT,
    price FLOAT,
    cleanliness FLOAT,
    status VARCHAR(20) DEFAULT 'approved',
    sentiment_overall VARCHAR(20),
    sentiment_aspects JSON,
    created_at DATETIME
);

CREATE TABLE history_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(id),
    food_id INTEGER REFERENCES menu_items(id),
    restaurant_name VARCHAR(150),
    food_name VARCHAR(150),
    cuisine VARCHAR(60),
    cost FLOAT DEFAULT 0,
    rating FLOAT,
    created_at DATETIME
);

CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(id),
    food_id INTEGER REFERENCES menu_items(id),
    created_at DATETIME
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_history_user ON history_items(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
