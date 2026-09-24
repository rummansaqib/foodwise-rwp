import { Review } from '../types';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { analyzeSentiment } from '../ai/sentimentAnalyzer';

const SENTIMENT_TONE: Record<string, 'emerald' | 'gold' | 'red' | 'charcoal'> = {
  Positive: 'emerald', Negative: 'red', Mixed: 'gold', Neutral: 'charcoal',
};

export default function ReviewCard({ review }: { review: Review }) {
  const sentiment = analyzeSentiment(review.comment);
  return (
    <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-charcoal text-sm">{review.userName}</span>
          <RatingStars value={review.rating} />
        </div>
        <span className="text-xs text-charcoal/40">{review.date}</span>
      </div>
      <p className="text-sm text-charcoal/80 mt-2">{review.comment}</p>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Badge tone={SENTIMENT_TONE[sentiment.overall]}>AI Insight: {sentiment.overall}</Badge>
        {sentiment.aspects.map((a) => (
          <Badge key={a.label} tone={SENTIMENT_TONE[a.sentiment]}>{a.label}: {a.sentiment}</Badge>
        ))}
      </div>
    </div>
  );
}
