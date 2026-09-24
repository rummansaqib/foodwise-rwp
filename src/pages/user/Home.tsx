import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateRecommendations } from '../../ai/recommendationEngine';
import RecommendationCard from '../../components/RecommendationCard';
import ScoreBreakdown from '../../components/ScoreBreakdown';
import { Recommendation } from '../../types';

export default function Home() {
  const { profile, restaurants, menuItems, history } = useApp();
  const [modalRec, setModalRec] = useState<Recommendation | null>(null);

  const quickPicks = useMemo(() => generateRecommendations({
    restaurants, menuItems, profile, history,
    params: { budget: 2000, persons: 2 },
  }).slice(0, 3), [restaurants, menuItems, profile, history]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20 md:pb-16">
      <section className="pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" /> {profile.location} · Demo Dataset
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mt-4 leading-tight">
              What should you eat today?
            </h1>
            <p className="text-charcoal/60 mt-4 text-lg max-w-md">
              Let FoodWise find the best food for you based on your budget, group size, preferences and eating habits.
            </p>
            <Link to="/find-food" className="mt-6 inline-flex items-center gap-2 bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl hover:bg-emerald-800 transition-colors shadow-soft">
              <Search className="w-4 h-4" /> Find Food
            </Link>
            <p className="text-sm text-charcoal/50 mt-4">{greeting} 👋 — Ready to find something you'll love, {profile.name.split(' ')[0]}?</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card h-64 md:h-80">
            <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1000" className="w-full h-full object-cover" alt="Featured Pakistani cuisine" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal">Recommended for You</h2>
          <Link to="/find-food" className="text-sm text-emerald-700 font-medium flex items-center gap-1">See all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {history.length < 3 && (
          <p className="text-xs text-charcoal/50 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Your recommendations become more personalized as you use FoodWise.
          </p>
        )}
        <div className="grid md:grid-cols-3 gap-5">
          {quickPicks.map((rec) => (
            <RecommendationCard key={rec.restaurant.id} rec={rec} onDetails={setModalRec} />
          ))}
        </div>
      </section>

      <ScoreBreakdown rec={modalRec} onClose={() => setModalRec(null)} />
    </div>
  );
}
