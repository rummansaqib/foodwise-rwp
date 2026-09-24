import { HistoryItem } from '../types';

export interface BehaviorInsights {
  repeatedRestaurants: Record<string, number>;
  repeatedFoods: Record<string, number>;
  dominantCuisine: string | null;
  messages: string[];
}

/**
 * Detects restaurant/food/cuisine repetition in recent history and
 * produces variety-encouraging (never health-shaming) messages.
 */
export function analyzeHistory(history: HistoryItem[]): BehaviorInsights {
  const restaurantCounts: Record<string, number> = {};
  const foodCounts: Record<string, number> = {};
  const cuisineCounts: Record<string, number> = {};

  history.forEach((h) => {
    restaurantCounts[h.restaurantName] = (restaurantCounts[h.restaurantName] || 0) + 1;
    foodCounts[h.foodName] = (foodCounts[h.foodName] || 0) + 1;
    cuisineCounts[h.cuisine] = (cuisineCounts[h.cuisine] || 0) + 1;
  });

  const messages: string[] = [];

  Object.entries(restaurantCounts).forEach(([name, count]) => {
    if (count >= 3) messages.push(`You've chosen ${name} ${count} times this week. Want to explore something different?`);
  });
  Object.entries(foodCounts).forEach(([name, count]) => {
    if (count >= 2) messages.push(`You've chosen ${name} several times recently. Here are some different options you may enjoy.`);
  });

  let dominantCuisine: string | null = null;
  const cuisineEntries = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]);
  if (cuisineEntries.length) {
    dominantCuisine = cuisineEntries[0][0];
    if (history.length >= 4 && cuisineEntries[0][1] / history.length >= 0.6) {
      messages.push(`Most of your recent meals are ${dominantCuisine} cuisine. Try a highly rated different cuisine nearby.`);
    }
  }

  return {
    repeatedRestaurants: Object.fromEntries(Object.entries(restaurantCounts).filter(([, c]) => c >= 3)),
    repeatedFoods: Object.fromEntries(Object.entries(foodCounts).filter(([, c]) => c >= 2)),
    dominantCuisine,
    messages,
  };
}
