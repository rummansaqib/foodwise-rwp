import { NavLink } from 'react-router-dom';
import { Home, Search, Store, History, User } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/find-food', label: 'Find', icon: Search },
  { to: '/restaurants', label: 'Restaurants', icon: Store },
  { to: '/history', label: 'History', icon: History },
  { to: '/account', label: 'Profile', icon: User },
];

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-charcoal/10 flex justify-around py-2">
      {ITEMS.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] px-2 ${isActive ? 'text-emerald-700' : 'text-charcoal/50'}`}
        >
          <it.icon className="w-5 h-5" />
          {it.label}
        </NavLink>
      ))}
    </nav>
  );
}
