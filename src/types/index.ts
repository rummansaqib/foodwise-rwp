// ---------------------------------------------------------------------------
// FoodWise RWP — Core Type Definitions
// ---------------------------------------------------------------------------

export type DemoRole = 'user' | 'admin';

export type Goal =
  | 'Weight Loss'
  | 'Weight Gain'
  | 'Maintenance'
  | 'High Protein'
  | 'General Healthy Eating';

export type DietaryPreference =
  | 'No Preference'
  | 'Vegetarian'
  | 'Vegan'
  | 'High Protein'
  | 'Low Sugar'
  | 'Lower Fat'
  | 'Balanced';

export type DietaryRestriction =
  | 'Lactose intolerance'
  | 'Gluten avoidance'
  | 'Nut allergy'
  | 'Egg allergy'
  | 'Seafood allergy'
  | 'Vegetarian'
  | 'Vegan';

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy';
export type SpicePreference = SpiceLevel | 'No Preference';

export type CuisineType =
  | 'Pakistani'
  | 'Chinese'
  | 'Fast Food'
  | 'BBQ'
  | 'Burgers'
  | 'Pizza'
  | 'Desi'
  | 'Biryani'
  | 'Turkish'
  | 'Continental'
  | 'Cafe'
  | 'Bakery'
  | 'Seafood'
  | 'Vegetarian';

export type FoodCategory =
  | 'Biryani'
  | 'Karahi'
  | 'BBQ'
  | 'Burger'
  | 'Pizza'
  | 'Fried Chicken'
  | 'Chinese'
  | 'Sandwich'
  | 'Wrap'
  | 'Salad'
  | 'Rice'
  | 'Curry'
  | 'Roti/Naan'
  | 'Dessert'
  | 'Beverage'
  | 'Breakfast';

export type MealType =
  | 'Traditional'
  | 'Chinese'
  | 'Healthy'
  | 'Fast Food'
  | 'BBQ'
  | 'Continental'
  | 'Bakery';

export type RwpArea =
  | 'Saddar'
  | 'Commercial Market'
  | 'Bahria Town'
  | 'PWD'
  | 'Chaklala'
  | 'Satellite Town'
  | 'Raja Bazaar'
  | 'Murree Road'
  | 'Scheme 3'
  | 'Bahria Phase 4'
  | '6th Road';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  area: RwpArea;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4; // Rs symbols
  cuisines: CuisineType[];
  mealTypes: MealType[];
  distance: number; // km from demo "current location"
  openingDate: string; // ISO date
  isOpen: boolean;
  image: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  category: FoodCategory;
  mealType: MealType;
  price: number;
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
  servesPersons: number;
  image: string;
  popular?: boolean;
}

export interface DietProfile {
  goal: Goal;
  dietaryPreference: DietaryPreference;
  restrictions: DietaryRestriction[];
  spicePreference: SpicePreference;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  location: string;
  favoriteCuisines: CuisineType[];
  mealTypePreferences: MealType[];
  diet: DietProfile;
  joinedDate: string;
}

export interface AuthState {
  token: string | null;
  backendAvailable: boolean;
  isAuthenticated: boolean;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  foodQuality: number;
  service: number;
  portion: number;
  price: number;
  cleanliness: number;
  date: string;
  status: 'approved' | 'hidden';
  sentiment?: SentimentResult;
}

export interface HistoryItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  foodId: string;
  foodName: string;
  cuisine: CuisineType;
  date: string; // ISO
  rating?: number;
  cost?: number;
}

export interface ScoreBreakdown {
  preference: number; // out of 20
  diet: number; // out of 20
  budget: number; // out of 15
  health: number; // out of 15
  history: number; // out of 10
  rating: number; // out of 10
  distance: number; // out of 5
  variety: number; // out of 5
  total: number; // out of 100
}

export type CompatibilityStatus = 'compatible' | 'warning' | 'incompatible';

export interface DietCheckResult {
  status: CompatibilityStatus;
  reasons: string[];
}

export interface MealItemLine {
  food: FoodItem;
  quantity: number;
  lineTotal: number;
}

export interface MealCombination {
  items: MealItemLine[];
  total: number;
  remainingBudget: number;
  budgetUsedPercent: number;
  perPerson: number;
}

export interface Recommendation {
  restaurant: Restaurant;
  food: FoodItem;
  meal: MealCombination | null;
  score: ScoreBreakdown;
  explanation: string[];
  negativeReasons: string[];
  tags: string[]; // e.g. "Best Overall", "Best Budget"
}

export interface FindFoodParams {
  budget: number;
  persons: number;
  area?: RwpArea | 'Rawalpindi';
  cuisines?: CuisineType[];
  mealTypes?: MealType[];
  goal?: Goal;
  dietaryPreference?: DietaryPreference;
  spicePreference?: SpicePreference;
  minRating?: number;
  maxDistance?: number | 'Any';
}

export interface WeatherContext {
  temperature: number;
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Hot' | 'Cold';
}

export interface AppContextData {
  weather: WeatherContext;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Late Night';
}

export interface SentimentAspect {
  label: 'Taste' | 'Service' | 'Portion' | 'Price' | 'Cleanliness' | 'Ambience';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface SentimentResult {
  overall: 'Positive' | 'Negative' | 'Mixed' | 'Neutral';
  aspects: SentimentAspect[];
}

export interface RestaurantInsight {
  restaurantId: string;
  taste: number; // 1-5 derived star rating
  portion: number;
  price: number;
  service: number;
  cleanliness: number;
  reviewsAnalyzed: number;
}

export interface AdminUserRow {
  id: string;
  name: string;
  goal: Goal;
  favoriteCuisine: CuisineType;
  mealsThisWeek: number;
  lastActive: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface FavoriteEntry {
  restaurantId?: string;
  foodId?: string;
}
