import { Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { useApp } from '../context/AppContext';

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite({ restaurantId: restaurant.id });

  return (
    <div className="bg-white rounded-xl2 shadow-soft hover:shadow-lift transition-shadow duration-200 overflow-hidden border border-charcoal/5">
      <div className="relative h-40">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" loading="lazy" />
        <button
          onClick={() => toggleFavorite({ restaurantId: restaurant.id })}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-charcoal/50'}`} />
        </button>
        {!restaurant.isOpen && (
          <div className="absolute bottom-3 left-3 bg-charcoal/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">Closed</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-charcoal">{restaurant.name}</h3>
        <div className="flex items-center gap-3 text-xs text-charcoal/60 mt-1">
          <RatingStars value={restaurant.rating} />
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.distance} km</span>
          <span>{restaurant.area}</span>
        </div>
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {restaurant.cuisines.slice(0, 3).map((c) => <Badge key={c}>{c}</Badge>)}
        </div>
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="mt-3 block text-center text-sm font-medium text-emerald-700 border border-emerald-200 rounded-lg py-2 hover:bg-emerald-50 transition-colors"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}
