import {
  FoodItem, HistoryItem, Restaurant, Review, UserProfile, FavoriteEntry,
} from '../types';
import { restaurants as seedRestaurants } from '../data/restaurants';
import { menuItems as seedMenuItems } from '../data/menuItems';
import { seedReviews } from '../data/reviews';
import { seedHistory } from '../data/historySeed';
import { defaultUserProfile } from '../data/users';

/**
 * Centralized localStorage access. Nothing else in the app should call
 * localStorage directly -- this keeps persistence logic in one place and
 * makes it trivial to swap for real backend calls (see services/apiClient.ts)
 * when a backend is reachable.
 */
const KEYS = {
  profile: 'foodwise_user_profile',
  history: 'foodwise_history',
  favorites: 'foodwise_favorites',
  reviews: 'foodwise_reviews',
  restaurants: 'foodwise_restaurants',
  menuItems: 'foodwise_menu_items',
  token: 'foodwise_token',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Profile ----------
export function getUserProfile(): UserProfile {
  return read(KEYS.profile, defaultUserProfile);
}
export function saveUserProfile(profile: UserProfile) {
  write(KEYS.profile, profile);
}

// ---------- History ----------
export function getHistory(): HistoryItem[] {
  return read(KEYS.history, seedHistory);
}
export function addHistoryItem(item: HistoryItem) {
  const current = getHistory();
  write(KEYS.history, [item, ...current]);
}

// ---------- Favorites ----------
export function getFavorites(): FavoriteEntry[] {
  return read(KEYS.favorites, []);
}
export function toggleFavorite(entry: FavoriteEntry) {
  const current = getFavorites();
  const exists = current.some((f) => f.restaurantId === entry.restaurantId && f.foodId === entry.foodId);
  const next = exists
    ? current.filter((f) => !(f.restaurantId === entry.restaurantId && f.foodId === entry.foodId))
    : [...current, entry];
  write(KEYS.favorites, next);
  return !exists;
}

// ---------- Reviews ----------
export function getReviews(): Review[] {
  return read(KEYS.reviews, seedReviews);
}
export function addReview(review: Review) {
  const current = getReviews();
  write(KEYS.reviews, [review, ...current]);
}
export function updateReviewStatus(id: string, status: Review['status']) {
  const current = getReviews();
  write(KEYS.reviews, current.map((r) => (r.id === id ? { ...r, status } : r)));
}
export function deleteReview(id: string) {
  write(KEYS.reviews, getReviews().filter((r) => r.id !== id));
}

// ---------- Restaurants / Menu (admin-editable demo dataset) ----------
export function getRestaurants(): Restaurant[] {
  return read(KEYS.restaurants, seedRestaurants);
}
export function saveRestaurants(list: Restaurant[]) {
  write(KEYS.restaurants, list);
}
export function getMenuItems(): FoodItem[] {
  return read(KEYS.menuItems, seedMenuItems);
}
export function saveMenuItems(list: FoodItem[]) {
  write(KEYS.menuItems, list);
}

// ---------- Auth token (used when a backend is connected) ----------
export function getToken(): string | null {
  return localStorage.getItem(KEYS.token);
}
export function saveToken(token: string) {
  localStorage.setItem(KEYS.token, token);
}
export function clearToken() {
  localStorage.removeItem(KEYS.token);
}

// ---------- Demo data management ----------
export function resetDemoData() {
  write(KEYS.restaurants, seedRestaurants);
  write(KEYS.menuItems, seedMenuItems);
  write(KEYS.reviews, seedReviews);
  write(KEYS.history, seedHistory);
  write(KEYS.favorites, []);
  write(KEYS.profile, defaultUserProfile);
}

export function exportData(): string {
  return JSON.stringify({
    profile: getUserProfile(),
    history: getHistory(),
    favorites: getFavorites(),
    reviews: getReviews(),
    restaurants: getRestaurants(),
    menuItems: getMenuItems(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (parsed.profile) write(KEYS.profile, parsed.profile);
    if (parsed.history) write(KEYS.history, parsed.history);
    if (parsed.favorites) write(KEYS.favorites, parsed.favorites);
    if (parsed.reviews) write(KEYS.reviews, parsed.reviews);
    if (parsed.restaurants) write(KEYS.restaurants, parsed.restaurants);
    if (parsed.menuItems) write(KEYS.menuItems, parsed.menuItems);
    return { success: true };
  } catch (e) {
    return { success: false, error: 'The selected file is not valid FoodWise export data.' };
  }
}
