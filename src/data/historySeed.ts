import { HistoryItem } from '../types';
import { restaurants } from './restaurants';
import { menuItems } from './menuItems';

function findFood(restaurantId: string, index = 0) {
  const items = menuItems.filter((m) => m.restaurantId === restaurantId);
  return items[index % items.length];
}

// Deliberately includes 3 visits to the same restaurant (Bundu Khan, r1)
// this week so the Behavior Analyzer's repetition detection has something
// to demonstrate immediately for the teacher/demo.
export function buildSeedHistory(): HistoryItem[] {
  const bundu = restaurants.find((r) => r.id === 'r1')!;
  const savour = restaurants.find((r) => r.id === 'r2')!;
  const days = [6, 5, 3, 1]; // days ago
  const bunduFood = findFood(bundu.id, 0);
  const savourFood = findFood(savour.id, 0);

  const items: HistoryItem[] = [
    { id: 'h1', restaurantId: bundu.id, restaurantName: bundu.name, foodId: bunduFood.id, foodName: bunduFood.name, cuisine: 'Pakistani', date: new Date(Date.now() - days[0] * 86400000).toISOString(), cost: bunduFood.price },
    { id: 'h2', restaurantId: bundu.id, restaurantName: bundu.name, foodId: bunduFood.id, foodName: bunduFood.name, cuisine: 'Pakistani', date: new Date(Date.now() - days[1] * 86400000).toISOString(), cost: bunduFood.price },
    { id: 'h3', restaurantId: savour.id, restaurantName: savour.name, foodId: savourFood.id, foodName: savourFood.name, cuisine: 'Pakistani', date: new Date(Date.now() - days[2] * 86400000).toISOString(), cost: savourFood.price },
    { id: 'h4', restaurantId: bundu.id, restaurantName: bundu.name, foodId: bunduFood.id, foodName: bunduFood.name, cuisine: 'Pakistani', date: new Date(Date.now() - days[3] * 86400000).toISOString(), cost: bunduFood.price },
  ];
  return items;
}

export const seedHistory: HistoryItem[] = buildSeedHistory();
