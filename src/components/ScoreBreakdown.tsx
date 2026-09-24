import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Recommendation } from '../types';
import Modal from './Modal';

export default function ScoreBreakdown({ rec, onClose }: { rec: Recommendation | null; onClose: () => void }) {
  if (!rec) return null;
  const rows: [string, number, number][] = [
    ['Preference Match', rec.score.preference, 20],
    ['Diet Compatibility', rec.score.diet, 20],
    ['Budget Match', rec.score.budget, 15],
    ['Health Goal', rec.score.health, 15],
    ['Eating History', rec.score.history, 10],
    ['Restaurant Rating', rec.score.rating, 10],
    ['Distance', rec.score.distance, 5],
    ['Variety', rec.score.variety, 5],
  ];

  return (
    <Modal open={!!rec} onClose={onClose} title="Recommendation Analysis" subtitle={`${rec.restaurant.name} · ${rec.food.name}`}>
      <div className="space-y-2.5">
        {rows.map(([label, val, max]) => (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-charcoal/70">{label}</span>
              <span className="font-medium text-charcoal">{Math.round(val)}/{max}</span>
            </div>
            <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(val / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-charcoal/10 flex items-center justify-between">
        <span className="font-display font-semibold text-charcoal">Total Match</span>
        <span className="text-2xl font-display font-bold text-emerald-700">{Math.round(rec.score.total)}/100</span>
      </div>
      <div className="mt-4 bg-emerald-50 rounded-lg p-3">
        <p className="text-xs font-medium text-emerald-800 mb-2">Why we recommend this</p>
        <ul className="space-y-1">
          {rec.explanation.map((e, i) => (
            <li key={i} className="text-xs text-emerald-900 flex gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />{e}
            </li>
          ))}
        </ul>
      </div>
      {rec.negativeReasons.length > 0 && (
        <div className="mt-3 bg-gold-400/10 rounded-lg p-3">
          <p className="text-xs font-medium text-gold-600 mb-2">Why not a perfect match</p>
          <ul className="space-y-1">
            {rec.negativeReasons.map((e, i) => (
              <li key={i} className="text-xs text-charcoal/70 flex gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold-600" />{e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
