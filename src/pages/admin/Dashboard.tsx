import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Store, Utensils, UserCircle, MessageSquare, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import RatingStars from '../../components/RatingStars';
import Badge from '../../components/Badge';
import { adminUsers } from '../../data/users';

const PIE_COLORS = ['#157a56', '#DB9A3A', '#7ccfa9', '#1F2421', '#45b285', '#E7E2D6', '#C4832A'];
const ACTIVITY_DATA = [
  { day: 'Mon', users: 40 }, { day: 'Tue', users: 52 }, { day: 'Wed', users: 48 },
  { day: 'Thu', users: 61 }, { day: 'Fri', users: 74 }, { day: 'Sat', users: 88 }, { day: 'Sun', users: 65 },
];

export default function AdminDashboard() {
  const { restaurants, menuItems, reviews, history } = useApp();

  const cuisineCounts: Record<string, number> = {};
  restaurants.forEach((r) => r.cuisines.forEach((c) => { cuisineCounts[c] = (cuisineCounts[c] || 0) + 1; }));
  const cuisineData = Object.entries(cuisineCounts).map(([name, value]) => ({ name, value }));

  const stats = [
    { label: 'Total Restaurants', value: restaurants.length, icon: Store },
    { label: 'Total Menu Items', value: `${menuItems.length}+`, icon: Utensils },
    { label: 'Registered Users', value: adminUsers.length + 118, icon: UserCircle },
    { label: 'Reviews', value: reviews.length, icon: MessageSquare },
    { label: 'Recommendations Generated', value: history.length * 46 + 1200, icon: TrendingUp },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-1">Dashboard</h1>
      <p className="text-charcoal/50 text-sm mb-6">Prototype Mode — demo metrics, not live production data.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5">
          <p className="text-sm font-medium text-charcoal mb-3">Restaurant Categories</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={cuisineData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} label>
                {cuisineData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5">
          <p className="text-sm font-medium text-charcoal mb-3">User Activity (7 days, demo)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ACTIVITY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#157a56" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5">
        <p className="text-sm font-medium text-charcoal mb-3">Restaurants (Demo Dataset)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="pb-2 pr-4">Restaurant</th><th className="pb-2 pr-4">Area</th><th className="pb-2 pr-4">Cuisine</th><th className="pb-2 pr-4">Rating</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.slice(0, 8).map((r) => (
                <tr key={r.id} className="border-b border-charcoal/5">
                  <td className="py-2.5 pr-4 font-medium text-charcoal">{r.name}</td>
                  <td className="py-2.5 pr-4 text-charcoal/60">{r.area}</td>
                  <td className="py-2.5 pr-4 text-charcoal/60">{r.cuisines[0]}</td>
                  <td className="py-2.5 pr-4"><RatingStars value={r.rating} /></td>
                  <td className="py-2.5"><Badge tone={r.isOpen ? 'emerald' : 'red'}>{r.isOpen ? 'Open' : 'Closed'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
