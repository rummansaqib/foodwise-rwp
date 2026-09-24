import { useState } from 'react';
import { Sparkles, Users, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateRecommendations } from '../../ai/recommendationEngine';
import FilterPanel, { defaultFilters, FilterState } from '../../components/FilterPanel';
import RecommendationCard from '../../components/RecommendationCard';
import ScoreBreakdown from '../../components/ScoreBreakdown';
import EmptyState from '../../components/EmptyState';
import { FindFoodParams, Recommendation } from '../../types';
import { Search } from 'lucide-react';

const LOADING_STEPS = [
  'Analyzing your preferences...',
  'Checking menus...',
  'Optimizing your budget...',
  'Finding your best matches...',
];

export default function FindFood() {
  const { profile, restaurants, menuItems, history, addHistoryItem, showToast } = useApp();
  const [budget, setBudget] = useState(2500);
  const [persons, setPersons] = useState(4);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState('');
  const [modalRec, setModalRec] = useState<Recommendation | null>(null);

  const runSearch = () => {
    setError('');
    if (!budget || budget <= 0) { setError('Please enter your total budget.'); setResults(null); return; }
    if (!persons || persons <= 0) { setError('Please enter the number of persons.'); setResults(null); return; }

    setLoading(true);
    setResults(null);
    setLoadingStep(0);
    const stepTimer = setInterval(() => setLoadingStep((s) => Math.min(LOADING_STEPS.length - 1, s + 1)), 450);

    setTimeout(() => {
      clearInterval(stepTimer);
      const params: FindFoodParams = {
        budget, persons,
        area: filters.area,
        cuisines: filters.cuisines.length ? filters.cuisines : undefined,
        minRating: filters.minRating,
        maxDistance: filters.maxDistance,
      };
      const effectiveProfile = {
        ...profile,
        mealTypePreferences: filters.mealTypes.length ? filters.mealTypes : profile.mealTypePreferences,
        diet: {
          ...profile.diet,
          dietaryPreference: filters.dietaryPreference !== 'No Preference' ? filters.dietaryPreference : profile.diet.dietaryPreference,
          spicePreference: filters.spicePreference !== 'No Preference' ? filters.spicePreference : profile.diet.spicePreference,
        },
      };
      const recs = generateRecommendations({ restaurants, menuItems, profile: effectiveProfile, history, params });
      setLoading(false);
      if (!recs.length) {
        setError("We couldn't find a suitable meal combination within this budget. Try increasing your budget or reducing the number of people.");
        return;
      }
      setResults(recs);
    }, 1800);
  };

  const chooseMeal = (rec: Recommendation) => {
    addHistoryItem({
      id: `h${Date.now()}`,
      restaurantId: rec.restaurant.id,
      restaurantName: rec.restaurant.name,
      foodId: rec.food.id,
      foodName: rec.food.name,
      cuisine: rec.restaurant.cuisines[0],
      date: new Date().toISOString(),
      cost: rec.meal?.total ?? rec.food.price,
    });
    showToast(`Added "${rec.food.name}" at ${rec.restaurant.name} to your history.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 pb-24">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">Find Food</h1>
      <p className="text-charcoal/60 mt-1 text-sm">Only budget and group size are required — everything else is optional.</p>

      <div className="mt-6 bg-white rounded-xl2 shadow-soft border border-charcoal/5 p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="text-xs font-medium text-charcoal/60 mb-1.5 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Total Budget (Rs.)</label>
            <input
              id="budget" type="number" value={budget} min={0}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-charcoal font-medium focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-charcoal/60 mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Number of Persons</label>
            <div className="flex items-center border border-charcoal/15 rounded-lg overflow-hidden">
              <button onClick={() => setPersons((p) => Math.max(1, p - 1))} className="px-4 py-2.5 hover:bg-charcoal/5" aria-label="Decrease persons">−</button>
              <span className="flex-1 text-center font-medium">{persons}</span>
              <button onClick={() => setPersons((p) => p + 1)} className="px-4 py-2.5 hover:bg-charcoal/5" aria-label="Increase persons">+</button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>

        <button
          onClick={runSearch}
          className="mt-5 w-full bg-emerald-700 text-white font-medium py-3 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Find Food
        </button>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-700 font-medium animate-pulseSoft">
            <Sparkles className="w-4 h-4 animate-spin" /> {LOADING_STEPS[loadingStep]}
          </div>
          <div className="grid md:grid-cols-2 gap-5 mt-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-56 rounded-xl2 bg-charcoal/5 animate-pulseSoft" />
            ))}
          </div>
        </div>
      )}

      {results && !loading && (
        <div className="mt-8 space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal">Top Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {results.map((rec) => (
              <RecommendationCard key={rec.restaurant.id} rec={rec} onDetails={setModalRec} onChoose={chooseMeal} />
            ))}
          </div>
        </div>
      )}

      {!loading && !results && !error && (
        <EmptyState
          icon={<Sparkles className="w-6 h-6" />}
          title="Ready when you are"
          message="Enter your budget and group size, then tap Find Food to see personalized, explainable recommendations."
        />
      )}

      <ScoreBreakdown rec={modalRec} onClose={() => setModalRec(null)} />
    </div>
  );
}
