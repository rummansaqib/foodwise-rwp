import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
  CuisineType, DietaryPreference, MealType, RwpArea, SpicePreference,
} from '../types';

const AREAS: (RwpArea | 'Rawalpindi')[] = [
  'Rawalpindi', 'Saddar', 'Commercial Market', 'Bahria Town', 'PWD', 'Chaklala',
  'Satellite Town', 'Raja Bazaar', 'Murree Road', 'Scheme 3', 'Bahria Phase 4', '6th Road',
];
const CUISINES: CuisineType[] = ['Pakistani', 'Chinese', 'Fast Food', 'BBQ', 'Burgers', 'Pizza', 'Desi', 'Biryani', 'Turkish', 'Continental', 'Cafe', 'Bakery', 'Seafood', 'Vegetarian'];
const MEAL_TYPES: MealType[] = ['Traditional', 'Chinese', 'Healthy', 'Fast Food', 'BBQ', 'Continental', 'Bakery'];
const DIETARY: DietaryPreference[] = ['No Preference', 'Vegetarian', 'Vegan', 'High Protein', 'Low Sugar', 'Lower Fat', 'Balanced'];
const SPICE: SpicePreference[] = ['No Preference', 'Mild', 'Medium', 'Spicy'];
const DISTANCES: (number | 'Any')[] = [1, 3, 5, 10, 'Any'];

export interface FilterState {
  area: RwpArea | 'Rawalpindi';
  cuisines: CuisineType[];
  mealTypes: MealType[];
  dietaryPreference: DietaryPreference;
  spicePreference: SpicePreference;
  minRating: number;
  maxDistance: number | 'Any';
}

export const defaultFilters: FilterState = {
  area: 'Rawalpindi',
  cuisines: [],
  mealTypes: [],
  dietaryPreference: 'No Preference',
  spicePreference: 'No Preference',
  minRating: 3.0,
  maxDistance: 'Any',
};

export default function FilterPanel({
  filters, onChange,
}: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const [open, setOpen] = useState(false);

  const toggleArrayValue = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-emerald-700 font-medium flex items-center gap-1"
        aria-expanded={open}
      >
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} More Filters
      </button>

      {open && (
        <div className="mt-3 grid sm:grid-cols-2 gap-5 pt-4 border-t border-charcoal/10">
          <div>
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Location</label>
            <select
              value={filters.area}
              onChange={(e) => onChange({ ...filters, area: e.target.value as RwpArea | 'Rawalpindi' })}
              className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm"
            >
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Dietary Preference</label>
            <select
              value={filters.dietaryPreference}
              onChange={(e) => onChange({ ...filters, dietaryPreference: e.target.value as DietaryPreference })}
              className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm"
            >
              {DIETARY.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Meal Type (Traditional, Chinese, Healthy, Fast Food...)</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt}
                  onClick={() => onChange({ ...filters, mealTypes: toggleArrayValue(filters.mealTypes, mt) })}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    filters.mealTypes.includes(mt) ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15 text-charcoal/70 hover:border-emerald-400'
                  }`}
                >
                  {mt}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Cuisine</label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ ...filters, cuisines: toggleArrayValue(filters.cuisines, c) })}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    filters.cuisines.includes(c) ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15 text-charcoal/70 hover:border-emerald-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Spice Level</label>
            <select
              value={filters.spicePreference}
              onChange={(e) => onChange({ ...filters, spicePreference: e.target.value as SpicePreference })}
              className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm"
            >
              {SPICE.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Maximum Distance</label>
            <select
              value={String(filters.maxDistance)}
              onChange={(e) => onChange({ ...filters, maxDistance: e.target.value === 'Any' ? 'Any' : Number(e.target.value) })}
              className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm"
            >
              {DISTANCES.map((d) => <option key={d} value={d}>{d === 'Any' ? 'Any Distance' : `${d} km`}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 block">Minimum Rating: {filters.minRating.toFixed(1)}</label>
            <input
              type="range" min="3" max="5" step="0.1" value={filters.minRating}
              onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
              className="w-full accent-emerald-700"
            />
          </div>
        </div>
      )}
    </div>
  );
}
