import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RestaurantCard from '../../components/RestaurantCard';
import EmptyState from '../../components/EmptyState';

export default function Favorites() {
  const { favorites, restaurants } = useApp();
  const favoriteRestaurants = restaurants.filter((r) => favorites.some((f) => f.restaurantId === r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 pb-16">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-6">Favorites</h1>
      {favoriteRestaurants.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-6 h-6" />}
          title="No favorites yet"
          message="Save restaurants and foods you love to find them quickly later."
          actionLabel="Explore Restaurants"
          actionTo="/restaurants"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
}
