import { Star } from 'lucide-react';

export default function RatingStars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <span className="inline-flex items-center gap-1 font-medium text-charcoal">
      <Star className={`${cls} fill-gold-500 text-gold-500`} />
      <span className={size === 'sm' ? 'text-sm' : 'text-base'}>{value.toFixed(1)}</span>
    </span>
  );
}
