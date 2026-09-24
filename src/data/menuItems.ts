import { DietaryPreference, DietaryRestriction, FoodCategory, FoodItem, MealType, SpiceLevel } from '../types';
import { restaurants } from './restaurants';

// Maps each food category to a default Meal Type tag used by the
// Meal Type preference filter (Traditional / Chinese / Healthy / Fast
// Food / BBQ / Continental / Bakery).
const CATEGORY_TO_MEAL_TYPE: Partial<Record<FoodCategory, MealType>> = {
  Biryani: 'Traditional', Karahi: 'Traditional', 'Roti/Naan': 'Traditional', Curry: 'Traditional',
  BBQ: 'BBQ',
  Chinese: 'Chinese',
  Burger: 'Fast Food', Pizza: 'Fast Food', 'Fried Chicken': 'Fast Food', Sandwich: 'Fast Food',
  Salad: 'Healthy', Wrap: 'Healthy',
  Dessert: 'Bakery', Beverage: 'Continental', Rice: 'Traditional', Breakfast: 'Continental',
};

// ---------------------------------------------------------------------------
// DEMO MENU DATA
// Nutrition values shown are demonstration data for prototype purposes only.
// Actual values should be verified with restaurants/nutrition sources.
// ---------------------------------------------------------------------------

interface FoodTemplate {
  name: string;
  category: FoodCategory;
  basePrice: number;
  ingredients: string[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
  sodium: number;
  spiceLevel: SpiceLevel;
  vegetarian: boolean;
  vegan: boolean;
  dietaryTags: DietaryPreference[];
  allergens: DietaryRestriction[];
  servingSize: string;
  image: string;
}

const IMG = {
  karahi: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600',
  bbq: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
  fried: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600',
  chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600',
  sandwich: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600',
  wrap: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
  rice: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600',
  curry: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600',
  roti: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600',
  drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600',
};

// Base templates by cuisine — combined per-restaurant to build a varied menu.
const TEMPLATES: Record<string, FoodTemplate[]> = {
  Pakistani: [
    { name: 'Chicken Karahi', category: 'Karahi', basePrice: 1200, ingredients: ['chicken', 'tomato', 'ginger', 'garlic', 'green chili'], calories: 520, protein: 42, fat: 34, carbs: 10, sugar: 4, sodium: 780, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: 'Serves 2-3', image: IMG.karahi },
    { name: 'Mutton Karahi', category: 'Karahi', basePrice: 1800, ingredients: ['mutton', 'tomato', 'yogurt', 'spices'], calories: 610, protein: 45, fat: 40, carbs: 8, sugar: 3, sodium: 820, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: 'Serves 2-3', image: IMG.karahi },
    { name: 'Chicken Biryani', category: 'Biryani', basePrice: 350, ingredients: ['basmati rice', 'chicken', 'yogurt', 'spices'], calories: 480, protein: 22, fat: 16, carbs: 62, sugar: 5, sodium: 690, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['Balanced'], allergens: [], servingSize: '1 plate', image: IMG.biryani },
    { name: 'Chapli Kebab', category: 'BBQ', basePrice: 450, ingredients: ['minced beef', 'onion', 'coriander', 'spices'], calories: 390, protein: 24, fat: 27, carbs: 8, sugar: 1, sodium: 640, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: '2 pieces', image: IMG.bbq },
    { name: 'Seekh Kebab', category: 'BBQ', basePrice: 300, ingredients: ['minced beef', 'spices'], calories: 340, protein: 26, fat: 22, carbs: 4, sugar: 1, sodium: 560, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: '2 skewers', image: IMG.bbq },
    { name: 'Dal Makhani', category: 'Curry', basePrice: 380, ingredients: ['black lentils', 'butter', 'cream'], calories: 320, protein: 12, fat: 18, carbs: 30, sugar: 4, sodium: 480, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: ['Balanced'], allergens: [], servingSize: '1 bowl', image: IMG.curry },
    { name: 'Roti', category: 'Roti/Naan', basePrice: 50, ingredients: ['wheat flour'], calories: 120, protein: 3, fat: 2, carbs: 22, sugar: 0, sodium: 140, spiceLevel: 'Mild', vegetarian: true, vegan: true, dietaryTags: ['No Preference' as DietaryPreference], allergens: ['Gluten avoidance'], servingSize: '1 piece', image: IMG.roti },
    { name: 'Naan', category: 'Roti/Naan', basePrice: 80, ingredients: ['flour', 'yogurt', 'butter'], calories: 260, protein: 6, fat: 9, carbs: 38, sugar: 2, sodium: 250, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Lactose intolerance'], servingSize: '1 piece', image: IMG.roti },
    { name: 'Raita Salad', category: 'Salad', basePrice: 200, ingredients: ['cucumber', 'onion', 'yogurt'], calories: 90, protein: 3, fat: 2, carbs: 10, sugar: 4, sodium: 210, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: ['Low Sugar', 'Lower Fat'], allergens: ['Lactose intolerance'], servingSize: '1 bowl', image: IMG.salad },
    { name: 'Soft Drink', category: 'Beverage', basePrice: 150, ingredients: ['carbonated water', 'sugar'], calories: 150, protein: 0, fat: 0, carbs: 39, sugar: 39, sodium: 20, spiceLevel: 'Mild', vegetarian: true, vegan: true, dietaryTags: [], allergens: [], servingSize: '345ml', image: IMG.drink },
  ],
  BBQ: [
    { name: 'Malai Boti', category: 'BBQ', basePrice: 500, ingredients: ['chicken', 'cream', 'spices'], calories: 420, protein: 30, fat: 30, carbs: 5, sugar: 2, sodium: 610, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: ['Lactose intolerance'], servingSize: '6 pieces', image: IMG.bbq },
    { name: 'Beef Tikka', category: 'BBQ', basePrice: 550, ingredients: ['beef', 'yogurt', 'spices'], calories: 380, protein: 33, fat: 24, carbs: 4, sugar: 1, sodium: 590, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: '6 pieces', image: IMG.bbq },
    { name: 'Grilled Fish', category: 'BBQ', basePrice: 700, ingredients: ['fish', 'lemon', 'spices'], calories: 340, protein: 34, fat: 16, carbs: 3, sugar: 0, sodium: 520, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['High Protein', 'Lower Fat'], allergens: ['Seafood allergy'], servingSize: '1 fillet', image: IMG.bbq },
  ],
  Biryani: [
    { name: 'Mutton Biryani', category: 'Biryani', basePrice: 450, ingredients: ['basmati rice', 'mutton', 'spices'], calories: 560, protein: 28, fat: 22, carbs: 60, sugar: 5, sodium: 720, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: '1 plate', image: IMG.biryani },
    { name: 'Vegetable Pulao', category: 'Rice', basePrice: 250, ingredients: ['rice', 'mixed vegetables'], calories: 340, protein: 7, fat: 8, carbs: 58, sugar: 4, sodium: 420, spiceLevel: 'Mild', vegetarian: true, vegan: true, dietaryTags: ['Balanced'], allergens: [], servingSize: '1 plate', image: IMG.rice },
  ],
  Chinese: [
    { name: 'Chicken Chowmein', category: 'Chinese', basePrice: 400, ingredients: ['noodles', 'chicken', 'vegetables', 'soy sauce'], calories: 470, protein: 24, fat: 16, carbs: 58, sugar: 6, sodium: 900, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['Balanced'], allergens: ['Gluten avoidance'], servingSize: '1 plate', image: IMG.chinese },
    { name: 'Vegetable Fried Rice', category: 'Rice', basePrice: 350, ingredients: ['rice', 'vegetables', 'soy sauce'], calories: 380, protein: 8, fat: 10, carbs: 62, sugar: 3, sodium: 780, spiceLevel: 'Mild', vegetarian: true, vegan: true, dietaryTags: ['Balanced'], allergens: [], servingSize: '1 plate', image: IMG.rice },
    { name: 'Sweet & Sour Chicken', category: 'Chinese', basePrice: 480, ingredients: ['chicken', 'bell pepper', 'pineapple', 'sauce'], calories: 510, protein: 26, fat: 20, carbs: 52, sugar: 18, sodium: 680, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: [], servingSize: '1 plate', image: IMG.chinese },
    { name: 'Chili Chicken', category: 'Chinese', basePrice: 460, ingredients: ['chicken', 'chili', 'soy sauce'], calories: 440, protein: 28, fat: 22, carbs: 30, sugar: 6, sodium: 820, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: '1 plate', image: IMG.chinese },
    { name: 'Hot & Sour Soup', category: 'Chinese', basePrice: 280, ingredients: ['vegetables', 'chicken stock', 'vinegar'], calories: 160, protein: 8, fat: 4, carbs: 20, sugar: 3, sodium: 700, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['Lower Fat'], allergens: [], servingSize: '1 bowl', image: IMG.chinese },
  ],
  Burgers: [
    { name: 'Zinger Burger', category: 'Burger', basePrice: 450, ingredients: ['fried chicken fillet', 'bun', 'mayo', 'lettuce'], calories: 620, protein: 26, fat: 32, carbs: 56, sugar: 8, sodium: 980, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Egg allergy', 'Gluten avoidance'], servingSize: '1 burger', image: IMG.burger },
    { name: 'Beef Cheese Burger', category: 'Burger', basePrice: 500, ingredients: ['beef patty', 'cheese', 'bun'], calories: 680, protein: 30, fat: 38, carbs: 48, sugar: 6, sodium: 1020, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: ['Lactose intolerance', 'Gluten avoidance'], servingSize: '1 burger', image: IMG.burger },
    { name: 'Veggie Burger', category: 'Burger', basePrice: 380, ingredients: ['vegetable patty', 'bun', 'lettuce'], calories: 420, protein: 10, fat: 16, carbs: 54, sugar: 6, sodium: 690, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: ['Vegetarian' as DietaryPreference, 'Lower Fat'], allergens: ['Gluten avoidance'], servingSize: '1 burger', image: IMG.burger },
    { name: 'Loaded Fries', category: 'Fried Chicken', basePrice: 350, ingredients: ['potato', 'cheese sauce', 'chicken bits'], calories: 560, protein: 14, fat: 30, carbs: 58, sugar: 3, sodium: 890, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Lactose intolerance'], servingSize: '1 box', image: IMG.fried },
  ],
  Pizza: [
    { name: 'Chicken Fajita Pizza', category: 'Pizza', basePrice: 950, ingredients: ['dough', 'chicken', 'cheese', 'peppers'], calories: 720, protein: 32, fat: 30, carbs: 78, sugar: 6, sodium: 1050, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Lactose intolerance', 'Gluten avoidance'], servingSize: 'Medium, 4 slices', image: IMG.pizza },
    { name: 'Vegetable Supreme Pizza', category: 'Pizza', basePrice: 850, ingredients: ['dough', 'cheese', 'mixed vegetables'], calories: 610, protein: 20, fat: 22, carbs: 76, sugar: 7, sodium: 900, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: ['Vegetarian' as DietaryPreference], allergens: ['Lactose intolerance', 'Gluten avoidance'], servingSize: 'Medium, 4 slices', image: IMG.pizza },
    { name: 'Cheese Lovers Pizza', category: 'Pizza', basePrice: 900, ingredients: ['dough', '4 cheeses'], calories: 780, protein: 34, fat: 38, carbs: 72, sugar: 5, sodium: 1120, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Lactose intolerance', 'Gluten avoidance'], servingSize: 'Medium, 4 slices', image: IMG.pizza },
  ],
  Turkish: [
    { name: 'Adana Kebab', category: 'BBQ', basePrice: 650, ingredients: ['minced lamb', 'spices'], calories: 460, protein: 30, fat: 32, carbs: 6, sugar: 1, sodium: 700, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: [], servingSize: '1 skewer with rice', image: IMG.bbq },
    { name: 'Turkish Pide', category: 'Curry', basePrice: 700, ingredients: ['flatbread', 'cheese', 'minced meat'], calories: 640, protein: 26, fat: 28, carbs: 66, sugar: 4, sodium: 880, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Lactose intolerance'], servingSize: '1 pide', image: IMG.roti },
    { name: 'Mixed Mezze Platter', category: 'Salad', basePrice: 550, ingredients: ['hummus', 'baba ganoush', 'olives', 'pita'], calories: 380, protein: 10, fat: 18, carbs: 42, sugar: 5, sodium: 620, spiceLevel: 'Mild', vegetarian: true, vegan: true, dietaryTags: ['Balanced', 'Lower Fat'], allergens: ['Gluten avoidance'], servingSize: 'Sharing platter', image: IMG.salad },
  ],
  Cafe: [
    { name: 'Grilled Chicken Sandwich', category: 'Sandwich', basePrice: 420, ingredients: ['chicken breast', 'bread', 'lettuce'], calories: 380, protein: 26, fat: 12, carbs: 40, sugar: 4, sodium: 640, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: ['High Protein', 'Lower Fat'], allergens: ['Gluten avoidance'], servingSize: '1 sandwich', image: IMG.sandwich },
    { name: 'Chicken Caesar Wrap', category: 'Wrap', basePrice: 450, ingredients: ['chicken', 'tortilla', 'caesar dressing'], calories: 460, protein: 24, fat: 22, carbs: 40, sugar: 3, sodium: 720, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Egg allergy'], servingSize: '1 wrap', image: IMG.wrap },
    { name: 'Greek Salad', category: 'Salad', basePrice: 480, ingredients: ['lettuce', 'feta', 'olives', 'tomato'], calories: 260, protein: 8, fat: 18, carbs: 14, sugar: 6, sodium: 480, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: ['Vegetarian' as DietaryPreference, 'Low Sugar', 'Lower Fat'], allergens: ['Lactose intolerance'], servingSize: '1 bowl', image: IMG.salad },
    { name: 'Cappuccino', category: 'Beverage', basePrice: 320, ingredients: ['espresso', 'milk'], calories: 120, protein: 6, fat: 6, carbs: 10, sugar: 8, sodium: 90, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Lactose intolerance'], servingSize: '1 cup', image: IMG.drink },
    { name: 'Pancakes with Honey', category: 'Breakfast', basePrice: 480, ingredients: ['flour', 'egg', 'milk', 'honey'], calories: 520, protein: 12, fat: 16, carbs: 78, sugar: 30, sodium: 380, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Egg allergy', 'Lactose intolerance'], servingSize: '3 pancakes', image: IMG.breakfast },
    { name: 'Chocolate Brownie', category: 'Dessert', basePrice: 380, ingredients: ['flour', 'chocolate', 'butter', 'egg'], calories: 460, protein: 6, fat: 24, carbs: 56, sugar: 38, sodium: 220, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Egg allergy', 'Nut allergy'], servingSize: '1 slice', image: IMG.dessert },
  ],
  Bakery: [
    { name: 'Chicken Patty', category: 'Sandwich', basePrice: 150, ingredients: ['puff pastry', 'chicken'], calories: 320, protein: 12, fat: 18, carbs: 28, sugar: 3, sodium: 480, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance'], servingSize: '1 piece', image: IMG.sandwich },
    { name: 'Fruit Tart', category: 'Dessert', basePrice: 280, ingredients: ['pastry', 'cream', 'seasonal fruit'], calories: 340, protein: 4, fat: 16, carbs: 46, sugar: 28, sodium: 140, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Lactose intolerance', 'Egg allergy'], servingSize: '1 tart', image: IMG.dessert },
    { name: 'Bakery Fresh Croissant', category: 'Breakfast', basePrice: 180, ingredients: ['flour', 'butter'], calories: 280, protein: 5, fat: 15, carbs: 30, sugar: 5, sodium: 260, spiceLevel: 'Mild', vegetarian: true, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Lactose intolerance'], servingSize: '1 piece', image: IMG.breakfast },
  ],
  Vegetarian: [
    { name: 'Paneer Tikka', category: 'BBQ', basePrice: 480, ingredients: ['paneer', 'yogurt', 'spices'], calories: 380, protein: 18, fat: 26, carbs: 12, sugar: 3, sodium: 520, spiceLevel: 'Medium', vegetarian: true, vegan: false, dietaryTags: ['Vegetarian' as DietaryPreference, 'High Protein'], allergens: ['Lactose intolerance'], servingSize: '6 pieces', image: IMG.bbq },
    { name: 'Chana Chaat', category: 'Salad', basePrice: 220, ingredients: ['chickpeas', 'onion', 'tamarind'], calories: 260, protein: 10, fat: 4, carbs: 44, sugar: 6, sodium: 380, spiceLevel: 'Medium', vegetarian: true, vegan: true, dietaryTags: ['Vegan' as DietaryPreference, 'Lower Fat'], allergens: [], servingSize: '1 bowl', image: IMG.salad },
    { name: 'Vegetable Biryani', category: 'Biryani', basePrice: 320, ingredients: ['rice', 'mixed vegetables', 'spices'], calories: 360, protein: 8, fat: 10, carbs: 60, sugar: 4, sodium: 460, spiceLevel: 'Medium', vegetarian: true, vegan: true, dietaryTags: ['Vegan' as DietaryPreference, 'Balanced'], allergens: [], servingSize: '1 plate', image: IMG.biryani },
  ],
  Seafood: [
    { name: 'Grilled Prawns', category: 'BBQ', basePrice: 900, ingredients: ['prawns', 'garlic', 'lemon'], calories: 320, protein: 36, fat: 12, carbs: 4, sugar: 0, sodium: 640, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['High Protein', 'Lower Fat'], allergens: ['Seafood allergy'], servingSize: '8 pieces', image: IMG.bbq },
    { name: 'Fish & Chips', category: 'Fried Chicken', basePrice: 650, ingredients: ['fish fillet', 'batter', 'potato'], calories: 640, protein: 28, fat: 34, carbs: 56, sugar: 2, sodium: 780, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Seafood allergy', 'Gluten avoidance'], servingSize: '1 plate', image: IMG.fried },
    { name: 'Prawn Masala Curry', category: 'Curry', basePrice: 780, ingredients: ['prawns', 'tomato', 'spices'], calories: 380, protein: 32, fat: 18, carbs: 14, sugar: 4, sodium: 700, spiceLevel: 'Spicy', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: ['Seafood allergy'], servingSize: '1 bowl', image: IMG.curry },
  ],
  Continental: [
    { name: 'Grilled Chicken Steak', category: 'BBQ', basePrice: 850, ingredients: ['chicken breast', 'herbs'], calories: 420, protein: 40, fat: 18, carbs: 6, sugar: 1, sodium: 560, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: ['High Protein', 'Lower Fat'], allergens: [], servingSize: '1 steak with side', image: IMG.bbq },
    { name: 'Pasta Alfredo', category: 'Curry', basePrice: 620, ingredients: ['pasta', 'cream', 'cheese', 'chicken'], calories: 680, protein: 24, fat: 34, carbs: 66, sugar: 6, sodium: 780, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Lactose intolerance'], servingSize: '1 plate', image: IMG.curry },
  ],
  'Fast Food': [
    { name: 'Crispy Fried Chicken (2pc)', category: 'Fried Chicken', basePrice: 480, ingredients: ['chicken', 'breading'], calories: 540, protein: 32, fat: 34, carbs: 22, sugar: 1, sodium: 900, spiceLevel: 'Medium', vegetarian: false, vegan: false, dietaryTags: ['High Protein'], allergens: ['Gluten avoidance'], servingSize: '2 pieces', image: IMG.fried },
    { name: 'Club Sandwich', category: 'Sandwich', basePrice: 400, ingredients: ['chicken', 'egg', 'bread', 'mayo'], calories: 480, protein: 22, fat: 24, carbs: 42, sugar: 4, sodium: 760, spiceLevel: 'Mild', vegetarian: false, vegan: false, dietaryTags: [], allergens: ['Gluten avoidance', 'Egg allergy'], servingSize: '1 sandwich', image: IMG.sandwich },
  ],
};

const CATEGORY_SERVES: Partial<Record<FoodCategory, number>> = {
  Karahi: 3, Biryani: 1, BBQ: 3, Burger: 1, Pizza: 4, 'Fried Chicken': 2, Chinese: 2,
  Sandwich: 1, Wrap: 1, Salad: 4, Rice: 2, Curry: 2, 'Roti/Naan': 1, Dessert: 1, Beverage: 1, Breakfast: 1,
};

function priceJitter(base: number, i: number): number {
  const variance = ((i * 37) % 21) - 10; // deterministic -10..+10 percent-ish spread
  return Math.max(50, Math.round((base + (base * variance) / 100) / 10) * 10);
}

function buildMenuForRestaurant(restaurantId: string, cuisines: string[], seedOffset: number): FoodItem[] {
  const items: FoodItem[] = [];
  const pool: FoodTemplate[] = [];
  cuisines.forEach((c) => {
    if (TEMPLATES[c]) pool.push(...TEMPLATES[c]);
  });
  // Always add a couple of generic staples for variety/roti/drinks if not present
  if (!pool.some((t) => t.category === 'Roti/Naan')) pool.push(...TEMPLATES.Pakistani.filter((t) => t.category === 'Roti/Naan'));
  if (!pool.some((t) => t.category === 'Beverage')) pool.push(...TEMPLATES.Pakistani.filter((t) => t.category === 'Beverage'));

  // De-duplicate by name, cap at 12, floor at 8 by repeating pool if needed
  const seen = new Set<string>();
  const unique = pool.filter((t) => {
    if (seen.has(t.name)) return false;
    seen.add(t.name);
    return true;
  });

  const count = Math.min(12, Math.max(8, unique.length));
  for (let i = 0; i < count; i++) {
    const t = unique[i % unique.length];
    const idx = i + seedOffset;
    items.push({
      id: `${restaurantId}-f${i + 1}`,
      restaurantId,
      name: t.name,
      description: `${t.name} made with ${t.ingredients.slice(0, 3).join(', ')}.`,
      category: t.category,
      mealType: CATEGORY_TO_MEAL_TYPE[t.category] || 'Traditional',
      price: priceJitter(t.basePrice, idx),
      ingredients: t.ingredients,
      calories: t.calories,
      protein: t.protein,
      fat: t.fat,
      carbs: t.carbs,
      sugar: t.sugar,
      sodium: t.sodium,
      spiceLevel: t.spiceLevel,
      vegetarian: t.vegetarian,
      vegan: t.vegan,
      dietaryTags: t.dietaryTags,
      allergens: t.allergens,
      servingSize: t.servingSize,
      servesPersons: CATEGORY_SERVES[t.category] || 1,
      image: t.image,
      popular: idx % 4 === 0,
    });
  }
  return items;
}

function generateAllMenuItems(): FoodItem[] {
  const all: FoodItem[] = [];
  restaurants.forEach((r, i) => {
    all.push(...buildMenuForRestaurant(r.id, r.cuisines, i * 3));
  });
  return all;
}

export const menuItems: FoodItem[] = generateAllMenuItems();

export function getMenuForRestaurant(restaurantId: string, items: FoodItem[] = menuItems): FoodItem[] {
  return items.filter((f) => f.restaurantId === restaurantId);
}
