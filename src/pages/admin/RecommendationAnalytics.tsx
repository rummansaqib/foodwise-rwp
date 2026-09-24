import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/StatCard';
import { Target, ThumbsUp, Wallet, ShieldCheck } from 'lucide-react';

const FACTOR_DATA = [
  { name: 'Preference', v: 20 }, { name: 'Diet', v: 20 }, { name: 'Budget', v: 15 }, { name: 'Health', v: 15 },
  { name: 'History', v: 10 }, { name: 'Rating', v: 10 }, { name: 'Distance', v: 5 }, { name: 'Variety', v: 5 },
];

export default function RecommendationAnalytics() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-1">Recommendation Engine</h1>
      <p className="text-charcoal/50 text-sm mb-6">Demo analytics illustrating engine behavior across simulated usage.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Average Match Score" value="87%" icon={Target} />
        <StatCard label="Accepted Recommendations" value="72%" icon={ThumbsUp} />
        <StatCard label="Budget-Safe Recommendations" value="94%" icon={Wallet} />
        <StatCard label="Diet-Compatible Recommendations" value="91%" icon={ShieldCheck} />
      </div>

      <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5">
        <p className="text-sm font-medium text-charcoal mb-3">Top Recommendation Factors (weight out of 100)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={FACTOR_DATA} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="v" fill="#DB9A3A" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
