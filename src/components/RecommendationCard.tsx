import { CheckCircle2, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Recommendation } from '../types';
import RatingStars from './RatingStars';
import ScoreRing from './ScoreRing';
import Badge from './Badge';
import { useApp } from '../context/AppContext';

export default function RecommendationCard({
  rec, onDetails, onChoose,
}: { rec: Recommendation; onDetails: (rec: Recommendation) => void; onChoose?: (rec: Recommendation) => void }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite({ restaurantId: rec.restaurant.id });

  return (
    <div className="bg-white rounded-xl2 shadow-soft hover:shadow-lift transition-shadow duration-200 overflow-hidden border border-charcoal/5">
      <div className="relative h-36">
        <img src={rec.restaurant.image} alt={rec.restaurant.name} className="w-full h-full object-cover" loading="lazy" />
        <button
          onClick={() => toggleFavorite({ restaurantId: rec.restaurant.id })}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-charcoal/50'}`} />
        </button>
        {rec.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {rec.tags.map((t) => <Badge key={t} tone="gold">{t}</Badge>)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-charcoal truncate">{rec.restaurant.name}</h3>
            <div className="flex items-center gap-3 text-xs text-charcoal/60 mt-0.5">
              <RatingStars value={rec.restaurant.rating} />
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{rec.restaurant.distance} km</span>
            </div>
          </div>
          <ScoreRing value={rec.score.total} />
        </div>

        <div className="mt-3 bg-cream rounded-lg p-3">
          <p className="text-sm font-medium text-charcoal">{rec.food.name}</p>
          <p className="text-xs text-charcoal/50">Rs. {rec.food.price.toLocaleString()} · Recommended pick</p>
        </div>

        <ul className="mt-3 space-y-1">
          {rec.explanation.slice(0, 3).map((e, i) => (
            <li key={i} className="text-xs text-charcoal/70 flex gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />{e}
            </li>
          ))}
        </ul>

        {rec.meal && (
          <div className="mt-3 flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-2">
            <span className="text-emerald-800">Group meal total</span>
            <span className="font-semibold text-emerald-800">
              Rs. {rec.meal.total.toLocaleString()} ({rec.meal.budgetUsedPercent}% of budget)
            </span>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onDetails(rec)}
            className="flex-1 text-sm font-medium text-emerald-700 border border-emerald-200 rounded-lg py-2 hover:bg-emerald-50 transition-colors"
          >
            Why this?
          </button>
          {onChoose ? (
            <button
              onClick={() => onChoose(rec)}
              className="flex-1 text-sm font-medium text-white bg-emerald-700 rounded-lg py-2 hover:bg-emerald-800 transition-colors"
            >
              Choose this meal
            </button>
          ) : (
            <Link
              to={`/restaurants/${rec.restaurant.id}`}
              className="flex-1 text-center text-sm font-medium text-white bg-emerald-700 rounded-lg py-2 hover:bg-emerald-800 transition-colors"
            >
              View Restaurant
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
