import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Star, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RatingStars from '../../components/RatingStars';
import Badge from '../../components/Badge';
import FoodCard from '../../components/FoodCard';
import Modal from '../../components/Modal';
import ReviewCard from '../../components/ReviewCard';
import EmptyState from '../../components/EmptyState';
import { FoodItem, Review } from '../../types';

export default function RestaurantDetails() {
  const { id } = useParams();
  const {
    restaurants, menuItems, reviews, profile, isFavorite, toggleFavorite, addReview, isConnected, authUser,
  } = useApp();
  const [category, setCategory] = useState<string>('All');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [meal, setMeal] = useState<FoodItem[]>([]);

  const restaurant = restaurants.find((r) => r.id === id);
  const menu = useMemo(() => menuItems.filter((m) => m.restaurantId === id), [menuItems, id]);
  const restaurantReviews = useMemo(
    () => reviews.filter((r) => r.restaurantId === id && r.status === 'approved').sort((a, b) => (a.date < b.date ? 1 : -1)),
    [reviews, id],
  );
  const categories = ['All', ...Array.from(new Set(menu.map((m) => m.category)))];
  const filteredMenu = category === 'All' ? menu : menu.filter((m) => m.category === category);

  if (!restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState icon={<MapPin className="w-6 h-6" />} title="Restaurant not found" message="It may have been removed from the demo dataset." actionLabel="Back to Restaurants" actionTo="/restaurants" />
      </div>
    );
  }

  const fav = isFavorite({ restaurantId: restaurant.id });
  const mealTotal = meal.reduce((sum, f) => sum + f.price, 0);

  const insight = restaurantReviews.length
    ? {
        taste: avg(restaurantReviews.map((r) => r.foodQuality)),
        portion: avg(restaurantReviews.map((r) => r.portion)),
        price: avg(restaurantReviews.map((r) => r.price)),
        service: avg(restaurantReviews.map((r) => r.service)),
        cleanliness: avg(restaurantReviews.map((r) => r.cleanliness)),
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 pb-16">
      <div className="rounded-xl2 overflow-hidden h-56 md:h-72 relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <button
          onClick={() => toggleFavorite({ restaurantId: restaurant.id })}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 h-5 ${fav ? 'fill-red-500 text-red-500' : 'text-charcoal/50'}`} />
        </button>
      </div>

      <div className="mt-5">
        <h1 className="font-display text-2xl font-bold text-charcoal">{restaurant.name}</h1>
        <div className="flex items-center gap-3 text-sm text-charcoal/60 mt-1 flex-wrap">
          <RatingStars value={restaurant.rating} size="md" />
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{restaurant.area}, Rawalpindi</span>
          <Badge tone={restaurant.isOpen ? 'emerald' : 'red'}>{restaurant.isOpen ? 'Open Now' : 'Closed'}</Badge>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {restaurant.cuisines.map((c) => <Badge key={c}>{c}</Badge>)}
        </div>
        <p className="text-sm text-charcoal/60 mt-3">{restaurant.description}</p>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Link to="/find-food" className="text-sm font-medium text-white bg-emerald-700 rounded-lg px-4 py-2 hover:bg-emerald-800 transition-colors">Get Recommendation</Link>
          <button onClick={() => setShowReviewForm(true)} className="text-sm font-medium text-emerald-700 border border-emerald-200 rounded-lg px-4 py-2 hover:bg-emerald-50 transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Write Review
          </button>
        </div>
      </div>

      {insight && (
        <div className="mt-6 bg-white rounded-xl border border-charcoal/5 shadow-soft p-4">
          <p className="text-xs font-medium text-emerald-700 mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI-generated review insights</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {(['taste', 'portion', 'price', 'service', 'cleanliness'] as const).map((k) => (
              <div key={k}>
                <p className="text-xs text-charcoal/50 capitalize">{k}</p>
                <div className="flex justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(insight[k]) ? 'fill-gold-500 text-gold-500' : 'text-charcoal/15'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-3">Menu</h2>
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${category === c ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15 text-charcoal/70'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredMenu.map((food) => (
            <FoodCard key={food.id} food={food} profile={profile} onAdd={(f) => setMeal((m) => [...m, f])} />
          ))}
        </div>
        <p className="text-xs text-charcoal/40 mt-4">Nutrition values shown are demonstration data. Actual values should be verified with restaurants/nutrition sources.</p>
      </div>

      {meal.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-charcoal text-white rounded-full px-5 py-3 shadow-lift flex items-center gap-4 z-30">
          <span className="text-sm">{meal.length} item{meal.length > 1 ? 's' : ''} · Rs. {mealTotal.toLocaleString()}</span>
          <button onClick={() => setMeal([])} className="text-xs text-cream/70 underline">Clear</button>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-3">Reviews</h2>
        {restaurantReviews.length === 0 ? (
          <EmptyState icon={<MessageSquare className="w-6 h-6" />} title="No reviews yet" message="Be the first to share your experience at this restaurant." />
        ) : (
          <div className="space-y-3">
            {restaurantReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>

      <ReviewFormModal
        open={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSubmit={(data) => {
          const review: Review = {
            id: `rev${Date.now()}`,
            restaurantId: restaurant.id,
            userId: isConnected ? String(authUser!.id) : profile.id,
            userName: isConnected ? authUser!.name : profile.name,
            date: new Date().toISOString().slice(0, 10),
            status: 'approved',
            ...data,
          };
          addReview(review);
          setShowReviewForm(false);
        }}
      />
    </div>
  );
}

function avg(nums: number[]) { return nums.reduce((a, b) => a + b, 0) / nums.length; }

function ReviewFormModal({
  open, onClose, onSubmit,
}: { open: boolean; onClose: () => void; onSubmit: (data: Omit<Review, 'id' | 'restaurantId' | 'userId' | 'userName' | 'date' | 'status'>) => void }) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [foodQuality, setFoodQuality] = useState(4);
  const [service, setService] = useState(4);
  const [portion, setPortion] = useState(4);
  const [price, setPrice] = useState(4);
  const [cleanliness, setCleanliness] = useState(4);

  const field = (label: string, value: number, setValue: (n: number) => void) => (
    <div>
      <label className="text-xs font-medium text-charcoal/60 block mb-1">{label}: {value}</label>
      <input type="range" min={1} max={5} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-emerald-700" />
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Write a Review">
      <div className="space-y-3">
        {field('Overall Rating', rating, setRating)}
        <div>
          <label className="text-xs font-medium text-charcoal/60 block mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Food was amazing but service was slow..."
            className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field('Food Quality', foodQuality, setFoodQuality)}
          {field('Service', service, setService)}
          {field('Portion', portion, setPortion)}
          {field('Price', price, setPrice)}
        </div>
        {field('Cleanliness', cleanliness, setCleanliness)}
        <button
          disabled={!comment.trim()}
          onClick={() => onSubmit({ rating, comment, foodQuality, service, portion, price, cleanliness })}
          className="w-full bg-emerald-700 disabled:opacity-40 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </Modal>
  );
}
