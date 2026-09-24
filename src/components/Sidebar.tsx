import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Store, Utensils, Users, MessageSquare, BarChart3, Database, Settings, Leaf, LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { to: '/admin/menus', label: 'Menus', icon: Utensils },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { to: '/admin/analytics', label: 'Recommendation Analytics', icon: BarChart3 },
  { to: '/admin/data', label: 'Data Management', icon: Database },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { setRole } = useApp();
  return (
    <div className="w-60 shrink-0 bg-charcoal text-cream/90 min-h-screen hidden md:flex md:flex-col">
      <div className="p-5 flex items-center gap-2 border-b border-white/10">
        <Leaf className="w-5 h-5 text-emerald-400" />
        <span className="font-display font-semibold">FoodWise Admin</span>
      </div>
      <nav className="flex-1 py-4">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => `w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive ? 'bg-white/10 text-white border-r-2 border-emerald-400' : 'text-cream/60 hover:bg-white/5'}`}
          >
            <it.icon className="w-4 h-4" /> {it.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => setRole('user')} className="flex items-center gap-2 px-5 py-4 text-sm text-cream/60 hover:text-white border-t border-white/10">
        <LogOut className="w-4 h-4" /> Switch to User
      </button>
    </div>
  );
}
