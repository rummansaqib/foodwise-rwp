import { useMemo } from 'react';
import { AlertTriangle, History as HistoryIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeHistory } from '../../ai/behaviorAnalyzer';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

export default function History() {
  const { history, restaurants } = useApp();
  const insights = useMemo(() => analyzeHistory(history), [history]);
  const sorted = useMemo(() => [...history].sort((a, b) => (a.date < b.date ? 1 : -1)), [history]);

  const alternatives = restaurants
    .filter((r) => !insights.repeatedRestaurants[r.name] && r.rating >= 4.2)
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 pb-16">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-6">My Food History</h1>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="w-6 h-6" />}
          title="No history yet"
          message="Choose a meal from Find Food and it will show up here."
          actionLabel="Find Food"
          actionTo="/find-food"
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((h) => (
            <div key={h.id} className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-charcoal/50">{new Date(h.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <p className="font-medium text-charcoal">{h.restaurantName}</p>
                <p className="text-sm text-charcoal/60">{h.foodName}{h.cost ? ` · Rs. ${h.cost.toLocaleString()}` : ''}</p>
              </div>
              <Badge tone="charcoal">{h.cuisine}</Badge>
            </div>
          ))}
        </div>
      )}

      {insights.messages.length > 0 && (
        <div className="mt-6 space-y-3">
          {insights.messages.map((msg, i) => (
            <div key={i} className="bg-gold-400/10 border border-gold-400/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-charcoal">{msg}</p>
              </div>
            </div>
          ))}
          {alternatives.length > 0 && (
            <div>
              <p className="text-sm font-medium text-charcoal mb-2">Explore alternatives</p>
              <div className="flex gap-2 flex-wrap">
                {alternatives.map((r) => <Badge key={r.id}>{r.name}</Badge>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
