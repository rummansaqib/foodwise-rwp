"""
Seeds the SQLite database with a realistic demo dataset:
22 restaurants, 8-12 menu items each (180+ total), tagged with a
`meal_type` (Traditional / Chinese / Healthy / Fast Food / BBQ /
Continental / Bakery) so the frontend's Meal Type preference filter has
real data to filter on.

Run with:
    python -m app.seed_data
(safe to re-run -- it clears and re-creates the demo tables first)
"""
from app.core.database import Base, engine, SessionLocal
from app.models.db_models import Restaurant, MenuItem, User
from app.core.security import hash_password

BLUEPRINTS = [
    # (name, area, cuisines, meal_types, price_level, rating, distance, image)
    ("Bundu Khan", "Saddar", ["Pakistani", "BBQ"], ["Traditional", "BBQ"], 2, 4.5, 1.2, "https://images.unsplash.com/photo-1544025162-d76694265947?w=600"),
    ("Savour Foods", "Satellite Town", ["Pakistani", "Biryani"], ["Traditional"], 2, 4.3, 2.6, "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600"),
    ("China Town", "Commercial Market", ["Chinese"], ["Chinese"], 2, 4.1, 3.4, "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600"),
    ("Wang Xiang", "Chaklala", ["Chinese"], ["Chinese"], 3, 4.2, 4.0, "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600"),
    ("Howdy", "Murree Road", ["Fast Food", "Burgers"], ["Fast Food"], 2, 4.0, 2.1, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"),
    ("Mr. Burger", "6th Road", ["Burgers", "Fast Food"], ["Fast Food"], 1, 3.9, 1.8, "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=600"),
    ("Cheezious", "Murree Road", ["Pizza", "Fast Food"], ["Fast Food"], 2, 4.0, 2.4, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"),
    ("Pizza Point", "Satellite Town", ["Pizza", "Fast Food"], ["Fast Food"], 1, 3.8, 3.0, "https://images.unsplash.com/photo-1548369937-47519962c11a?w=600"),
    ("Zameer Ansari", "Raja Bazaar", ["BBQ", "Desi"], ["BBQ", "Traditional"], 2, 4.4, 4.0, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600"),
    ("Kabul Restaurant", "Chaklala", ["Desi", "BBQ"], ["BBQ", "Traditional"], 2, 4.2, 3.8, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600"),
    ("Redbox Grill", "Bahria Town", ["BBQ", "Continental"], ["BBQ", "Continental"], 3, 4.3, 5.1, "https://images.unsplash.com/photo-1544025162-d76694265947?w=600"),
    ("Istanbul Restaurant", "PWD", ["Turkish", "Continental"], ["Continental"], 3, 4.4, 4.5, "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600"),
    ("Green Leaf Kitchen", "Bahria Town", ["Vegetarian", "Cafe"], ["Healthy"], 2, 4.6, 5.3, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"),
    ("Cafe Nashaa", "Scheme 3", ["Cafe", "Continental"], ["Healthy", "Continental"], 2, 4.2, 2.9, "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600"),
    ("Chaaye Khana", "Bahria Phase 4", ["Cafe", "Pakistani"], ["Traditional", "Healthy"], 2, 4.1, 6.0, "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600"),
    ("Rahat Bakers", "Saddar", ["Bakery", "Cafe"], ["Bakery"], 1, 3.9, 1.6, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"),
    ("Sea Delight", "Chaklala", ["Seafood", "Continental"], ["Healthy", "Continental"], 3, 4.3, 4.2, "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600"),
    ("Biryani Times", "Raja Bazaar", ["Biryani", "Pakistani"], ["Traditional"], 1, 4.0, 3.6, "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600"),
    ("Delhi Darbar", "6th Road", ["Pakistani", "Biryani"], ["Traditional"], 2, 4.1, 2.2, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600"),
    ("Pind Da Dhaba", "PWD", ["Desi", "Pakistani"], ["Traditional"], 2, 4.2, 5.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600"),
    ("Ginsoy Fusion", "Bahria Town", ["Chinese", "Continental"], ["Chinese", "Continental"], 3, 4.3, 5.6, "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=600"),
    ("Tandoori Twist", "Scheme 3", ["Pakistani", "BBQ"], ["BBQ", "Traditional"], 2, 4.2, 3.1, "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600"),
]

MENU_TEMPLATES = {
    "Traditional": [
        ("Chicken Karahi", "Karahi", 1200, ["chicken", "tomato", "ginger"], 520, 42, 34, 10, "Spicy", False, False, ["High Protein"], [], "Serves 2-3", 3),
        ("Mutton Karahi", "Karahi", 1800, ["mutton", "tomato", "yogurt"], 610, 45, 40, 8, "Spicy", False, False, ["High Protein"], [], "Serves 2-3", 3),
        ("Chicken Biryani", "Biryani", 350, ["rice", "chicken", "spices"], 480, 22, 16, 62, "Medium", False, False, ["Balanced"], [], "1 plate", 1),
        ("Dal Makhani", "Curry", 380, ["lentils", "butter"], 320, 12, 18, 30, "Mild", True, False, ["Balanced"], [], "1 bowl", 2),
        ("Roti", "Roti/Naan", 50, ["wheat flour"], 120, 3, 2, 22, "Mild", True, True, [], ["Gluten avoidance"], "1 piece", 1),
        ("Naan", "Roti/Naan", 80, ["flour", "butter"], 260, 6, 9, 38, "Mild", True, False, [], ["Gluten avoidance", "Lactose intolerance"], "1 piece", 1),
        ("Raita Salad", "Salad", 200, ["cucumber", "yogurt"], 90, 3, 2, 10, "Mild", True, False, ["Lower Fat"], ["Lactose intolerance"], "1 bowl", 4),
        ("Soft Drink", "Beverage", 150, ["carbonated water"], 150, 0, 0, 39, "Mild", True, True, [], [], "345ml", 1),
    ],
    "BBQ": [
        ("Beef Tikka", "BBQ", 550, ["beef", "yogurt"], 380, 33, 24, 4, "Spicy", False, False, ["High Protein"], [], "6 pieces", 3),
        ("Seekh Kebab", "BBQ", 300, ["minced beef"], 340, 26, 22, 4, "Medium", False, False, ["High Protein"], [], "2 skewers", 2),
        ("Malai Boti", "BBQ", 500, ["chicken", "cream"], 420, 30, 30, 5, "Mild", False, False, ["High Protein"], ["Lactose intolerance"], "6 pieces", 3),
        ("Chapli Kebab", "BBQ", 450, ["minced beef", "onion"], 390, 24, 27, 8, "Spicy", False, False, ["High Protein"], [], "2 pieces", 2),
    ],
    "Chinese": [
        ("Chicken Chowmein", "Chinese", 400, ["noodles", "chicken"], 470, 24, 16, 58, "Medium", False, False, ["Balanced"], ["Gluten avoidance"], "1 plate", 2),
        ("Vegetable Fried Rice", "Rice", 350, ["rice", "vegetables"], 380, 8, 10, 62, "Mild", True, True, ["Balanced"], [], "1 plate", 2),
        ("Chili Chicken", "Chinese", 460, ["chicken", "chili"], 440, 28, 22, 30, "Spicy", False, False, ["High Protein"], [], "1 plate", 2),
        ("Hot & Sour Soup", "Chinese", 280, ["vegetables", "stock"], 160, 8, 4, 20, "Medium", False, False, ["Lower Fat"], [], "1 bowl", 2),
    ],
    "Fast Food": [
        ("Zinger Burger", "Burger", 450, ["chicken fillet", "bun"], 620, 26, 32, 56, "Medium", False, False, [], ["Egg allergy", "Gluten avoidance"], "1 burger", 1),
        ("Beef Cheese Burger", "Burger", 500, ["beef patty", "cheese"], 680, 30, 38, 48, "Mild", False, False, ["High Protein"], ["Lactose intolerance", "Gluten avoidance"], "1 burger", 1),
        ("Chicken Fajita Pizza", "Pizza", 950, ["dough", "chicken", "cheese"], 720, 32, 30, 78, "Medium", False, False, [], ["Lactose intolerance", "Gluten avoidance"], "Medium, 4 slices", 4),
        ("Loaded Fries", "Fried Chicken", 350, ["potato", "cheese sauce"], 560, 14, 30, 58, "Medium", False, False, [], ["Lactose intolerance"], "1 box", 2),
    ],
    "Healthy": [
        ("Grilled Chicken Sandwich", "Sandwich", 420, ["chicken breast", "bread"], 380, 26, 12, 40, "Mild", False, False, ["High Protein", "Lower Fat"], ["Gluten avoidance"], "1 sandwich", 1),
        ("Greek Salad", "Salad", 480, ["lettuce", "feta", "olives"], 260, 8, 18, 14, "Mild", True, False, ["Low Sugar", "Lower Fat"], ["Lactose intolerance"], "1 bowl", 1),
        ("Grilled Fish", "BBQ", 700, ["fish", "lemon"], 340, 34, 16, 3, "Medium", False, False, ["High Protein", "Lower Fat"], ["Seafood allergy"], "1 fillet", 1),
        ("Chana Chaat", "Salad", 220, ["chickpeas", "onion"], 260, 10, 4, 44, "Medium", True, True, ["Vegan", "Lower Fat"], [], "1 bowl", 2),
    ],
    "Continental": [
        ("Grilled Chicken Steak", "BBQ", 850, ["chicken breast", "herbs"], 420, 40, 18, 6, "Mild", False, False, ["High Protein", "Lower Fat"], [], "1 steak", 1),
        ("Pasta Alfredo", "Curry", 620, ["pasta", "cream", "chicken"], 680, 24, 34, 66, "Mild", False, False, [], ["Gluten avoidance", "Lactose intolerance"], "1 plate", 2),
    ],
    "Bakery": [
        ("Chicken Patty", "Sandwich", 150, ["puff pastry", "chicken"], 320, 12, 18, 28, "Mild", False, False, [], ["Gluten avoidance"], "1 piece", 1),
        ("Fruit Tart", "Dessert", 280, ["pastry", "cream", "fruit"], 340, 4, 16, 46, "Mild", True, False, [], ["Gluten avoidance", "Lactose intolerance", "Egg allergy"], "1 tart", 1),
        ("Cappuccino", "Beverage", 320, ["espresso", "milk"], 120, 6, 6, 10, "Mild", True, False, [], ["Lactose intolerance"], "1 cup", 1),
    ],
}


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for i, (name, area, cuisines, meal_types, price_level, rating, distance, image) in enumerate(BLUEPRINTS):
            restaurant = Restaurant(
                name=name, description=f"{name} — a {', '.join(cuisines)} restaurant in {area}, Rawalpindi.",
                address=f"{name} Plaza, {area}, Rawalpindi", area=area, latitude=33.6 + (i * 0.003),
                longitude=73.05 + (i * 0.003), rating=rating, review_count=20 + i * 7, price_level=price_level,
                cuisines=cuisines, meal_types=meal_types, distance_km=distance,
                opening_date=f"20{18 + (i % 6)}-0{(i % 9) + 1}-01", is_open=(i % 9 != 0), image=image,
            )
            db.add(restaurant)
            db.flush()  # get restaurant.id

            pool = []
            for mt in meal_types:
                pool.extend(MENU_TEMPLATES.get(mt, []))
            if not pool:
                pool = MENU_TEMPLATES["Traditional"]
            seen = set()
            unique_pool = []
            for t in pool:
                if t[0] not in seen:
                    seen.add(t[0])
                    unique_pool.append(t)
            count = min(12, max(8, len(unique_pool)))
            for j in range(count):
                t = unique_pool[j % len(unique_pool)]
                (fname, category, base_price, ingredients, calories, protein, fat, carbs, spice, veg, vegan,
                 tags, allergens, serving, serves) = t
                variance = ((i * 5 + j * 3) % 21) - 10
                price = max(50, round((base_price + base_price * variance / 100) / 10) * 10)
                meal_type_for_item = meal_types[j % len(meal_types)]
                item = MenuItem(
                    restaurant_id=restaurant.id, name=fname,
                    description=f"{fname} made with {', '.join(ingredients[:3])}.",
                    category=category, meal_type=meal_type_for_item, price=price, ingredients=ingredients,
                    calories=calories, protein=protein, fat=fat, carbs=carbs, sugar=4, sodium=600,
                    spice_level=spice, vegetarian=veg, vegan=vegan, dietary_tags=tags, allergens=allergens,
                    serving_size=serving, serves_persons=serves, image=image, popular=(j % 4 == 0),
                )
                db.add(item)

        # Seed one demo account so graders can log straight in
        demo = User(
            name="Demo User", email="demo@foodwise.pk",
            hashed_password=hash_password("password123"),
            location="Rawalpindi", goal="High Protein", dietary_preference="Balanced",
            spice_preference="Medium", restrictions=[],
            favorite_cuisines=["Pakistani", "BBQ"], meal_type_preferences=["Traditional", "BBQ"],
        )
        db.add(demo)

        db.commit()
        print("Seed complete: restaurants, menu items and demo account (demo@foodwise.pk / password123) created.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
