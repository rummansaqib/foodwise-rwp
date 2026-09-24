import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DemoRole, FavoriteEntry as FavEntry, FoodItem, HistoryItem, Restaurant, Review, ToastMessage, UserProfile,
} from '../types';
import * as storage from '../services/storageService';
import { checkBackend, api } from '../services/apiClient';

export type FavoriteEntry = FavEntry;

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AppContextValue {
  // Prototype Demo Mode (User / Admin) — no login required, per project scope
  role: DemoRole;
  setRole: (r: DemoRole) => void;

  // Real account (only meaningful when a backend is connected)
  backendAvailable: boolean;
  authUser: AuthUser | null;
  isConnected: boolean; // backendAvailable && authUser !== null
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;

  // Data (backed by backend when connected, else localStorage)
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile['diet']> & Partial<Pick<UserProfile, 'favoriteCuisines' | 'mealTypePreferences'>>) => void;

  restaurants: Restaurant[];
  menuItems: FoodItem[];
  refreshCatalog: () => void;
  saveRestaurant: (r: Restaurant) => void;
  deleteRestaurantById: (id: string) => void;
  saveMenuItem: (item: FoodItem) => void;
  deleteMenuItemById: (id: string) => void;

  favorites: FavoriteEntry[];
  toggleFavorite: (entry: FavoriteEntry) => void;
  isFavorite: (entry: FavoriteEntry) => boolean;

  history: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;

  reviews: Review[];
  addReview: (review: Review) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  resetDemoData: () => void;
  exportData: () => string;
  importData: (json: string) => { success: boolean; error?: string };
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<DemoRole>('user');
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const [profile, setProfile] = useState<UserProfile>(storage.getUserProfile());
  const [restaurants, setRestaurants] = useState<Restaurant[]>(storage.getRestaurants());
  const [menuItems, setMenuItems] = useState<FoodItem[]>(storage.getMenuItems());
  const [favorites, setFavorites] = useState<FavoriteEntry[]>(storage.getFavorites());
  const [history, setHistory] = useState<HistoryItem[]>(storage.getHistory());
  const [reviews, setReviews] = useState<Review[]>(storage.getReviews());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    checkBackend().then(async (available) => {
      setBackendAvailable(available);
      if (available && storage.getToken()) {
        try {
          const me = await api.me();
          setAuthUser({ id: me.id, name: me.name, email: me.email });
          applyBackendProfile(me);
        } catch {
          storage.clearToken();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyBackendProfile(me: any) {
    setProfile((prev) => ({
      ...prev,
      id: String(me.id),
      name: me.name,
      email: me.email,
      location: me.location,
      favoriteCuisines: me.favorite_cuisines || [],
      mealTypePreferences: me.meal_type_preferences || [],
      diet: {
        goal: me.goal,
        dietaryPreference: me.dietary_preference,
        restrictions: me.restrictions || [],
        spicePreference: me.spice_preference,
      },
    }));
  }

  const isConnected = backendAvailable && authUser !== null;

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `t${Date.now()}${Math.random()}`;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const signup = async (name: string, email: string, password: string) => {
    if (!backendAvailable) {
      return { ok: false, error: 'No backend connected. Start the FastAPI backend to create a real account, or continue using Prototype Demo Mode.' };
    }
    try {
      const res = await api.signup(name, email, password);
      storage.saveToken(res.access_token);
      setAuthUser({ id: res.user.id, name: res.user.name, email: res.user.email });
      applyBackendProfile(res.user);
      showToast(`Welcome, ${res.user.name}!`);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message || 'Signup failed.' };
    }
  };

  const login = async (email: string, password: string) => {
    if (!backendAvailable) {
      return { ok: false, error: 'No backend connected. Start the FastAPI backend to log in, or continue using Prototype Demo Mode.' };
    }
    try {
      const res = await api.login(email, password);
      storage.saveToken(res.access_token);
      setAuthUser({ id: res.user.id, name: res.user.name, email: res.user.email });
      applyBackendProfile(res.user);
      showToast(`Welcome back, ${res.user.name}!`);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message || 'Login failed.' };
    }
  };

  const logout = () => {
    storage.clearToken();
    setAuthUser(null);
    setProfile(storage.getUserProfile());
    showToast('Logged out.', 'info');
  };

  const updateProfile: AppContextValue['updateProfile'] = (patch) => {
    setProfile((prev) => {
      const next: UserProfile = {
        ...prev,
        favoriteCuisines: patch.favoriteCuisines ?? prev.favoriteCuisines,
        mealTypePreferences: patch.mealTypePreferences ?? prev.mealTypePreferences,
        diet: {
          goal: (patch as any).goal ?? prev.diet.goal,
          dietaryPreference: (patch as any).dietaryPreference ?? prev.diet.dietaryPreference,
          restrictions: (patch as any).restrictions ?? prev.diet.restrictions,
          spicePreference: (patch as any).spicePreference ?? prev.diet.spicePreference,
        },
      };
      if (!isConnected) storage.saveUserProfile(next);
      else {
        api.updateProfile({
          goal: next.diet.goal,
          dietary_preference: next.diet.dietaryPreference,
          spice_preference: next.diet.spicePreference,
          restrictions: next.diet.restrictions,
          favorite_cuisines: next.favoriteCuisines,
          meal_type_preferences: next.mealTypePreferences,
        }).catch(() => showToast('Could not sync profile to server.', 'error'));
      }
      return next;
    });
    showToast('Profile updated.');
  };

  const refreshCatalog = useCallback(() => {
    setRestaurants(storage.getRestaurants());
    setMenuItems(storage.getMenuItems());
  }, []);

  const saveRestaurant = (r: Restaurant) => {
    const list = storage.getRestaurants();
    const exists = list.some((x) => x.id === r.id);
    const next = exists ? list.map((x) => (x.id === r.id ? r : x)) : [...list, r];
    storage.saveRestaurants(next);
    setRestaurants(next);
    showToast(exists ? 'Restaurant updated.' : 'Restaurant added.');
  };

  const deleteRestaurantById = (id: string) => {
    const next = storage.getRestaurants().filter((r) => r.id !== id);
    storage.saveRestaurants(next);
    setRestaurants(next);
    const nextMenu = storage.getMenuItems().filter((m) => m.restaurantId !== id);
    storage.saveMenuItems(nextMenu);
    setMenuItems(nextMenu);
    showToast('Restaurant deleted.');
  };

  const saveMenuItem = (item: FoodItem) => {
    const list = storage.getMenuItems();
    const exists = list.some((x) => x.id === item.id);
    const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
    storage.saveMenuItems(next);
    setMenuItems(next);
    showToast(exists ? 'Food item updated.' : 'Food item added.');
  };

  const deleteMenuItemById = (id: string) => {
    const next = storage.getMenuItems().filter((m) => m.id !== id);
    storage.saveMenuItems(next);
    setMenuItems(next);
    showToast('Food item deleted.');
  };

  const isFavorite = (entry: FavoriteEntry) =>
    favorites.some((f) => f.restaurantId === entry.restaurantId && f.foodId === entry.foodId);

  const toggleFavoriteFn = (entry: FavoriteEntry) => {
    if (isConnected) {
      api.toggleFavorite({ restaurant_id: entry.restaurantId ? Number(entry.restaurantId) : null, food_id: entry.foodId ? Number(entry.foodId) : null })
        .then((res) => {
          setFavorites((prev) => (res.favorited ? [...prev, entry] : prev.filter((f) => !(f.restaurantId === entry.restaurantId && f.foodId === entry.foodId))));
          showToast(res.favorited ? 'Added to favorites' : 'Removed from favorites');
        })
        .catch(() => showToast('Could not update favorites on server.', 'error'));
      return;
    }
    const added = storage.toggleFavorite(entry);
    setFavorites(storage.getFavorites());
    showToast(added ? 'Added to favorites' : 'Removed from favorites');
  };

  const addHistoryItemFn = (item: HistoryItem) => {
    if (isConnected) {
      api.addHistory({ restaurant_id: Number(item.restaurantId), food_id: Number(item.foodId), cost: item.cost, rating: item.rating })
        .then(() => setHistory((prev) => [item, ...prev]))
        .catch(() => showToast('Could not sync history to server.', 'error'));
      return;
    }
    storage.addHistoryItem(item);
    setHistory(storage.getHistory());
  };

  const addReviewFn = (review: Review) => {
    storage.addReview(review);
    setReviews(storage.getReviews());
    showToast('Review submitted.');
  };
  const updateReviewStatusFn = (id: string, status: Review['status']) => {
    storage.updateReviewStatus(id, status);
    setReviews(storage.getReviews());
  };
  const deleteReviewFn = (id: string) => {
    storage.deleteReview(id);
    setReviews(storage.getReviews());
    showToast('Review deleted.');
  };

  const resetDemoDataFn = () => {
    storage.resetDemoData();
    setRestaurants(storage.getRestaurants());
    setMenuItems(storage.getMenuItems());
    setReviews(storage.getReviews());
    setHistory(storage.getHistory());
    setFavorites(storage.getFavorites());
    setProfile(storage.getUserProfile());
    showToast('Demo data reset.');
  };

  const value = useMemo<AppContextValue>(() => ({
    role, setRole,
    backendAvailable, authUser, isConnected, signup, login, logout,
    profile, updateProfile,
    restaurants, menuItems, refreshCatalog, saveRestaurant, deleteRestaurantById, saveMenuItem, deleteMenuItemById,
    favorites, toggleFavorite: toggleFavoriteFn, isFavorite,
    history, addHistoryItem: addHistoryItemFn,
    reviews, addReview: addReviewFn, updateReviewStatus: updateReviewStatusFn, deleteReview: deleteReviewFn,
    toasts, showToast, dismissToast,
    resetDemoData: resetDemoDataFn,
    exportData: storage.exportData,
    importData: storage.importData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [role, backendAvailable, authUser, isConnected, profile, restaurants, menuItems, favorites, history, reviews, toasts]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
