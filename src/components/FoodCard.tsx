import { CheckCircle2, AlertTriangle, XCircle, Flame } from 'lucide-react';
import { FoodItem, UserProfile } from '../types';
import { checkDietCompatibility } from '../ai/dietEngine';
import Badge from './Badge';

const STATUS_ICON = { compatible: CheckCircle2, warning: AlertTriangle, incompatible: XCircle };
const STATUS_COLOR = { compatible: 'text-emerald-600', warning: 'text-gold-600', incompatible: 'text-red-500' };

export default function FoodCard({
  food, profile, onAdd,
}: { food: FoodItem; profile?: UserProfile; onAdd?: (food: FoodItem) => void }) {
  const compat = profile ? checkDietCompatibility(food, profile.diet) : null;
  const StatusIcon = compat ? STATUS_ICON[compat.status] : null;

  return (
    <div className="flex gap-3 bg-white rounded-xl border border-charcoal/5 shadow-soft p-3">
      <img src={food.image} alt={food.name} className="w-20 h-20 rounded-lg object-cover shrink-0" loading="lazy" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-charcoal truncate">{food.name}</p>
            <p className="text-xs text-charcoal/50 line-clamp-2">{food.description}</p>
          </div>
          {food.popular && <Badge tone="gold">Popular</Badge>}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="font-semibold text-charcoal text-sm">Rs. {food.price.toLocaleString()}</span>
          {food.spiceLevel === 'Spicy' && <span className="text-xs text-red-500 flex items-center gap-0.5"><Flame className="w-3 h-3" />Spicy</span>}
          {compat && StatusIcon && (
            <span className={`text-xs flex items-center gap-1 ${STATUS_COLOR[compat.status]}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {compat.status === 'compatible' ? 'Compatible' : compat.status === 'warning' ? 'Check preference' : 'Not compatible'}
            </span>
          )}
        </div>
        {onAdd && (
          <button
            onClick={() => onAdd(food)}
            className="mt-2 text-xs font-medium text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition-colors"
          >
            Add to Meal
          </button>
        )}
      </div>
    </div>
  );
}
