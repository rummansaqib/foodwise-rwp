import { LucideIcon } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-4">
      <Icon className="w-4 h-4 text-emerald-700 mb-2" />
      <p className="text-2xl font-display font-bold text-charcoal">{value}</p>
      <p className="text-xs text-charcoal/50 mt-0.5">{label}</p>
    </div>
  );
}
