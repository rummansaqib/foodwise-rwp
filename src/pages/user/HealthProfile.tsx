import { useState, ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CuisineType, DietaryPreference, DietaryRestriction, Goal, MealType, SpicePreference,
} from '../../types';

const GOALS: Goal[] = ['Weight Loss', 'Weight Gain', 'Maintenance', 'High Protein', 'General Healthy Eating'];
const DIETARY: DietaryPreference[] = ['No Preference', 'Vegetarian', 'Vegan', 'Low Sugar', 'Lower Fat', 'High Protein', 'Balanced'];
const RESTRICTIONS: DietaryRestriction[] = ['Lactose intolerance', 'Gluten avoidance', 'Nut allergy', 'Egg allergy', 'Seafood allergy', 'Vegetarian', 'Vegan'];
const CUISINES: CuisineType[] = ['Pakistani', 'Chinese', 'Fast Food', 'BBQ', 'Burgers', 'Pizza', 'Desi', 'Biryani', 'Turkish', 'Continental', 'Cafe', 'Bakery', 'Seafood', 'Vegetarian'];
const MEAL_TYPES: MealType[] = ['Traditional', 'Chinese', 'Healthy', 'Fast Food', 'BBQ', 'Continental', 'Bakery'];
const SPICE: SpicePreference[] = ['No Preference', 'Mild', 'Medium', 'Spicy'];

export default function HealthProfile() {
  const { profile, updateProfile } = useApp();
  const [goal, setGoal] = useState<Goal>(profile.diet.goal);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(profile.diet.dietaryPreference);
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(profile.diet.restrictions);
  const [spicePreference, setSpicePreference] = useState<SpicePreference>(profile.diet.spicePreference);
  const [favoriteCuisines, setFavoriteCuisines] = useState<CuisineType[]>(profile.favoriteCuisines);
  const [mealTypePreferences, setMealTypePreferences] = useState<MealType[]>(profile.mealTypePreferences);

  const toggle = <T,>(arr: T[], value: T, setter: (v: T[]) => void) =>
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const save = () => {
    updateProfile({ goal, dietaryPreference, restrictions, spicePreference, favoriteCuisines, mealTypePreferences });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 pb-16">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-1">Health & Diet Profile</h1>
      <p className="text-charcoal/60 text-sm mb-6">Optional — FoodWise works fine without this, but recommendations get sharper the more you share.</p>

      <Section title="Goal">
        <ChipGroup options={GOALS} selected={[goal]} onToggle={(g) => setGoal(g)} single />
      </Section>

      <Section title="Dietary Preference">
        <ChipGroup options={DIETARY} selected={[dietaryPreference]} onToggle={(d) => setDietaryPreference(d)} single />
      </Section>

      <Section title="Meal Type Preferences">
        <ChipGroup options={MEAL_TYPES} selected={mealTypePreferences} onToggle={(mt) => toggle(mealTypePreferences, mt, setMealTypePreferences)} />
      </Section>

      <Section title="Favorite Cuisines">
        <ChipGroup options={CUISINES} selected={favoriteCuisines} onToggle={(c) => toggle(favoriteCuisines, c, setFavoriteCuisines)} />
      </Section>

      <Section title="Spice Level">
        <ChipGroup options={SPICE} selected={[spicePreference]} onToggle={(s) => setSpicePreference(s)} single />
      </Section>

      <Section title="Dietary Restrictions">
        <ChipGroup options={RESTRICTIONS} selected={restrictions} onToggle={(r) => toggle(restrictions, r, setRestrictions)} />
      </Section>

      <button onClick={save} className="mt-4 w-full bg-emerald-700 text-white font-medium py-3 rounded-xl hover:bg-emerald-800 transition-colors">
        Save Profile
      </button>

      <div className="mt-6 bg-cream border border-charcoal/10 rounded-xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-charcoal/40 shrink-0 mt-0.5" />
        <p className="text-xs text-charcoal/60">
          FoodWise provides food decision support, not medical advice. Food compatibility information is based on
          available food data and should be verified with the restaurant when allergies or medical conditions are involved.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-charcoal mb-2">{title}</h2>
      {children}
    </div>
  );
}

function ChipGroup<T extends string>({
  options, selected, onToggle, single,
}: { options: T[]; selected: T[]; onToggle: (v: T) => void; single?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              active ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15 text-charcoal/70 hover:border-emerald-400'
            }`}
          >
            {opt}{single && active ? '' : ''}
          </button>
        );
      })}
    </div>
  );
}
