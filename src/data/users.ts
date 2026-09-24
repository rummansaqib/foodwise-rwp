import { AdminUserRow, CuisineType, Goal, UserProfile } from '../types';

// Default demo profile used by the "Switch to User" experience.
export const defaultUserProfile: UserProfile = {
  id: 'u-demo',
  name: 'Demo User',
  location: 'Rawalpindi',
  favoriteCuisines: ['Pakistani', 'BBQ'],
  mealTypePreferences: ['Traditional', 'BBQ'],
  diet: {
    goal: 'High Protein',
    dietaryPreference: 'Balanced',
    restrictions: [],
    spicePreference: 'Medium',
  },
  joinedDate: '2025-11-02',
};

const NAMES = [
  'Ayesha Khan', 'Bilal Ahmed', 'Sana Malik', 'Usman Tariq', 'Hira Siddiqui',
  'Fahad Raza', 'Mehwish Iqbal', 'Zeeshan Butt', 'Nida Farooq', 'Hamza Sheikh',
  'Amna Yousuf', 'Talha Aziz',
];

const GOALS: Goal[] = ['Weight Loss', 'Weight Gain', 'Maintenance', 'High Protein', 'General Healthy Eating'];
const CUISINES: CuisineType[] = ['Pakistani', 'Chinese', 'Fast Food', 'BBQ', 'Biryani', 'Pizza', 'Cafe'];

function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

export function generateAdminUsers(): AdminUserRow[] {
  const rand = seeded(7);
  return NAMES.map((name, i) => {
    const daysAgo = Math.floor(rand() * 6);
    return {
      id: `u${i + 1}`,
      name,
      goal: GOALS[i % GOALS.length],
      favoriteCuisine: CUISINES[Math.floor(rand() * CUISINES.length)],
      mealsThisWeek: Math.floor(rand() * 10) + 1,
      lastActive: new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10),
    };
  });
}

export const adminUsers: AdminUserRow[] = generateAdminUsers();
