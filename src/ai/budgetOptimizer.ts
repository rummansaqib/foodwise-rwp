import { FoodItem, MealCombination, MealItemLine } from '../types';

/**
 * Budget & Group Meal Optimizer.
 *
 * Greedy constructive heuristic (documented in the backend Python
 * equivalent too): pick the highest-protein main course, scale its
 * quantity to the group size, then keep adding sides/drinks/roti while
 * they still fit the remaining budget. Never returns a combination that
 * exceeds the budget.
 */
export function optimizeMeal(menuItems: FoodItem[], budget: number, persons: number): MealCombination | null {
  if (!menuItems.length || budget <= 0 || persons <= 0) return null;

  const mains = menuItems.filter((m) => !['Beverage', 'Salad', 'Roti/Naan'].includes(m.category));
  const candidates = mains.length ? mains : menuItems;
  let main = [...candidates].sort((a, b) => b.protein - a.protein)[0];

  let mainQty = Math.max(1, Math.ceil(persons / Math.max(1, main.servesPersons)));
  let mainCost = main.price * mainQty;

  if (mainCost > budget) {
    const cheapest = [...menuItems].sort((a, b) => a.price - b.price)[0];
    if (cheapest.price > budget) return null;
    main = cheapest;
    mainQty = 1;
    mainCost = cheapest.price;
  }

  const lines: MealItemLine[] = [{ food: main, quantity: mainQty, lineTotal: mainCost }];
  let total = mainCost;

  const others = menuItems
    .filter((m) => m.id !== main.id)
    .sort((a, b) => {
      const aSide = ['Roti/Naan', 'Salad', 'Beverage'].includes(a.category) ? 0 : 1;
      const bSide = ['Roti/Naan', 'Salad', 'Beverage'].includes(b.category) ? 0 : 1;
      return aSide - bSide || a.price - b.price;
    });

  for (const item of others) {
    const qty = Math.max(1, Math.ceil(persons / Math.max(1, item.servesPersons)));
    const cost = item.price * qty;
    if (total + cost <= budget) {
      lines.push({ food: item, quantity: qty, lineTotal: cost });
      total += cost;
    }
  }

  if (total > budget) return null;

  return {
    items: lines,
    total: Math.round(total),
    remainingBudget: Math.round(budget - total),
    budgetUsedPercent: Math.round((total / budget) * 100),
    perPerson: Math.round(total / persons),
  };
}
