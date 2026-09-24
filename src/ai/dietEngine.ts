import { CompatibilityStatus, DietCheckResult, DietProfile, FoodItem } from '../types';

/**
 * Rule-based dietary compatibility checks.
 *
 * Hard constraints (selected allergens, vegetarian/vegan restrictions)
 * make a food "incompatible". A dietary *preference* that isn't matched
 * produces only a "warning" -- it's a soft nudge, never a hard block,
 * matching the requirement that health filters support decisions rather
 * than dictate them.
 */
export function checkDietCompatibility(food: FoodItem, diet: DietProfile): DietCheckResult {
  const reasons: string[] = [];

  for (const restriction of diet.restrictions) {
    if (restriction === 'Vegetarian' && !food.vegetarian) {
      reasons.push('Not vegetarian');
    } else if (restriction === 'Vegan' && !food.vegan) {
      reasons.push('Not vegan');
    } else if (food.allergens.includes(restriction)) {
      reasons.push(`Contains a selected allergen: ${restriction}`);
    }
  }

  if (reasons.length > 0) {
    return { status: 'incompatible', reasons };
  }

  if (diet.dietaryPreference && diet.dietaryPreference !== 'No Preference') {
    if (diet.dietaryPreference === 'Vegetarian' && !food.vegetarian) {
      return { status: 'warning', reasons: ['May not align with your vegetarian preference'] };
    }
    if (diet.dietaryPreference === 'Vegan' && !food.vegan) {
      return { status: 'warning', reasons: ['May not align with your vegan preference'] };
    }
    if (!food.dietaryTags.includes(diet.dietaryPreference) && diet.dietaryPreference !== 'Balanced') {
      return { status: 'warning', reasons: [`May not fully match your ${diet.dietaryPreference} preference`] };
    }
  }

  const status: CompatibilityStatus = 'compatible';
  return { status, reasons: ['Compatible with your selected diet'] };
}
