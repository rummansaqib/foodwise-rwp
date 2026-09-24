import {
  FindFoodParams, FoodItem, HistoryItem, Recommendation, Restaurant, ScoreBreakdown, UserProfile,
} from '../types';
import { checkDietCompatibility } from './dietEngine';
import { optimizeMeal } from './budgetOptimizer';

/**
 * FoodWise Recommendation Engine (frontend / offline-capable copy).
 *
 * Architecture note: this weighted-scoring module is intentionally
 * transparent so it can be demonstrated and evaluated in an FYP defense.
 * It mirrors backend/app/ai/recommendation_engine.py exactly (same
 * weights, same formulas) so results are consistent whether the app is
 * running standalone (GitHub Pages, no backend) or connected to the real
 * FastAPI + SQLite backend. It is structured so the scoring step could
 * later be replaced or augmented with a trained ranking model without
 * changing any of the UI code that calls generateRecommendations().
 *
 * Weights (out of 100): Preference 20, Diet 20, Budget 15, Health 15,
 * History 10, Rating 10, Distance 5, Variety 5.
 */

export function calculatePreferenceScore(restaurant: Restaurant, profile: UserProfile): number {
  const cuisineOverlap = restaurant.cuisines.filter((c) => profile.favoriteCuisines.includes(c)).length;
  const mealTypeMatch = restaurant.mealTypes.some((mt) => profile.mealTypePreferences.includes(mt));
  const base = 14 + cuisineOverlap * 2 + (mealTypeMatch ? 2 : 0);
  return Math.min(20, cuisineOverlap || mealTypeMatch ? base : 9);
}

export function calculateFoodScore(food: FoodItem, profile: UserProfile) {
  const { status, reasons } = checkDietCompatibility(food, profile.diet);
  const scoreMap = { compatible: 19, warning: 11, incompatible: 2 } as const;
  let score: number = scoreMap[status];
  if (profile.diet.dietaryPreference !== 'No Preference' && food.dietaryTags.includes(profile.diet.dietaryPreference)) {
    score = Math.min(20, score + 1);
  }
  return { score, status, reasons };
}

export function calculateBudgetScore(mealTotal: number | null, budget: number): number {
  if (mealTotal === null || mealTotal > budget) return 0;
  const usage = mealTotal / budget;
  return Math.round(Math.min(15, 8 + usage * 7));
}

export function calculateHealthScore(food: FoodItem, profile: UserProfile): number {
  switch (profile.diet.goal) {
    case 'High Protein':
      return food.protein >= 25 ? 15 : food.protein >= 12 ? 10 : 6;
    case 'Weight Loss':
      return food.calories <= 400 ? 15 : food.calories <= 600 ? 9 : 5;
    case 'Weight Gain':
      return food.calories >= 550 ? 15 : 9;
    default:
      return 12;
  }
}

export function calculateHistoryScore(restaurantName: string, history: HistoryItem[]): number {
  const count = history.filter((h) => h.restaurantName === restaurantName).length;
  if (count === 0) return 10;
  if (count === 1) return 8;
  if (count === 2) return 6;
  return 3;
}

export function calculateRatingScore(rating: number): number {
  return Math.round((rating / 5) * 10);
}

export function calculateDistanceScore(distance: number): number {
  if (distance <= 1.5) return 5;
  if (distance <= 3) return 4;
  if (distance <= 5) return 3;
  if (distance <= 8) return 2;
  return 1;
}

export function calculateVarietyScore(foodName: string, history: HistoryItem[]): number {
  const recentSame = history.filter((h) => h.foodName === foodName).length;
  if (recentSame >= 2) return 1;
  if (recentSame === 1) return 3;
  return 5;
}

export function generateExplanation(
  restaurant: Restaurant, food: FoodItem, mealTotal: number | null, profile: UserProfile,
  history: HistoryItem[], budget: number, persons: number,
): string[] {
  const notes: string[] = [];
  if (mealTotal !== null && mealTotal <= budget) notes.push(`Within your Rs. ${budget.toLocaleString()} budget`);
  notes.push(`Suitable for ${persons} ${persons === 1 ? 'person' : 'people'}`);

  const cuisineMatch = restaurant.cuisines.find((c) => profile.favoriteCuisines.includes(c));
  if (cuisineMatch) notes.push(`Matches your ${cuisineMatch} preference`);

  const mealTypeMatch = restaurant.mealTypes.find((mt) => profile.mealTypePreferences.includes(mt));
  if (mealTypeMatch) notes.push(`Matches your ${mealTypeMatch} meal type preference`);

  const { status } = checkDietCompatibility(food, profile.diet);
  if (status === 'compatible') notes.push(`Fits your ${profile.diet.goal} goal`);
  if (restaurant.rating >= 4.3) notes.push('Highly rated by customers');

  const visits = history.filter((h) => h.restaurantName === restaurant.name).length;
  if (visits === 0) notes.push("You haven't eaten here recently");
  else if (visits < 3) notes.push('A change from your most recent choices');

  return notes;
}

export function generateNegativeReasons(
  restaurant: Restaurant, food: FoodItem, mealTotal: number | null, profile: UserProfile,
  history: HistoryItem[], budget: number,
): string[] {
  const reasons: string[] = [];
  if (mealTotal === null || mealTotal > budget) reasons.push('Over your current budget');
  const { status, reasons: dietReasons } = checkDietCompatibility(food, profile.diet);
  if (status === 'incompatible') reasons.push(...dietReasons);
  const visits = history.filter((h) => h.restaurantName === restaurant.name).length;
  if (visits >= 3) reasons.push('You visited this restaurant frequently this week');
  if (restaurant.rating < 3.8) reasons.push('Lower preference match due to rating');
  return reasons;
}

interface GenerateParams {
  restaurants: Restaurant[];
  menuItems: FoodItem[];
  profile: UserProfile;
  history: HistoryItem[];
  params: FindFoodParams;
}

export function generateRecommendations({ restaurants, menuItems, profile, history, params }: GenerateParams): Recommendation[] {
  const { budget, persons } = params;
  const results: Recommendation[] = [];

  let candidateRestaurants = restaurants.filter((r) => r.isOpen);
  if (params.area && params.area !== 'Rawalpindi') {
    candidateRestaurants = candidateRestaurants.filter((r) => r.area === params.area);
  }
  if (params.cuisines?.length) {
    candidateRestaurants = candidateRestaurants.filter((r) => r.cuisines.some((c) => params.cuisines!.includes(c)));
  }
  if (params.minRating) {
    candidateRestaurants = candidateRestaurants.filter((r) => r.rating >= params.minRating!);
  }
  if (params.maxDistance && params.maxDistance !== 'Any') {
    candidateRestaurants = candidateRestaurants.filter((r) => r.distance <= (params.maxDistance as number));
  }

  for (const restaurant of candidateRestaurants) {
    let items = menuItems.filter((m) => m.restaurantId === restaurant.id);
    if (!items.length) continue;

    // Rule: hard-filter out foods that are dietary incompatible when ranking best food
    const sorted = [...items].sort((a, b) => {
      const aStatus = checkDietCompatibility(a, profile.diet).status;
      const bStatus = checkDietCompatibility(b, profile.diet).status;
      const penalty = { incompatible: 2, warning: 1, compatible: 0 } as const;
      return penalty[aStatus] - penalty[bStatus] || b.protein - a.protein;
    });
    const bestFood = sorted[0];
    const { status: dietStatus } = checkDietCompatibility(bestFood, profile.diet);

    const meal = optimizeMeal(items, budget, persons);
    if (!meal) continue; // Optimization: skip restaurants that can't fit the budget/group

    const preference = calculatePreferenceScore(restaurant, profile);
    const { score: dietScore } = calculateFoodScore(bestFood, profile);
    const budgetScore = calculateBudgetScore(meal.total, budget);
    const health = calculateHealthScore(bestFood, profile);
    const historyScore = calculateHistoryScore(restaurant.name, history);
    const rating = calculateRatingScore(restaurant.rating);
    const distance = calculateDistanceScore(restaurant.distance);
    const variety = calculateVarietyScore(bestFood.name, history);

    const total = preference + dietScore + budgetScore + health + historyScore + rating + distance + variety;

    const score: ScoreBreakdown = {
      preference, diet: dietScore, budget: budgetScore, health, history: historyScore,
      rating, distance, variety, total: Math.round(total),
    };

    results.push({
      restaurant,
      food: bestFood,
      meal,
      score,
      explanation: generateExplanation(restaurant, bestFood, meal.total, profile, history, budget, persons),
      negativeReasons: generateNegativeReasons(restaurant, bestFood, meal.total, profile, history, budget),
      tags: [],
    });
  }

  results.sort((a, b) => b.score.total - a.score.total);

  // Tag a few results for the "Best Matches" sections (Sec. 46)
  if (results.length) {
    results[0].tags.push('Best Overall');
    const cheapest = [...results].sort((a, b) => (a.meal?.total ?? Infinity) - (b.meal?.total ?? Infinity))[0];
    if (cheapest) cheapest.tags.push('Best Budget');
    const highestRated = [...results].sort((a, b) => b.restaurant.rating - a.restaurant.rating)[0];
    if (highestRated) highestRated.tags.push('Highest Rated');
    const nearest = [...results].sort((a, b) => a.restaurant.distance - b.restaurant.distance)[0];
    if (nearest) nearest.tags.push('Best for Group');
  }

  return results;
}
