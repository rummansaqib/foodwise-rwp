import { ReactNode } from 'react';

export default function Badge({
  children, tone = 'emerald',
}: { children: ReactNode; tone?: 'emerald' | 'gold' | 'charcoal' | 'red' }) {
  const tones: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-800',
    gold: 'bg-gold-400/20 text-gold-600',
    charcoal: 'bg-charcoal/5 text-charcoal',
    red: 'bg-red-100 text-red-600',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}
