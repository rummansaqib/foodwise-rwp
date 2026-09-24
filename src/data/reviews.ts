import { Review } from '../types';
import { restaurants } from './restaurants';

const COMMENTS = [
  'Food was amazing but service was slow and the portion was small.',
  'Great taste and generous portions, will come back again.',
  'The place was clean and the staff were very friendly.',
  'Prices are a bit expensive for what you get, but the taste is good.',
  'Loved the flavour, though the wait time was quite long.',
  'Excellent service and the food came out fresh and hot.',
  'Portion size was disappointing for the price we paid.',
  'Best karahi in the area, highly recommend to friends.',
  'Ambience was nice but the food was a little bland this time.',
  'Fast service, affordable prices, and tasty food overall.',
  'The restaurant was dirty and the service was rude.',
  'Amazing experience, everything from taste to cleanliness was perfect.',
];

const NAMES = ['Ayesha K.', 'Bilal A.', 'Sana M.', 'Usman T.', 'Hira S.', 'Fahad R.', 'Mehwish I.', 'Zeeshan B.'];

function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

function generateReviews(): Review[] {
  const rand = seeded(21);
  const reviews: Review[] = [];
  let id = 1;
  restaurants.forEach((r) => {
    const count = 2 + Math.floor(rand() * 2); // 2-3 per restaurant -> 50+ total across 22 restaurants
    for (let i = 0; i < count; i++) {
      const rating = Math.round((3 + rand() * 2) * 10) / 10;
      const daysAgo = Math.floor(rand() * 60);
      reviews.push({
        id: `rev${id++}`,
        restaurantId: r.id,
        userId: `u${(i % 8) + 1}`,
        userName: NAMES[Math.floor(rand() * NAMES.length)],
        rating: Math.min(5, rating),
        comment: COMMENTS[Math.floor(rand() * COMMENTS.length)],
        foodQuality: Math.round(rand() * 2 + 3),
        service: Math.round(rand() * 2 + 3),
        portion: Math.round(rand() * 2 + 3),
        price: Math.round(rand() * 2 + 3),
        cleanliness: Math.round(rand() * 2 + 3),
        date: new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10),
        status: 'approved',
      });
    }
  });
  return reviews;
}

export const seedReviews: Review[] = generateReviews();
