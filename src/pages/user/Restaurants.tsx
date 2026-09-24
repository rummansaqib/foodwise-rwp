import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RestaurantCard from '../../components/RestaurantCard';
import EmptyState from '../../components/EmptyState';

type SortKey = 'recommended' | 'rating' | 'nearest' | 'price' | 'newest';

export default function Restaurants() {
  const { restaurants, menuItems } = useApp();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [sort, setSort] = useState<SortKey>('recommended');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = restaurants;
    if (q) {
      const matchingRestaurantIds = new Set(
        menuItems.filter((m) => m.name.toLowerCase().includes(q)).map((m) => m.restaurantId),
      );
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
        matchingRestaurantIds.has(r.id));
    }
    const sorted = [...list];
    switch (sort) {
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'nearest': sorted.sort((a, b) => a.distance - b.distance); break;
      case 'price': sorted.sort((a, b) => a.priceLevel - b.priceLevel); break;
      case 'newest': sorted.sort((a, b) => (a.openingDate < b.openingDate ? 1 : -1)); break;
      default: sorted.sort((a, b) => b.rating - a.rating || a.distance - b.distance);
    }
    return sorted;
  }, [restaurants, menuItems, query, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 pb-16">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-1">Restaurants</h1>
      <p className="text-charcoal/60 text-sm mb-6">Demo Dataset — a sample of Rawalpindi restaurants for this prototype, not a complete listing.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center bg-white border border-charcoal/10 rounded-full px-4 py-2.5 flex-1">
          <Search className="w-4 h-4 text-charcoal/40 mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants or food (e.g. biryani)..."
            aria-label="Search restaurants or food"
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border border-charcoal/15 rounded-full px-4 py-2.5 text-sm bg-white"
          aria-label="Sort restaurants"
        >
          <option value="recommended">Recommended</option>
          <option value="rating">Highest Rated</option>
          <option value="nearest">Nearest</option>
          <option value="price">Lowest Price</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-6 h-6" />}
          title="No exact matches found"
          message="Try a different search term, or browse the full list by clearing your search."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
}
