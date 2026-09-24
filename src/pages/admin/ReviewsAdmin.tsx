import { useApp } from '../../context/AppContext';
import { analyzeSentiment } from '../../ai/sentimentAnalyzer';
import Badge from '../../components/Badge';
import RatingStars from '../../components/RatingStars';

const SENTIMENT_TONE: Record<string, 'emerald' | 'gold' | 'red' | 'charcoal'> = {
  Positive: 'emerald', Negative: 'red', Mixed: 'gold', Neutral: 'charcoal',
};

export default function ReviewsAdmin() {
  const { reviews, restaurants, updateReviewStatus, deleteReview } = useApp();
  const restaurantName = (id: string) => restaurants.find((r) => r.id === id)?.name || 'Unknown';

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-6">Reviews</h1>
      <div className="space-y-3">
        {reviews.map((r) => {
          const sentiment = analyzeSentiment(r.comment);
          return (
            <div key={r.id} className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-medium text-charcoal text-sm">{restaurantName(r.restaurantId)}</p>
                  <p className="text-xs text-charcoal/50">{r.userName} · {r.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars value={r.rating} />
                  <Badge tone={SENTIMENT_TONE[sentiment.overall]}>{sentiment.overall}</Badge>
                  <Badge tone={r.status === 'approved' ? 'emerald' : 'charcoal'}>{r.status}</Badge>
                </div>
              </div>
              <p className="text-sm text-charcoal/70 mt-2">{r.comment}</p>
              <div className="flex gap-3 mt-3 text-xs font-medium">
                {r.status === 'approved' ? (
                  <button onClick={() => updateReviewStatus(r.id, 'hidden')} className="text-gold-600 hover:underline">Hide</button>
                ) : (
                  <button onClick={() => updateReviewStatus(r.id, 'approved')} className="text-emerald-700 hover:underline">Approve</button>
                )}
                <button onClick={() => deleteReview(r.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
