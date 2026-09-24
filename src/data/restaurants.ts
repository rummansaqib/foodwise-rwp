import { CuisineType, MealType, Restaurant, RwpArea } from '../types';

// Maps each cuisine to the Meal Type filter tags used across the app
// (Traditional / Chinese / Healthy / Fast Food / BBQ / Continental / Bakery).
const CUISINE_TO_MEAL_TYPES: Record<string, MealType[]> = {
  Pakistani: ['Traditional'],
  Desi: ['Traditional'],
  Biryani: ['Traditional'],
  BBQ: ['BBQ', 'Traditional'],
  Chinese: ['Chinese'],
  'Fast Food': ['Fast Food'],
  Burgers: ['Fast Food'],
  Pizza: ['Fast Food'],
  Turkish: ['Continental'],
  Continental: ['Continental'],
  Cafe: ['Healthy'],
  Bakery: ['Bakery'],
  Seafood: ['Healthy', 'Continental'],
  Vegetarian: ['Healthy'],
};

function deriveMealTypes(cuisines: CuisineType[]): MealType[] {
  const set = new Set<MealType>();
  cuisines.forEach((c) => (CUISINE_TO_MEAL_TYPES[c] || []).forEach((mt) => set.add(mt)));
  if (set.size === 0) set.add('Traditional');
  return Array.from(set);
}

// ---------------------------------------------------------------------------
// DEMO DATASET — This is NOT a complete listing of Rawalpindi restaurants.
// It is illustrative demo data generated for the FoodWise RWP FYP prototype
// so the recommendation engine has realistic, varied inputs to work with.
// ---------------------------------------------------------------------------

const AREAS: { area: RwpArea; lat: number; lng: number }[] = [
  { area: 'Saddar', lat: 33.5989, lng: 73.0479 },
  { area: 'Commercial Market', lat: 33.6203, lng: 73.0685 },
  { area: 'Bahria Town', lat: 33.5227, lng: 73.1478 },
  { area: 'PWD', lat: 33.549, lng: 73.1296 },
  { area: 'Chaklala', lat: 33.5981, lng: 73.0995 },
  { area: 'Satellite Town', lat: 33.6461, lng: 73.0551 },
  { area: 'Raja Bazaar', lat: 33.6293, lng: 73.0454 },
  { area: 'Murree Road', lat: 33.6157, lng: 73.0631 },
  { area: 'Scheme 3', lat: 33.6402, lng: 73.0796 },
  { area: 'Bahria Phase 4', lat: 33.5301, lng: 73.161 },
  { area: '6th Road', lat: 33.6088, lng: 73.0562 },
];

interface Blueprint {
  name: string;
  cuisines: CuisineType[];
  desc: string;
  priceLevel: 1 | 2 | 3 | 4;
  image: string;
}

const BLUEPRINTS: Blueprint[] = [
  { name: 'Bundu Khan', cuisines: ['Pakistani', 'BBQ', 'Desi'], desc: 'Iconic Pakistani BBQ house known for karahi and seekh kebabs.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800' },
  { name: 'Savour Foods', cuisines: ['Pakistani', 'Biryani', 'Desi'], desc: 'A Rawalpindi favourite for biryani and traditional desi thalis.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800' },
  { name: 'Howdy', cuisines: ['Fast Food', 'Burgers', 'Continental'], desc: 'Casual fast food chain famous for burgers and loaded fries.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800' },
  { name: 'Cheezious', cuisines: ['Pizza', 'Fast Food'], desc: 'Popular pizza chain with a wide range of loaded pizzas.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' },
  { name: 'Redbox Grill', cuisines: ['BBQ', 'Continental', 'Fast Food'], desc: 'Grill house serving steaks, BBQ platters and burgers.', priceLevel: 3, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800' },
  { name: 'China Town', cuisines: ['Chinese'], desc: 'Long-standing Chinese restaurant with a large local following.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800' },
  { name: 'Wang Xiang', cuisines: ['Chinese'], desc: 'Authentic Chinese cuisine with hand-pulled noodles.', priceLevel: 3, image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800' },
  { name: 'Istanbul Restaurant', cuisines: ['Turkish', 'Continental'], desc: 'Turkish-inspired kebabs, pide and mezze in a warm setting.', priceLevel: 3, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800' },
  { name: 'Kabul Restaurant', cuisines: ['Desi', 'BBQ', 'Pakistani'], desc: 'Home-style Pukhtoon cuisine, famous for karahi and lamb.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800' },
  { name: 'Rahat Bakers', cuisines: ['Bakery', 'Cafe'], desc: 'Neighbourhood bakery serving pastries, cakes and quick bites.', priceLevel: 1, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800' },
  { name: 'Cafe Nashaa', cuisines: ['Cafe', 'Continental'], desc: 'Cozy cafe with coffee, breakfast plates and light meals.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
  { name: 'Zameer Ansari', cuisines: ['BBQ', 'Desi'], desc: 'Legendary tikka and BBQ spot loved across the twin cities.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800' },
  { name: 'Chaaye Khana', cuisines: ['Cafe', 'Pakistani'], desc: 'Trendy tea house serving desi chai alongside light meals.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800' },
  { name: 'Ginsoy Fusion', cuisines: ['Chinese', 'Continental'], desc: 'Modern fusion restaurant blending Asian and continental flavours.', priceLevel: 3, image: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800' },
  { name: 'Tandoori Twist', cuisines: ['Pakistani', 'BBQ'], desc: 'Tandoor specialists serving fresh naan and sizzling karahi.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800' },
  { name: "Mr. Burger", cuisines: ['Burgers', 'Fast Food'], desc: 'Local burger joint known for generous portions and spicy sauces.', priceLevel: 1, image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800' },
  { name: 'Biryani Times', cuisines: ['Biryani', 'Pakistani'], desc: 'Specialist biryani outlet with Sindhi and Karachi-style rice dishes.', priceLevel: 1, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800' },
  { name: 'Green Leaf Kitchen', cuisines: ['Vegetarian', 'Continental', 'Cafe'], desc: 'One of the few dedicated vegetarian-friendly kitchens in the city.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' },
  { name: 'Sea Delight', cuisines: ['Seafood', 'Continental'], desc: 'Seafood specialists with grilled fish and prawn platters.', priceLevel: 3, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800' },
  { name: 'Pind Da Dhaba', cuisines: ['Desi', 'Pakistani'], desc: 'Rustic dhaba-style desi food served in a village-themed setting.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800' },
  { name: 'Pizza Point', cuisines: ['Pizza', 'Fast Food'], desc: 'Budget-friendly pizzeria popular with students in Satellite Town.', priceLevel: 1, image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=800' },
  { name: 'Delhi Darbar', cuisines: ['Pakistani', 'Biryani', 'Desi'], desc: 'Old-city eatery serving Mughlai-style curries and biryani.', priceLevel: 2, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800' },
];

function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function generateRestaurants(): Restaurant[] {
  const rand = seededRandom(42);
  return BLUEPRINTS.map((bp, i) => {
    const loc = AREAS[i % AREAS.length];
    const jitter = () => (rand() - 0.5) * 0.01;
    const daysAgo = Math.floor(rand() * 900) + 10;
    const openingDate = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
    const rating = Math.round((3.4 + rand() * 1.5) * 10) / 10;
    return {
      id: `r${i + 1}`,
      name: bp.name,
      description: bp.desc,
      address: `${bp.name} Plaza, ${loc.area}, Rawalpindi`,
      area: loc.area,
      latitude: loc.lat + jitter(),
      longitude: loc.lng + jitter(),
      rating: Math.min(5, rating),
      reviewCount: Math.floor(rand() * 400) + 20,
      priceLevel: bp.priceLevel,
      cuisines: bp.cuisines,
      mealTypes: deriveMealTypes(bp.cuisines),
      distance: Math.round((0.4 + rand() * 9.2) * 10) / 10,
      openingDate,
      isOpen: rand() > 0.12,
      image: bp.image,
    } as Restaurant;
  });
}

export const restaurants: Restaurant[] = generateRestaurants();
